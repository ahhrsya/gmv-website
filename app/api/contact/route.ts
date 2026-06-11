import { Resend } from 'resend';
import { generateContactEmailHtml, generateAutoReplyEmailHtml } from '@/lib/contact-email';

const resend = new Resend(process.env.RESEND_API_KEY);

const submissions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const MIN_FORM_TIME_MS = 2000;
const MAX_FORM_TIME_MS = 30 * 60 * 1000;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_URLS_IN_MESSAGE = 5;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = submissions.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, organization, market, message, website, formLoadedAt, lang } = body;

  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Anti-spam: honeypot
  if (website) {
    return Response.json({ error: 'Spam detected' }, { status: 400 });
  }

  // Anti-spam: time check
  const now = Date.now();
  if (formLoadedAt) {
    const elapsed = now - formLoadedAt;
    if (elapsed < MIN_FORM_TIME_MS) {
      return Response.json({ error: 'Form submitted too quickly' }, { status: 400 });
    }
    if (elapsed > MAX_FORM_TIME_MS) {
      return Response.json({ error: 'Form session expired' }, { status: 400 });
    }
  }

  // Anti-spam: content validation
  if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return Response.json({ error: 'Message length invalid' }, { status: 400 });
  }
  const urlCount = (message.match(/https?:\/\//gi) || []).length;
  if (urlCount > MAX_URLS_IN_MESSAGE) {
    return Response.json({ error: 'Message contains too many links' }, { status: 400 });
  }

  // Rate limit
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }

  // Send notification email to GMV
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'GMV <onboarding@resend.dev>',
    to: [process.env.RESEND_TO_EMAIL || 'globalminangventura@gmail.com'],
    replyTo: email,
    subject: lang === 'id'
      ? `Pesan Baru dari ${name}`
      : `New Contact Form Submission from ${name}`,
    html: generateContactEmailHtml({ name, email, organization, market, message, lang }),
    tags: [
      { name: 'source', value: 'contact-form' },
      { name: 'lang', value: lang || 'en' },
    ],
  });

  if (error) {
    console.error('Resend error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Send auto-reply to user (don't fail the request if this errors)
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'GMV <onboarding@resend.dev>',
      to: [email],
      subject: lang === 'id'
        ? 'Terima kasih sudah menghubungi Global Minang Ventura'
        : 'Thank you for reaching out to Global Minang Ventura',
      html: generateAutoReplyEmailHtml({ name, lang }),
      tags: [
        { name: 'source', value: 'auto-reply' },
        { name: 'lang', value: lang || 'en' },
      ],
    });
  } catch (autoReplyError) {
    console.error('Auto-reply error:', autoReplyError);
  }

  return Response.json({ success: true, id: data?.id });
}

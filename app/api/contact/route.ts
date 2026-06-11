import { Resend } from 'resend';
import { ContactEmail } from '@/components/ContactEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, organization, market, message, lang } = await request.json();

  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'GMV <onboarding@resend.dev>',
    to: [process.env.RESEND_TO_EMAIL || 'globalminangventura@gmail.com'],
    replyTo: email,
    subject: lang === 'id'
      ? `Pesan Baru dari ${name}`
      : `New Contact Form Submission from ${name}`,
    react: ContactEmail({ name, email, organization, market, message, lang }),
    tags: [
      { name: 'source', value: 'contact-form' },
      { name: 'lang', value: lang || 'en' },
    ],
  });

  if (error) {
    console.error('Resend error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, id: data?.id });
}

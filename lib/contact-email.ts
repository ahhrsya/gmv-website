interface ContactEmailData {
  name: string;
  email: string;
  organization?: string;
  market?: string;
  message: string;
  lang: string;
}

export function generateContactEmailHtml(data: ContactEmailData): string {
  const { name, email, organization, market, message, lang } = data;
  const isId = lang === 'id';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 32px; background: #f5f5f5; font-family: Manrope, system-ui, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 4px; overflow: hidden; }
    .header { background: #002156; padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -1px; }
    .body { padding: 32px; }
    .row { display: flex; padding: 8px 0; }
    .label { width: 140px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6B6B; }
    .value { font-size: 15px; color: #1A1A1A; }
    .message-value { font-size: 15px; color: #1A1A1A; line-height: 1.6; }
    .footer { padding: 16px 32px; background: #f5f5f5; border-top: 1px solid #e5e5e5; text-align: center; }
    .footer p { font-size: 12px; color: #A8A8A8; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isId ? 'Pesan Baru dari Website GMV' : 'New Message from GMV Website'}</h1>
    </div>
    <div class="body">
      <div class="row">
        <div class="label">${isId ? 'Nama' : 'Name'}</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      <div class="row">
        <div class="label">Email</div>
        <div class="value">${escapeHtml(email)}</div>
      </div>
      ${organization ? `
      <div class="row">
        <div class="label">${isId ? 'Organisasi' : 'Organization'}</div>
        <div class="value">${escapeHtml(organization)}</div>
      </div>` : ''}
      ${market ? `
      <div class="row">
        <div class="label">${isId ? 'Pasar / Wilayah' : 'Market / Region'}</div>
        <div class="value">${escapeHtml(market)}</div>
      </div>` : ''}
      <div class="row">
        <div class="label">${isId ? 'Pesan' : 'Message'}</div>
        <div class="message-value">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      <p>${isId ? 'Pesan ini dikirim melalui form kontak di website GMV.' : 'This message was sent via the contact form on the GMV website.'}</p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface AutoReplyData {
  name: string;
  lang: string;
}

export function generateAutoReplyEmailHtml(data: AutoReplyData): string {
  const { name, lang } = data;
  const isId = lang === 'id';
  const firstName = name.split(' ')[0] || name;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 32px; background: #f5f5f5; font-family: Manrope, system-ui, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 4px; overflow: hidden; }
    .header { background: #002156; padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -1px; }
    .body { padding: 32px; }
    .greeting { font-size: 18px; font-weight: 600; color: #1A1A1A; margin: 0 0 16px 0; }
    .text { font-size: 15px; color: #1A1A1A; line-height: 1.6; margin: 0 0 16px 0; }
    .cta-row { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
    .cta { display: inline-block; padding: 10px 20px; background: #002156; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 4px; }
    .footer { padding: 16px 32px; background: #f5f5f5; border-top: 1px solid #e5e5e5; text-align: center; }
    .footer p { font-size: 12px; color: #A8A8A8; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isId ? 'Terima Kasih' : 'Thank You'}</h1>
    </div>
    <div class="body">
      <p class="greeting">${isId ? `Halo ${escapeHtml(firstName)},` : `Hi ${escapeHtml(firstName)},`}</p>
      <p class="text">${isId
        ? 'Terima kasih sudah menghubungi Global Minang Ventura. Kami sudah menerima pesan Anda dan tim kami akan segera meninjaunya.'
        : 'Thank you for reaching out to Global Minang Ventura. We have received your message and our team will review it shortly.'}</p>
      <p class="text">${isId
        ? 'Kami akan menghubungi Anda dalam 1-2 hari kerja. Jika ada hal mendesak, jangan ragu untuk menghubungi kami langsung di globalminangventura@gmail.com.'
        : 'We will get back to you within 1-2 business days. If there is anything urgent, feel free to reach us directly at globalminangventura@gmail.com.'}</p>
      <p class="text">${isId ? 'Salam hangat,' : 'Warm regards,'}<br/><strong>${isId ? 'Tim Global Minang Ventura' : 'The Global Minang Ventura Team'}</strong></p>
    </div>
    <div class="footer">
      <p>${isId ? 'Email ini adalah konfirmasi otomatis. Mohon untuk tidak membalas email ini.' : 'This is an automated confirmation. Please do not reply to this email.'}</p>
    </div>
  </div>
</body>
</html>`;
}

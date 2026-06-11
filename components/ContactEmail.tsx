import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  organization?: string;
  market?: string;
  message: string;
  lang: string;
}

export function ContactEmail({ name, email, organization, market, message, lang }: ContactEmailProps) {
  const isId = lang === 'id';

  return (
    <div style={{ fontFamily: 'Manrope, system-ui, sans-serif', padding: '32px', background: '#f5f5f5' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', borderRadius: '4px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: '#002156', padding: '32px', textAlign: 'center' }}>
          <h1 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 600, margin: 0, letterSpacing: '-1px' }}>
            {isId ? 'Pesan Baru dari Website GMV' : 'New Message from GMV Website'}
          </h1>
        </div>

        {/* Body */}
        <div style={{ padding: '32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', width: '140px' }}>
                  {isId ? 'Nama' : 'Name'}
                </td>
                <td style={{ padding: '8px 0', fontSize: '15px', color: '#1A1A1A' }}>
                  {name}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                  Email
                </td>
                <td style={{ padding: '8px 0', fontSize: '15px', color: '#1A1A1A' }}>
                  {email}
                </td>
              </tr>
              {organization && (
                <tr>
                  <td style={{ padding: '8px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                    {isId ? 'Organisasi' : 'Organization'}
                  </td>
                  <td style={{ padding: '8px 0', fontSize: '15px', color: '#1A1A1A' }}>
                    {organization}
                  </td>
                </tr>
              )}
              {market && (
                <tr>
                  <td style={{ padding: '8px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                    {isId ? 'Pasar / Wilayah' : 'Market / Region'}
                  </td>
                  <td style={{ padding: '8px 0', fontSize: '15px', color: '#1A1A1A' }}>
                    {market}
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '8px 0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', verticalAlign: 'top' }}>
                  {isId ? 'Pesan' : 'Message'}
                </td>
                <td style={{ padding: '8px 0', fontSize: '15px', color: '#1A1A1A', lineHeight: 1.6 }}>
                  {message}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 32px', background: '#f5f5f5', borderTop: '1px solid #e5e5e5', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#A8A8A8', margin: 0 }}>
            {isId ? 'Pesan ini dikirim melalui form kontak di website GMV.' : 'This message was sent via the contact form on the GMV website.'}
          </p>
        </div>
      </div>
    </div>
  );
}

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
  const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
  const TO_EMAIL = process.env.TO_EMAIL || process.env.SMTP_USER;

  if (!SMTP_USER || !SMTP_PASS) {
    res.status(500).json({ error: 'SMTP not configured. Set SMTP_USER and SMTP_PASS in environment.' });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });

    const mailOptions = {
      from: `${name} <${SMTP_USER}>`,
      to: TO_EMAIL,
      subject: subject && subject.length ? `Website contact: ${subject}` : `Website contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g,'<br>')}</p>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

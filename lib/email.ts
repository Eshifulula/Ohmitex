import nodemailer from 'nodemailer';

// Transporter is created lazily inside sendEmail() to avoid a module-level
// crash if SMTP env vars are missing or misconfigured at startup.

interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
    // Skip if email is not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('[Email] SMTP not configured, skipping email send');
        return false;
    }

    // Create transporter lazily — avoids module-level crash if SMTP env vars are missing
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Ohmitex Website" <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
        console.log(`[Email] Sent: ${options.subject}`);
        return true;
    } catch (error) {
        console.error('[Email] Failed to send:', error);
        return false;
    }
}


interface LeadNotificationData {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
}

export async function sendLeadNotification(lead: LeadNotificationData): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    if (!adminEmail) {
        console.log('[Email] No admin email configured');
        return false;
    }

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #003366; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #003366; }
                .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
                .message { white-space: pre-wrap; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .button { display: inline-block; background: #6BBE45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0;">🎯 New Lead Received!</h1>
                    <p style="margin: 10px 0 0;">Ohmitex Smart Controls Website</p>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">👤 Name</div>
                        <div class="value">${lead.name}</div>
                    </div>
                    <div class="field">
                        <div class="label">📧 Email</div>
                        <div class="value"><a href="mailto:${lead.email}">${lead.email}</a></div>
                    </div>
                    ${lead.phone ? `
                    <div class="field">
                        <div class="label">📞 Phone</div>
                        <div class="value"><a href="tel:${lead.phone}">${lead.phone}</a></div>
                    </div>
                    ` : ''}
                    ${lead.company ? `
                    <div class="field">
                        <div class="label">🏢 Company</div>
                        <div class="value">${lead.company}</div>
                    </div>
                    ` : ''}
                    <div class="field">
                        <div class="label">💬 Message</div>
                        <div class="value message">${lead.message}</div>
                    </div>
                    <div style="text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/leads" class="button">View in Admin Panel</a>
                    </div>
                </div>
                <div class="footer">
                    <p>This is an automated notification from your Ohmitex website.</p>
                    <p>Time: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const text = `
New Lead Received - Ohmitex Website

Name: ${lead.name}
Email: ${lead.email}
${lead.phone ? `Phone: ${lead.phone}` : ''}
${lead.company ? `Company: ${lead.company}` : ''}

Message:
${lead.message}

---
View in Admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin/leads
    `.trim();

    return sendEmail({
        to: adminEmail,
        subject: `🎯 New Lead: ${lead.name}${lead.company ? ` from ${lead.company}` : ''}`,
        html,
        text,
    });
}

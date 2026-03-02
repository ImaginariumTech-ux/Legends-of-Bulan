import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { name, email, role, message } = await request.json();

        // Basic validation
        if (!name?.trim() || !email?.trim() || !role?.trim() || !message?.trim()) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        // 1 ─ Append row to Google Sheet via Apps Script webhook
        const scriptUrl = process.env.GOOGLE_SCRIPT_URL!;
        try {
            await fetch(scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role, message }),
            });
        } catch (sheetError) {
            console.error('Google Sheets write failed:', sheetError);
            // Non-fatal — still send the email
        }

        // 2 ─ Send notification email via Resend
        await resend.emails.send({
            from: 'LOB Contact <onboarding@resend.dev>',
            to: process.env.NOTIFICATION_EMAIL!,
            subject: `New Submission from ${name} — Legends of Bulan`,
            html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; padding: 40px 32px; border: 1px solid #b45309;">
          <h2 style="color: #f59e0b; margin-top: 0; letter-spacing: 0.1em; text-transform: uppercase; font-size: 14px;">New 'Create with us' Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a; color: #888; width: 100px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a;">${name}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a; color: #888;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a;"><a href="mailto:${email}" style="color: #f59e0b;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a; color: #888;">Role</td><td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a; text-transform: capitalize;">${role}</td></tr>
          </table>
          <div style="margin-top: 24px;">
            <p style="color: #888; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
            <p style="background: #1a1a1a; padding: 16px; border-left: 3px solid #b45309; margin: 0; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 32px; font-size: 11px; color: #555; text-align: center; letter-spacing: 0.2em; text-transform: uppercase;">Legends of Bulan — Magic Carpet Studios</p>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

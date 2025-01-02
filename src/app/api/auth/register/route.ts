import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const { firstname, lastname, nickname, email, password } = await req.json();
  const preferedLanguage = 'en';
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationToken = uuidv4(); // Generate a unique token
  const client = await db.connect();

  try {
    // Check if the email or nickname already exists
    const existingUser = await client.sql`
      SELECT * FROM users WHERE email = ${email} OR nickname = ${nickname};
    `;

    if ((existingUser.rowCount ?? 0) > 0) {
      const existingRecord = existingUser.rows[0];

      if (existingRecord.email === email) {
        return NextResponse.json({ error: 'email-already-exists' }, { status: 400 });
      } else if (existingRecord.nickname === nickname) {
        return NextResponse.json({ error: 'nickname-already-exists' }, { status: 400 });
      }
    }

    // Define the confirmation URL
    const { origin } = new URL(req.url);
    const confirmationUrl = `${origin}/api/auth/confirm-email?token=${confirmationToken}`;

    if (!process.env.NEXT_PUBLIC_SUPPORT_EMAIL || !process.env.SUPPORT_EMAIL_PASSWORD) {
      throw new Error('Missing PUBLIC_SUPPORT_EMAIL credentials');
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    // Send an email to the user with the confirmation URL
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
      to: email,
      subject: 'Please confirm your email',
      html: `To start using Hypertube, please confirm your email by clicking the following link: <a href="${confirmationUrl}">Confirm your email</a>.`,
    });

    // create fake data for the user (because we use the same DB as in Matcha project)
    const fakeBirthday = new Date('2000-01-01').toISOString();
    const fakeSex = 'male';
    const fakeSexPreferences = 'women';

    // If the email was sent successfully, insert the user into the database
    await client.sql`
      INSERT INTO users (firstname, lastname, nickname, email, password, birthdate, sex, registration_date, last_action, online, confirmed, service_token, sex_preferences, preferred_language)
      VALUES (${firstname}, ${lastname}, ${nickname}, ${email}, ${hashedPassword}, ${fakeBirthday}, ${fakeSex}, NOW(), NOW(), false, false, ${confirmationToken}, ${fakeSexPreferences}, ${preferedLanguage});
    `;

    return NextResponse.json({
      message: 'user-registered-successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'failed-to-register-user' }, { status: 500 });
  } finally {
    client.release();
  }
}

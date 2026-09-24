import { NextResponse } from 'next/server';
import { usersDb } from '../_storage/usersStorage';
import { db } from '@/db';
import crypto from 'crypto';
import { mailer } from '@/shared/api/mail';
import { apiSuccess, apiError } from '../../_utils';
import { passwordResetTokensTable } from '@/db/schema';
import { getResetPasswordTemplate } from '../_templates/getResetPasswordTemplate';

export const dynamic = 'force-dynamic';

const FORGOT_PASSWORD_MESSAGES = {
  VALIDATION: {
    EMAIL_REQUIRED: 'Электронная почта обязательна для заполнения',
    SERVER_ERROR: 'Внутренняя ошибка сервера при обработке запроса',
  },
} as const;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!body || !body.email || typeof body.email !== 'string') {
      return apiError(FORGOT_PASSWORD_MESSAGES.VALIDATION.EMAIL_REQUIRED, 400);
    }

    const emailClean = body.email.trim().toLowerCase();
    const user = await usersDb.findUserByEmail(emailClean);

    if (!user) {
      console.log(
        `[AUTH RESET] Запрос для несуществующего Email: ${emailClean}`,
      );
      return apiSuccess({ success: true });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 3600000;

    await db.insert(passwordResetTokensTable).values({
      userId: user.id,
      token: resetToken,
      expiresAt: expiresAt,
    });

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const resetLink = `${protocol}://${host}/auth/reset-password?token=${resetToken}`;

    console.log(
      `[AUTH RESET] Ссылка сгенерирована для ${user.username}: ${resetLink}`,
    );

    await mailer.emails.send({
      from: 'Личный Видео-Хаб <onboarding@resend.dev>',
      to: emailClean,
      subject: '🔒 Сброс пароля в вашем Видео-Хабе',
      html: getResetPasswordTemplate({
        username: user.username,
        resetLink: resetLink,
      }),
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[FORGOT_PASSWORD_ROUTE_ERROR]', error);
    return apiError(FORGOT_PASSWORD_MESSAGES.VALIDATION.SERVER_ERROR, 500);
  }
}

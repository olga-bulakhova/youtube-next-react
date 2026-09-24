interface ResetPasswordTemplateProps {
  username: string;
  resetLink: string;
}

/**
 * 📧 ХЕЛПЕР: Генерирует адаптивную HTML-верстку письма для сброса пароля.
 * Вынесено из основного роута для поддержания чистоты кода [0.2].
 */
export function getResetPasswordTemplate({
  username,
  resetLink,
}: ResetPasswordTemplateProps): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background-color: #09090b; color: #f4f4f5; border-radius: 16px; border: 1px solid #27272a;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #10b981; padding: 6px 12px; font-size: 12px; font-weight: 500; border-radius: 9999px;">
          Безопасность аккаунта
        </span>
      </div>
      
      <h2 style="color: #ffffff; text-align: center; font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">
        Восстановление доступа
      </h2>
      
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px 0; text-align: center;">
        Привет, <strong>${username}</strong>!<br>
        Мы получили запрос на сброс пароля для вашего личного видео-хаба. 
        Если вы этого не делали, просто проигнорируйте и удалите это письмо.
      </p>
      
      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetLink}" style="background-color: #10b981; color: #09090b; padding: 12px 24px; font-weight: 600; font-size: 13px; text-decoration: none; border-radius: 12px; display: inline-block;">
          Установить новый пароль
        </a>
      </div>
      
      <p style="font-size: 11px; line-height: 1.5; color: #52525b; text-align: center; border-top: 1px solid #27272a; padding-top: 16px; margin: 24px 0 0 0;">
        Ссылка действительна в течение 1 часа.<br>
        Если кнопка выше не работает, скопируйте эту ссылку в браузер:<br>
        <a href="${resetLink}" style="color: #10b981; text-decoration: none; word-break: break-all;">${resetLink}</a>
      </p>
    </div>
  `;
}

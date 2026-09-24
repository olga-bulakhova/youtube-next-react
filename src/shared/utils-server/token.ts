import { serverEnv } from './serverEnv';

interface TokenPayload {
  userId: number;
  username: string;
}

const TOKEN_PREFIX = serverEnv.TOKEN_PREFIX;

export const generateToken = (payload: TokenPayload): string => {
  try {
    const jsonString = JSON.stringify(payload);

    const base64Hash = Buffer.from(jsonString, 'utf-8').toString('base64');

    return `${TOKEN_PREFIX}${base64Hash}`;
  } catch (error) {
    console.error('Ошибка при генерации токена авторизации:', error);
    throw new Error('Не удалось сгенерировать сессионный токен');
  }
};

export const getUserDataFromToken = (
  fullTokenString: string | undefined,
): TokenPayload | null => {
  if (!fullTokenString || !fullTokenString.startsWith(TOKEN_PREFIX)) {
    return null;
  }

  try {
    const base64Part = fullTokenString.replace(TOKEN_PREFIX, '');

    const jsonString = Buffer.from(base64Part, 'base64').toString('utf-8');

    return JSON.parse(jsonString) as TokenPayload;
  } catch (error) {
    console.error('Ошибка расшифровки токена авторизации:', error);
    return null;
  }
};

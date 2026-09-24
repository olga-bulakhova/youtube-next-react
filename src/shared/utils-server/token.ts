import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { serverEnv } from './serverEnv';

export interface TokenPayload {
  userId: number;
  username: string;
}

const JWT_SECRET = serverEnv.JWT_SECRET || process.env.JWT_SECRET;
const TOKEN_PREFIX = serverEnv.TOKEN_PREFIX || 'HUB_';

if (!JWT_SECRET) {
  throw new Error(
    '❌ [JWT_SYSTEM] Критическая ошибка: Переменная JWT_SECRET отсутствует в окружении!',
  );
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export const generateToken = async (payload: TokenPayload): Promise<string> => {
  try {
    const jwt = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey);

    return `${TOKEN_PREFIX}${jwt}`;
  } catch (error) {
    console.error('Ошибка при генерации токена авторизации:', error);
    throw new Error('Не удалось сгенерировать сессионный токен');
  }
};

export const getUserDataFromToken = async (
  fullTokenString: string | undefined,
): Promise<TokenPayload | null> => {
  if (!fullTokenString || !fullTokenString.startsWith(TOKEN_PREFIX)) {
    return null;
  }

  try {
    const jwt = fullTokenString.replace(TOKEN_PREFIX, '');

    const { payload } = await jwtVerify(jwt, secretKey, {
      algorithms: ['HS256'],
    });

    return {
      userId: payload.userId as number,
      username: payload.username as string,
    };
  } catch (error) {
    console.error('Ошибка валидации/истечения токена авторизации:', error);
    return null;
  }
};

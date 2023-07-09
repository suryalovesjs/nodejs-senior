import { randomBytes } from 'crypto';

export const generateRandomCode = (length: number): string =>
  randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .substring(0, length);

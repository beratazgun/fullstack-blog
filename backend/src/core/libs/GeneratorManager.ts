import * as crypto from 'crypto';
import { customAlphabet, nanoid } from 'nanoid';

interface GenerateRandomIdInterface {
  length: number;
  type: 'text' | 'number' | 'textAndNumber';
  prefix?: 'ADID' | 'USID' | 'IMID' | 'RLID';
}

interface GenerateRedisKeyInterface {
  prefix: string;
  suffix: string;
  separator?: string;
}

class GeneratorManager {
  /**
   * Generate a hashed token
   * @param charLength - The length of the token
   * @returns The generated hashed token
   * @example
   * generateHashedToken(10)
   * returns 'a1b2c3d4e5'
   */
  static generateHashedToken(charLength: number): string {
    const token = crypto.randomBytes(charLength).toString('hex'); // unencrypted token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex'); // encrypted token
    return hashedToken;
  }

  /**
   * Generate a random id
   * @param length - The length of the id
   * @param type - The type of the id
   * @param prefix - The prefix of the id
   * @returns The generated id
   *
   * @example
  
   * ```typescript
   * generateRandomId({
   *   length: 12,
   *   type: 'number',
   *   prefix: 'RLID',
   * }) // 'RLID123456789'
   * ```
   *
   */
  static generateRandomId({
    length,
    type = 'textAndNumber',
    prefix,
  }: GenerateRandomIdInterface): string {
    const randomId = nanoid(length);

    if (type === 'number') {
      const randomNumber: (size?: number) => string = customAlphabet(
        '0123456789',
        length,
      );
      return (prefix ? `${prefix}${randomNumber()}` : randomNumber()) as string;
    }

    return prefix ? `${prefix}${randomId}` : randomId;
  }

  /**
   * Generate a redis key
   * @param prefix - The prefix of the key
   * @param suffix - The suffix of the key
   * @param separator - The separator of the key
   * @returns The generated redis key
   *
   * @example
   * ```typescript
   * generateRedisKey({
   *  prefix: 'user',
   *  suffix: '123456789',
   * }) // 'user#123456789'
   * ```
   */
  static generateRedisKey({
    prefix,
    suffix,
    separator = '#',
  }: GenerateRedisKeyInterface): string {
    return `${prefix}${separator}${suffix}`;
  }
  // static generateRedisKey(
  //   prefix: string,
  //   suffix: string,
  //   separator: string = '#',
  // ): string {
  //   return `${prefix}${separator}${suffix}`;
  // }
}

export { GeneratorManager };

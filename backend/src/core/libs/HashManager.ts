import bcrypt from 'bcryptjs';

class Hashmanager {
  /**
   *
   * @param plainPassword
   * @returns
   * @description This method takes plain password as a parameter
   * and returns hashed password.
   */
  static async hashPassword(plainPassword: string) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  }

  /**
   *
   * @param plainPassword
   * @param hashedPassword
   * @returns
   * @description This method compares plain password with hashed password
   * and returns true if they are equal, otherwise returns false.
   */
  static async comparePassword(plainPassword: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  }
}

export default Hashmanager;

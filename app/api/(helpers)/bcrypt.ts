import bcrypt from 'bcrypt';



export const comparePasswords = async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  };
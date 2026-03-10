import JWT from 'jsonwebtoken';

export const generateToken = async (userId: string) => {
    return JWT.sign({ userId },
        process.env.JWT_SECRET as string);
};
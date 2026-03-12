import JWT from 'jsonwebtoken';

interface TokenPayload {
    id: string,
    role: string;
};

export const generateToken = (payload: TokenPayload): string => {
    return JWT.sign({ payload },
        process.env.JWT_SECRET as string);
};

export const verifyToken = (token: string) => {
    try {
        return JWT.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    } catch (err) {
        console.log('Falha JWT: ', err);
    }
};
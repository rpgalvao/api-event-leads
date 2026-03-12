import JWT from 'jsonwebtoken';

type TokenPayload = {
    id: string,
    role: string;
};

export const generateToken = (payload: any): string => {
    return JWT.sign({ id: payload.id, role: payload.role },
        process.env.JWT_SECRET as string);
};

export const verifyToken = (token: string): TokenPayload | undefined => {
    try {
        const user = JWT.verify(token, process.env.JWT_SECRET as string) as any;
        const userData = user.payload ? user.payload : user;
        return userData as TokenPayload;
    } catch (err) {
        console.log('Falha JWT: ', err);
    }
};
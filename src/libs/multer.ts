import multer from "multer";
import path from "path";
import { v4 } from "uuid";

const tmpFolder = path.resolve(__dirname, '..', '..', 'uploads');

export const uploadConfig = {
    directory: tmpFolder,
    storage: multer.diskStorage({
        destination: tmpFolder,
        filename: (req, file, callback) => {
            const fileExtension = path.extname(file.originalname);
            const fileHash = v4();
            const fileName = `${fileHash}${fileExtension}`;
            return callback(null, fileName);
        },
    }),
    fileFilter: (req: any, file: any, callback: any) => {
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Tipo de arquivo inválido.'));
        }
    }
};
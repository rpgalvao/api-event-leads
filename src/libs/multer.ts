import multer from "multer";
import path from "path";
import { v4 } from "uuid";

export const UPLOADS_FOLDER = path.resolve(__dirname, '..', '..', '..', 'uploads');

export const uploadConfig = {
    directory: UPLOADS_FOLDER,
    storage: multer.diskStorage({
        destination: UPLOADS_FOLDER,
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
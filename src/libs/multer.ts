import multer from "multer";

export const uploadConfig = {
    // Agora o multer guarda o arquivo temporariamente na memória
    storage: multer.memoryStorage(),

    fileFilter: (req: any, file: any, callback: any) => {
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Tipo de arquivo inválido.'));
        }
    }
};
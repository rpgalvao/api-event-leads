import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { uploadConfig } from '../libs/multer';

export class StorageProvider {
    public async saveFile(file: string): Promise<void> {
        const originalPath = path.resolve(uploadConfig.directory, file);
        const finalPath = path.resolve(uploadConfig.directory, 'avatars', file);
        console.log('Salva original file: ', originalPath);
        console.log('Salva final file: ', finalPath);


        try {
            await sharp(originalPath)
                .resize(200, 200)
                .toFormat('jpg')
                .jpeg({ quality: 70 })
                .toFile(finalPath);

            await fs.unlink(originalPath);
        } catch (error) {
            console.error(`Erro ao processar a imagem com Sharp: ${error}`);
        }
    }

    public async deleteFile(file: string): Promise<void> {
        const filePath = path.resolve(uploadConfig.directory, 'avatars', file);
        console.log('Delete file: ', filePath);

        try {
            await fs.stat(filePath);
            await fs.unlink(filePath);
        } catch {
            return;
        }
    }
}
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Inicializa com as credenciais do seu .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class StorageProvider {
    // Atenção: agora recebemos um 'Buffer' e retornamos uma 'string' (a URL da imagem)
    public async saveFile(fileBuffer: Buffer, folder: 'avatars' | 'cards', size = 1024): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                // O seu processamento com o Sharp continua quase igual!
                const optimizedBuffer = await sharp(fileBuffer)
                    .resize(size)
                    .toFormat('jpg')
                    .jpeg({ quality: 70 })
                    .toBuffer(); // Mudamos de toFile() para toBuffer()

                // Prepara o tubo de envio para o Cloudinary
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: `eventlead/${folder}` },
                    (error, result) => {
                        if (error) return reject(error);
                        if (result) return resolve(result.secure_url); // Devolve o link pronto
                    }
                );

                // Joga o arquivo otimizado dentro do tubo
                Readable.from(optimizedBuffer).pipe(uploadStream);
            } catch (error) {
                console.error(`Erro ao processar a imagem com Sharp: ${error}`);
                reject(error);
            }
        });
    }

    public async deleteFile(fileUrl: string, folder: 'avatars' | 'cards'): Promise<void> {
        // Deixei o método aqui para não quebrar a sua interface.
        // Como o foco é fazer rodar, não se preocupe em deletar do Cloudinary agora.
        console.log('Arquivo para deletar da nuvem ignorado por enquanto:', fileUrl);
    }
}
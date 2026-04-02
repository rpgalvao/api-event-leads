import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from '../src/routes/index.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { UPLOADS_FOLDER } from './libs/multer';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import path from 'path';

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(helmet());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use('/files/cards', express.static(path.resolve(UPLOADS_FOLDER, 'cards')));
server.use('/files/avatars', express.static(path.resolve(UPLOADS_FOLDER, 'avatars')));

server.use(router);

server.use(errorMiddleware);

server.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
    console.log(process.env.NODE_ENVIRONMENT);
});
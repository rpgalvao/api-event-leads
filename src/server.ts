import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from '../src/routes/index.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { UPLOADS_FOLDER } from './libs/multer';

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(helmet());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use('/files', express.static(UPLOADS_FOLDER));

server.use(router);

server.use(errorMiddleware);

server.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
    console.log(process.env.NODE_ENVIRONMENT);
});
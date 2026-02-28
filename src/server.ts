import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from '../src/routes/index.routes';

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(helmet());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static('public'));

server.use(router);

server.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
    console.log(process.env.NODE_ENVIRONMENT);
});
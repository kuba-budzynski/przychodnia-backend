import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import configRoutes from './config/routes';
import configSwagger from './config/swagger';
import configHandleErrors from './config/handleError';
import { deleteSlotsInActive, exportSots } from './slots';
const cron = require('node-cron');

const server = express();

server.use(helmet());
server.use(cors());
server.use(bodyParser.json());

server.get('/', (req, res) => {
    res.send('OK');
});

cron.schedule('*/15 * * * *', deleteSlotsInActive);
cron.schedule('1 0 * * *', exportSots);

configSwagger(server);
configRoutes(server);
configHandleErrors(server);

export default server;

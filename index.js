import express from 'express';
import dotenv from 'dotenv';

//Config
import { connectDB } from './src/config/database.js';
import cLog from './src/config/cLog.js';

import { routerApi } from './src/routes/index.js';

//import middleware
import { boomErrorHandler, logError } from './src/middlewares/error.handler.js';
import { errorHandler } from './src/middlewares/error.handler.js';

const app = express();
dotenv.config();

const ip = process.env.SERVER_IP || 'localhost';
const port = process.env.SERVER_PORT || '3000';

connectDB();

app.use(express.json());

routerApi(app);

//add middleware in order
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, ip, () => {
	cLog.cyan(`\n[Server] Listening on ${ip}:${port}\n`);
});

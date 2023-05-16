import express from 'express';
import dotenv from 'dotenv';

//Config
import { connectDB } from './src/config/database.js';
import cLog from './src/utils/cLog.js';

//Routes
import { routerApi } from './src/routes/index.js';

//import middleware
import { boomErrorHandler, logError } from './src/middlewares/error.handler.js';
import { errorHandler } from './src/middlewares/error.handler.js';
import passport from 'passport';

const app = express();
dotenv.config();

const ip = process.env.SERVER_IP || 'localhost';
const port = process.env.PORT || '3030';

connectDB();

app.use(express.json());

app.use(passport.initialize());

routerApi(app);

app.get('/', (req, res) => {
	res.send('[Express] server running');
});

//add middleware in order
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, ip, () => {
	cLog.cyan(`\n[Server] Listening on ${ip}:${port}\n`);
});

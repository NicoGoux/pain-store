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

const port = process.env.PORT || '3030';

connectDB();

app.use(express.json());

app.use(passport.initialize());

app.get('/', (req, res) => {
	res.send('[Express] server running - ruta: /');
});

app.get('/api', (req, res) => {
	res.send('[Express] server running - ruta: /api');
});

routerApi(app);

//add middleware in order
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
	cLog.cyan(`\n[Server] Listening on ${ip}:${port}\n`);
});

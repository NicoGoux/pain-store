import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//Config
import { connectDB } from './config/database.js';
import cLog from './utils/cLog.js';

//Routes
import { routerApi } from './routes/index.js';

//import middleware
import { boomErrorHandler, logError } from './middlewares/error.handler.js';
import { errorHandler } from './middlewares/error.handler.js';
import passport from 'passport';

const app = express();
dotenv.config();

const port = process.env.PORT || '3030';

connectDB();

//cors
const whitelist = [
	'http://localhost:3000',
	'https://painstore.netlify.app',
	'http://190.246.87.32',
];
const cordsOptions = {
	origin: function (origin, callback) {
		cLog(`[connection] from: ${origin}`);
		if (whitelist.includes(origin) || !origin) {
			callback(null, true);
		} else {
			callback(new Error('CORS Error'));
		}
	},
};

app.use(cors(cordsOptions));
//Routing

app.use(express.json());
app.use(passport.initialize());

app.get('/api', (req, res) => {
	res.send('[Express] server running - ruta: /api');
});

routerApi(app);

//add middleware in order
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
	cLog.cyan(`\n[Server] Listening on ${port}\n`);
});

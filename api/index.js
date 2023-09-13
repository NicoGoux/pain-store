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

//Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import * as path from 'path';
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();

const port = process.env.PORT || '3030';

connectDB();

//cors
// TODO
// const whitelist = [
// 	'http://localhost:3000',
// 	'https://painstore.netlify.app',
// 	'http://190.246.87.32:5173',
// 	'http://190.246.87.32:*',
// 	'192.168.1.155:*',
// ];
// const cordsOptions = {
// 	origin: function (origin, callback) {
// 		cLog.yellow(`[connection] from: ${origin}`);
// 		if (whitelist.includes(origin) || !origin) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('CORS Error'));
// 		}
// 	},
// };

app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(passport.initialize());

// Swagger
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerSpec = {
	swaggerDefinition: {
		openapi: '3.0.3',
		info: {
			title: 'PAIN STORE API',
			version: '1.0.0',
		},
		servers: [{ url: 'https://pain-store.vercel.app/api/v1' }],
	},
	apis: [`${path.join(__dirname, './docs/**/*.yaml')}`],
};

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerSpec)));

routerApi(app);

//add middleware in order
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
	cLog.cyan(`\n[Server] Listening on ${port}\n`);
});

import express from 'express';
import {
	getMarketHashes,
	insertMarketHash,
} from '../../controllers/productControllers/marketHashController.js';
import { passportAuthJwt } from '../../config/auth/passportAuth.js';
import { checkRoles } from '../../middlewares/auth.handler.js';
import { accessLevel } from '../../config/auth/accessLevel.js';

const marketHashesRouter = express.Router();

//Get market hashes
marketHashesRouter.get('/', getMarketHashes);

//TODO Only for test
marketHashesRouter.post('/', passportAuthJwt, checkRoles(accessLevel.LEVEL_1), insertMarketHash);

export { marketHashesRouter };

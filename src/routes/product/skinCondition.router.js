import express from 'express';
import { getAll } from '../../controllers/skinConditionsController.js';

const skinConditionRouter = express.Router();

skinConditionRouter.get('/', getAll);

export { skinConditionRouter };

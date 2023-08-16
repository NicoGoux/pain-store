import express from 'express';
import { paymentMethodTypeRouter } from './paymentMethodTypes.router.js';

const paymentMethodRouter = express.Router();

// Purchase order statuses router
paymentMethodRouter.use('/payment-method-types', paymentMethodTypeRouter);

// paymentMethodRouter.get('/', getPaymentMethods);

export { paymentMethodRouter };

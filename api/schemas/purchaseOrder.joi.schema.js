import Joi from 'joi';

// Check user data
const firstName = Joi.string().alphanum().min(2).max(50).messages({
	'string.base': 'FirstName must be a string',
	'string.empty': 'FirstName cannot be empty',
	'string.min': 'FirstName must have at least {#limit} characters',
	'string.max': 'FirstName must have at most {#limit} characters',
	'any.required': 'FirstName is required',
});

const lastName = Joi.string().min(2).max(50).messages({
	'string.base': 'LastName must be a string',
	'string.empty': 'LastName cannot be empty',
	'string.min': 'LastName must have at least {#limit} characters',
	'string.max': 'LastName must have at most {#limit} characters',
	'any.required': 'LastName is required',
});

const tradeLink = Joi.string()
	.pattern(
		new RegExp(
			/^(https?:\/\/)?steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[a-zA-Z0-9-_]+$/
		)
	)
	.message('TradeLink must be a valid Steam trade link');

// Check products list
const products = Joi.array().min(1).messages({
	'array.base': 'Products must be an array',
	'array.min': 'At least one product must be included in products',
	'any.required': 'Products are required',
});

// Check extra data
const paymentMethodType = Joi.string().valid('TRANSFERENCIA', 'CRYPTOMONEDA').messages({
	'string.base': 'PaymentMethodType must be a string',
	'any.only': 'PaymentMethodType must be either TRANSFERENCIA or CRYPTOMONEDA',
	'any.required': 'PaymentMethodType is required',
});

const isCart = Joi.boolean().messages({
	'boolean.base': 'isCart must be a boolean',
	'any.required': 'isCart is required',
});

const createPurchaseOrderSchema = Joi.object({
	userData: {
		firstName: firstName.required(),
		lastName: lastName.required(),
		tradeLink: tradeLink.required(),
	},
	products: products.required(),
	paymentMethodType: paymentMethodType.required(),
	isCart: isCart.required(),
});

export { createPurchaseOrderSchema };

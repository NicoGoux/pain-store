import Joi from 'joi';

const pkProduct = Joi.string();
const name = Joi.string().min(3).max(50).messages({
	'string.base': 'Name must be a string',
	'string.empty': 'Name cannot be empty',
	'string.min': 'Name must have at least {#limit} characters',
	'string.max': 'Name must have at most {#limit} characters',
	'any.required': 'Name is required',
});

const marketHashString = Joi.string().min(3).max(50).messages({
	'string.base': 'MarketHash string must be a string',
	'string.empty': 'MarketHash string cannot be empty',
	'string.min': 'MarketHash string must have at least {#limit} characters',
	'string.max': 'MarketHash string must have at most {#limit} characters',
	'any.required': 'MarketHash string is required',
});

const categoryName = Joi.string().min(3).max(50).messages({
	'string.base': 'CategoryName must be a string',
	'string.empty': 'CategoryName cannot be empty',
	'string.min': 'CategoryName must have at least {#limit} characters',
	'string.max': 'CategoryName must have at most {#limit} characters',
	'any.required': 'CategoryName is required',
});

const skinConditionString = Joi.string().messages({
	'string.base': 'SkinCondition string must be a string',
	'string.empty': 'SkinCondition string cannot be empty',
	'any.required': 'Skin condition string is required',
});

const float = Joi.number().positive().messages({
	'number.base': 'Float must be a number',
	'number.positive': 'Float must be a positive number',
	'any.required': 'Float is required',
});

const tradeLock = Joi.date().allow(null).messages({
	'date.base': 'TradeLock must be a date',
});

const price = Joi.number().positive().messages({
	'number.base': 'Price must be a number',
	'number.positive': 'Price must be a positive number',
	'any.required': 'Price is required',
});

const productStatusString = Joi.string().messages({
	'any.required': 'ProductStatus is required',
});

const imageUrl = Joi.string().messages({
	'string.base': 'imageUrl string must be a string',
});

const createProductSchema = Joi.object({
	product: {
		name: name.required(),
		marketHash: {
			marketHashString: marketHashString.required(),
			category: {
				name: categoryName.required(),
			},
		},
		skinCondition: {
			skinConditionString: skinConditionString,
		},
		float: float,
		tradeLock: tradeLock,
		price: price.required(),
		imageUrl: imageUrl,
	},
});

const updateProductSchema = Joi.object({
	patch: {
		name: name,
		marketHash: marketHashString,
		category: categoryName,
		skinCondition: skinConditionString,
		float: float,
		tradeLock: tradeLock,
		price: price,
		imageUrl: imageUrl,
		productStatus: productStatusString,
	},
});

export { createProductSchema, updateProductSchema };

import Joi from 'joi';

const pkProduct = Joi.string();
const name = Joi.string().min(3);

const marketHashString = Joi.string().min(3);
const categoryName = Joi.string().min(3);

const skinConditionString = Joi.string();
const float = Joi.number().positive();
const tradeLock = Joi.date().allow(null);
const price = Joi.number().positive();
const productStatus = Joi.string();
const creationDate = Joi.date();

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
			skinConditionString: skinConditionString.required(),
		},
		float: float,
		tradeLock: tradeLock,
		price: price.required(),
	},
});

const updateProductSchema = Joi.object({
	patch: {
		name: name,
		marketHash: {
			marketHashString: marketHashString,
			category: {
				name: categoryName,
			},
		},
		skinCondition: {
			skinConditionString: skinConditionString,
		},
		float: float,
		tradeLock: tradeLock,
		price: price,
	},
});

export { createProductSchema, updateProductSchema };

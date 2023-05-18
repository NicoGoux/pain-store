import Joi from 'joi';

const email = Joi.string().email().messages({
	'string.email': 'Email must be a valid email address',
	'string.empty': 'Email cannot be empty',
	'any.required': 'Email is required',
});

const username = Joi.string().alphanum().min(3).max(16).messages({
	'string.base': 'Username must be a string',
	'string.empty': 'Username cannot be empty',
	'string.alphanum': 'Username must have alphanumeric characters only',
	'string.min': 'Username must have at least {#limit} alphanumeric characters',
	'string.max': 'Username must have at most {#limit} alphanumeric characters',
	'any.required': 'Username is required',
});

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

const password = Joi.string().messages({ 'any.required': 'Password is required' });

const confirmPassword = Joi.string().valid(Joi.ref('password')).messages({
	'any.only': 'ConfirmPassword must match password',
	'string.empty': 'ConfirmPassword cannot be empty',
	'any.required': 'ConfirmPassword is required',
});

const registerUserSchema = Joi.object({
	user: {
		email: email.required(),
		username: username.required(),
		firstName: firstName.required(),
		lastName: lastName.required(),
		password: password
			.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/) // one digit and one number in any position
			.min(6)
			.messages({
				'string.base': 'Password must be a string',
				'string.empty': 'Password cannot be empty',
				'string.min': 'Password must have at least {#limit} characters',
				'string.max': 'Password must have at most {#limit} characters',
				'string.pattern.base': 'Password must contain at least one number and one letter',
			})
			.required(),
		confirmPassword: confirmPassword.required(),
	},
});

const loginUserSchema = Joi.object({
	email: email.required(),
	password: password.required(),
});

const emailSchema = Joi.object({
	email: email.required(),
});

const confirmEmailSchema = Joi.object({
	emailConfirmToken: Joi.string().required(),
});

const recoveryPasswordSchema = Joi.object({
	recoveryPasswordtoken: Joi.string().required(),
	password: password
		.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/) // one digit and one number in any position
		.min(4)
		.messages({
			'string.base': 'Password must be a string',
			'string.empty': 'Password cannot be empty',
			'string.min': 'Password must have at least {#limit} characters',
			'string.max': 'Password must have at most {#limit} characters',
			'string.pattern.base': 'Password must contain at least one number and one letter',
		})
		.required(),
	confirmPassword: confirmPassword.required(),
});

export {
	registerUserSchema,
	loginUserSchema,
	emailSchema,
	confirmEmailSchema,
	recoveryPasswordSchema,
};

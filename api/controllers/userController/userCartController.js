import { UserService } from '../../services/user/user.service.js';

const userService = UserService.getInstance();

//#region user cart
const getUserCart = async (req, res, next) => {
	try {
		const user = req.user;
		const message = await userService.getUserCart(user);
		return res.json(message);
	} catch (error) {
		next(error);
	}
};

const insertProductToCart = async (req, res, next) => {
	try {
		const user = req.user;
		const { productId } = req.body;
		const message = await userService.insertProductToCart(user, productId);
		return res.json(message);
	} catch (error) {
		next(error);
	}
};

const removeProductToCart = async (req, res, next) => {
	try {
		const user = req.user;
		const { productId } = req.body;
		const message = await userService.removeProductToCart(user, productId);
		return res.json(message);
	} catch (error) {
		next(error);
	}
};
//#endregion

export { getUserCart, insertProductToCart, removeProductToCart };

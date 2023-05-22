import boom from '@hapi/boom';
import { UserAuthDAO } from './UserAuthDAO.js';
import { UserCartDTO } from '../../model/User/UserCart.js';
import { ProductDAO } from '../product/ProductDAO.js';
import cLog from '../../../utils/cLog.js';
import { productStatusStrings } from '../../../config/productStatus.js';

class UserCartDAO {
	constructor() {}

	//#region get cart
	async insertProductToCart(userId, productId) {
		try {
			// get user cart
			const cart = await this.getUserCartById(userId);

			// Check if product is in the cart
			const isProductInCart = cart.products.some((productInCart) => {
				return productInCart._id.toString() === productId;
			});

			if (isProductInCart) {
				return { message: 'inserted' };
			}

			// get product
			const productDAO = new ProductDAO();
			const product = await productDAO.getProduct(productId);

			// product
			if (product.productStatus.productStatusString != productStatusStrings.DISPONIBLE) {
				throw boom.conflict(`product status isn't ${productStatusStrings.DISPONIBLE}`);
			}

			cart.products.push(product);

			await cart.save();
			return { message: 'inserted' };
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				statusCode: 409,
				message: 'conflict on insert product to cart',
			});
		}
	}

	//#region get cart
	async removeProductToCart(userId, productId) {
		try {
			// get user cart
			const cart = await this.getUserCartById(userId);

			const product = cart.products.find((productInCart) => {
				return productInCart._id.toString() === productId;
			});

			let newProductCart = [...cart.products];

			newProductCart = newProductCart.filter((productInCart) => {
				return productInCart._id.toString() != product._id.toString();
			});

			cart.products = [...newProductCart];

			await cart.save();
			return { message: 'removed' };
		} catch (err) {
			if (err.isBoom) {
				throw err;
			}
			throw boom.boomify(err, {
				statusCode: 409,
				message: 'conflict on insert product to cart',
			});
		}
	}

	async getUserCartById(userId) {
		const userAuthDAO = new UserAuthDAO();
		const user = await userAuthDAO.getUserById(userId);
		if (!user) {
			throw boom.notFound('User not found');
		}
		let cart = await UserCartDTO.findOne({ user: user });

		if (!cart) {
			const userCartDTO = new UserCartDTO({ user: user, products: [] });
			cart = await userCartDTO.save();
		}

		// remove not available products
		const productDAO = new ProductDAO();
		const availableProductsOnCart = await productDAO.getAvailableProductsFromList(
			cart.products
		);

		cart.products = availableProductsOnCart;

		return cart.save();
	}
	//#endregion
}

export { UserCartDAO };

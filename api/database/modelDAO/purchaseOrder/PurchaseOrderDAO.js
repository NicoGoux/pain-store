import boom from '@hapi/boom';
import { UserCartDTO } from '../../model/User/UserCart.js';
import { UserAuthDAO } from '../user/UserAuthDAO.js';

class PurchaseOrderDAO {
	constructor() {}

	async createPurchaseOrder(userId, products, paymenthMethod) {
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

		return cart;
	}
	//#endregion
}

export { PurchaseOrderDAO };

import boom from '@hapi/boom';
import mongoose, { mongo } from 'mongoose';
import { UserAuthDAO } from '../user/UserAuthDAO.js';
import { PurchaseOrderStatusDAO } from './PurchaseOrderStatusDAO.js';
import { purchaseOrderStatusStrings } from '../../../config/purchaseOrderStatus.js';
import { ProductDAO } from '../product/ProductDAO.js';
import { PurchaseOrderDTO } from '../../model/PurchaseOrder/PurchaseOrder.js';
import { UserCartDAO } from '../user/UserCartDAO.js';

class PurchaseOrderDAO {
	constructor() {}

	async getPurchaseOrders(filters) {
		if (!filters) {
			return await PurchaseOrderDTO.find().lean();
		} else {
			if (filters.user) {
				const userAuthDAO = new UserAuthDAO();
				const user = await userAuthDAO.getUserById(filters.user);
				if (!user) {
					throw boom.notFound('User not found');
				}
				filters.user = user;
			}
			return await PurchaseOrderDTO.find(filters).lean();
		}
	}

	async getPurchaseOrder(id) {
		return await PurchaseOrderDTO.findById(id);
	}

	async createPurchaseOrder(purchaseOrderData) {
		// TODO clear user cart

		// Create mongoose session
		const session = await mongoose.startSession();

		try {
			session.startTransaction();

			// Perform update operations using the DAO classes

			// Update product status
			const productDAO = new ProductDAO();
			const updatedProducts = await productDAO.reserveProducts(
				purchaseOrderData.products,
				session
			);

			purchaseOrderData.products = updatedProducts;

			// Create new purchase order
			const updatedOrder = await this.createPurchaseOrderWithSession(
				purchaseOrderData,
				session
			);

			// Clear user cart
			if (purchaseOrderData.isCart) {
				const userCartDAO = new UserCartDAO();
				await userCartDAO.clearCart(purchaseOrderData.user, session);
			}

			// Commit the transaction if everything is successful
			await session.commitTransaction();

			return updatedOrder;
		} catch (err) {
			// Something went wrong, perform rollback
			await session.abortTransaction();
			throw err;
		} finally {
			session.endSession();
		}
	}

	async createPurchaseOrderWithSession(purchaseOrderData, session) {
		try {
			const userAuthDAO = new UserAuthDAO();
			const purchaseOrderStatusDAO = new PurchaseOrderStatusDAO();

			const user = await userAuthDAO.getUserById(purchaseOrderData.user);
			if (!user) {
				throw boom.notFound('User not found');
			}
			purchaseOrderData.user = user;

			const purchaseOrderStatus = await purchaseOrderStatusDAO.getPurchaseOrderStatus({
				purchaseOrderStatusString: purchaseOrderStatusStrings.PENDPAGO,
			});

			if (!purchaseOrderStatus) {
				throw boom.notFound('Purchase order status not found');
			}

			let totalPrice = 0;
			purchaseOrderData.products.forEach((p) => {
				totalPrice += p.price;
			});
			purchaseOrderData.totalPrice = totalPrice;

			purchaseOrderData.purchaseOrderStatus = purchaseOrderStatus;

			const latestOrder = await PurchaseOrderDTO.findOne().sort({ orderNumber: -1 }).exec();
			const newOrderNumber = latestOrder ? latestOrder.orderNumber + 1 : 1;
			purchaseOrderData.orderNumber = newOrderNumber;

			const purchaseOrderDTO = new PurchaseOrderDTO(purchaseOrderData);

			const options = { session, new: true }; // Pass the session to the options

			return await purchaseOrderDTO.save(options);
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	async updatePurchaseOrderStatus(purchaseOrderId, purchaseOrderStatus) {
		if (!purchaseOrderStatus) {
			throw boom.notFound('Purchase order status not found');
		}

		const purchaseOrder = await this.getPurchaseOrder(purchaseOrderId);
		if (!purchaseOrder) {
			throw boom.notFound('Purchase order not found');
		}

		const actualState = purchaseOrder.purchaseOrderStatus.purchaseOrderStatusString;

		const newState = purchaseOrderStatus.purchaseOrderStatusString;

		if (
			actualState === purchaseOrderStatusStrings.RECHAZADO ||
			actualState === purchaseOrderStatusStrings.FINALIZADO
		) {
			throw boom.conflict('Cannot change a rejected or finished status');
		}

		if (
			newState === purchaseOrderStatusStrings.PENDENVIO ||
			newState === purchaseOrderStatusStrings.PENDPAGO
		) {
			purchaseOrder.purchaseOrderStatus = purchaseOrderStatus;
			return await purchaseOrder.save();
		} else if (newState === purchaseOrderStatusStrings.FINALIZADO) {
			return await this.finishPurchaseOrder(purchaseOrder, purchaseOrderStatus);
		} else if (newState === purchaseOrderStatusStrings.RECHAZADO) {
			return await this.rejectPurchaseOrder(purchaseOrder, purchaseOrderStatus);
		}
	}

	async rejectPurchaseOrder(purchaseOrder, newState) {
		// Create mongoose session
		const session = await mongoose.startSession();

		try {
			session.startTransaction();

			// Perform update operations using the DAO classes

			// Update product status
			const productDAO = new ProductDAO();
			const updatedProducts = await productDAO.setProductsAvailable(
				purchaseOrder.products,
				session
			);

			// Create new purchase order
			purchaseOrder.products = updatedProducts;
			purchaseOrder.purchaseOrderStatus = newState;
			const updatedOrder = await purchaseOrder.save(session);

			// Commit the transaction if everything is successful
			await session.commitTransaction();

			return updatedOrder;
		} catch (err) {
			// Something went wrong, perform rollback
			await session.abortTransaction();
			throw err;
		} finally {
			session.endSession();
		}
	}

	async finishPurchaseOrder(purchaseOrder, newState) {
		// Create mongoose session
		const session = await mongoose.startSession();

		try {
			session.startTransaction();

			// Perform update operations using the DAO classes

			// Update product status
			const productDAO = new ProductDAO();
			const updatedProducts = await productDAO.sellProducts(purchaseOrder.products, session);

			// Create new purchase order
			purchaseOrder.products = updatedProducts;
			purchaseOrder.purchaseOrderStatus = newState;
			const updatedOrder = await purchaseOrder.save(session);

			// Commit the transaction if everything is successful
			await session.commitTransaction();

			return updatedOrder;
		} catch (err) {
			// Something went wrong, perform rollback
			await session.abortTransaction();
			throw err;
		} finally {
			session.endSession();
		}
	}
}

export { PurchaseOrderDAO };

import boom from '@hapi/boom';
import mongoose from 'mongoose';
import { UserAuthDAO } from '../user/UserAuthDAO.js';
import { PurchaseOrderStatusDAO } from './PurchaseOrderStatusDAO.js';
import { purchaseOrderStatusStrings } from '../../../config/purchaseOrderStatus.js';
import { ProductDAO } from '../product/ProductDAO.js';
import { PurchaseOrderDTO } from '../../model/PurchaseOrder/PurchaseOrder.js';
import { UserCartDAO } from '../user/UserCartDAO.js';
import { PaymentMethodTypeDAO } from '../paymentMethod/paymentMethodTypeDAO.js';

class PurchaseOrderDAO {
	constructor() {}

	async getPurchaseOrders(filters) {
		if (!filters) {
			const purchaseOrders = await PurchaseOrderDTO.find().lean();
			return { purchaseOrders, totalPages: 0 };
		} else {
			const pageSize = 15;
			const skipAmount = (filters.page - 1) * pageSize;

			const query = {};

			if (filters.orderNumber) {
				query.orderNumber = filters.orderNumber;
			}

			if (filters.username) {
				const userAuthDAO = new UserAuthDAO();
				const usersFound = await userAuthDAO.getUserByUsername(filters.username);
				if (!usersFound) {
					throw boom.notFound('User not found');
				}
				query.user = { $in: usersFound };
			}

			if (filters.paymentMethodType) {
				const paymentMethodTypeDAO = new PaymentMethodTypeDAO();
				const paymentMethodTypeFound = await paymentMethodTypeDAO.getPaymentMethodType({
					paymentMethodTypeString: filters.paymentMethodType,
				});
				if (!paymentMethodTypeFound) {
					throw boom.notFound('Payment method not found');
				}
				query.paymentMethodType = paymentMethodTypeFound;
			}

			if (filters.purchaseOrderStatus) {
				const purchaseOrderStatusDAO = new PurchaseOrderStatusDAO();
				const purchaseOrderStatusFound =
					await purchaseOrderStatusDAO.getPurchaseOrderStatus({
						purchaseOrderStatusString: filters.purchaseOrderStatus,
					});
				if (!purchaseOrderStatusFound) {
					throw boom.notFound('purchase order status not found');
				}
				query.purchaseOrderStatus = purchaseOrderStatusFound;
			}

			if (filters.minDate) {
				query.createdAt = { $gte: new Date(filters.minDate) };
			}

			if (filters.maxDate) {
				query.createdAt = { ...query.createdAt, $lte: new Date(filters.maxDate) };
			}

			const totalCount = await PurchaseOrderDTO.countDocuments(query);

			const totalPages = Math.ceil(totalCount / pageSize);

			const purchaseOrders = await PurchaseOrderDTO.find(query)
				.sort({ createdAt: 'desc' })
				.skip(skipAmount)
				.limit(pageSize)
				.lean();

			return { purchaseOrders, totalPages };
		}
	}

	async getUserPurchaseOrders(user) {
		const userAuthDAO = new UserAuthDAO();
		const userFound = await userAuthDAO.getUserById(user);
		if (!userFound) {
			throw boom.notFound('User not found');
		}

		return await PurchaseOrderDTO.find({ user: userFound }).sort({ createdAt: 'desc' }).lean();
	}

	async getPurchaseOrderByProduct(productId) {
		const purchaseOrderStatusDAO = new PurchaseOrderStatusDAO();
		const purchaseOrderStatusFound = await purchaseOrderStatusDAO.getPurchaseOrderStatus({
			purchaseOrderStatusString: purchaseOrderStatusStrings.CANCELADO,
		});
		if (!purchaseOrderStatusFound) {
			throw boom.notFound('purchase order status not found');
		}
		return await PurchaseOrderDTO.findOne({
			products: {
				$elemMatch: {
					$eq: new mongoose.Types.ObjectId(productId),
				},
			},
			purchaseOrderStatus: { $ne: purchaseOrderStatusFound },
		});
	}

	async getPurchaseOrder(id) {
		try {
			const purchaseOrder = await PurchaseOrderDTO.findById(id);
			if (!purchaseOrder) {
				throw boom.conflict();
			}
			return purchaseOrder;
		} catch (err) {
			throw boom.notFound('Purchase order not found');
		}
	}

	async createPurchaseOrder(purchaseOrderData) {
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
			const paymentMethodTypeDAO = new PaymentMethodTypeDAO();

			const paymentMethodType = await paymentMethodTypeDAO.getPaymentMethodType({
				paymentMethodTypeString: purchaseOrderData.paymentMethodType,
			});
			if (!paymentMethodType) {
				throw boom.notFound('Payment method type not found');
			}
			purchaseOrderData.paymentMethodType = paymentMethodType;

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
			actualState === purchaseOrderStatusStrings.CANCELADO ||
			actualState === purchaseOrderStatusStrings.COMPLETADO
		) {
			throw boom.conflict('Cannot change a rejected or finished status');
		}

		if (
			newState === purchaseOrderStatusStrings.PENDENVIO ||
			newState === purchaseOrderStatusStrings.PENDPAGO
		) {
			purchaseOrder.purchaseOrderStatus = purchaseOrderStatus;
			return await purchaseOrder.save();
		} else if (newState === purchaseOrderStatusStrings.COMPLETADO) {
			return await this.completePurchaseOrder(purchaseOrder, purchaseOrderStatus);
		} else if (newState === purchaseOrderStatusStrings.CANCELADO) {
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

	async completePurchaseOrder(purchaseOrder, newState) {
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

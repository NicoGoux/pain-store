import { purchaseOrderStatusStrings } from '../../config/purchaseOrderStatus.js';
import { PurchaseOrderDAO } from '../../database/modelDAO/purchaseOrder/PurchaseOrderDAO.js';
import { PurchaseOrderStatusDAO } from '../../database/modelDAO/purchaseOrder/PurchaseOrderStatusDAO.js';
import { sendEmail } from '../../utils/nodemailer.js';

let instance;

class PurchaseOrderService {
	// Singleton class
	static getInstance() {
		if (instance) {
			return instance;
		} else {
			return new PurchaseOrderService();
		}
	}

	constructor() {
		this.purchaseOrderDAO = new PurchaseOrderDAO();
		this.purchaseOrderStatusDAO = new PurchaseOrderStatusDAO();
	}

	getPurchaseOrders() {
		return this.purchaseOrderDAO.getPurchaseOrders();
	}

	getUserPurchaseOrders(user) {
		return this.purchaseOrderDAO.getPurchaseOrders({
			user: user.sub,
		});
	}

	async getUserPurchaseOrder(user, id) {
		const purchaseOrder = await this.purchaseOrderDAO.getPurchaseOrder(id);
		if (purchaseOrder.user._id.toString() === user.sub) {
			return purchaseOrder;
		} else {
			throw new Error('Purchase order not found');
		}
	}

	getPurchaseOrder(id) {
		return this.purchaseOrderDAO.getPurchaseOrder(id);
	}

	async createPurchaseOrder(user, userData, products, paymentMethodType, isCart) {
		const newPurchaseOrder = await this.purchaseOrderDAO.createPurchaseOrder({
			user: user.sub,
			...userData,
			products: products,
			paymentMethodType: paymentMethodType,
			isCart: isCart,
		});

		if (newPurchaseOrder) {
			await this.sendPurchaseOrderEmail(newPurchaseOrder);
		}
		return newPurchaseOrder;
	}

	async updatePurchaseOrderStatus(purchaseOrderId, purchaseOrderStatus) {
		purchaseOrderStatus = await this.purchaseOrderStatusDAO.getPurchaseOrderStatus({
			purchaseOrderStatusString: purchaseOrderStatus,
		});

		return await this.purchaseOrderDAO.updatePurchaseOrderStatus(
			purchaseOrderId,
			purchaseOrderStatus
		);
	}

	async rejectPurchaseOrder(purchaseOrderId, user) {
		const purchaseOrder = await this.purchaseOrderDAO.getPurchaseOrder(purchaseOrderId);
		if (purchaseOrder.user._id.toString() === user.sub) {
			const purchaseOrderStatus = await this.purchaseOrderStatusDAO.getPurchaseOrderStatus({
				purchaseOrderStatusString: purchaseOrderStatusStrings.CANCELADO,
			});

			return await this.purchaseOrderDAO.rejectPurchaseOrder(
				purchaseOrder,
				purchaseOrderStatus
			);
		} else {
			throw new Error('Purchase order not found');
		}
	}

	getPurchaseOrderStatuses() {
		return this.purchaseOrderStatusDAO.getPurchaseOrderStatuses();
	}

	async sendPurchaseOrderEmail(purchaseOrder) {
		try {
			const ArsPriceFormat = new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currencyDisplay: 'symbol',
				currency: 'ARS',
			});
			const user = purchaseOrder.user;
			// email message
			const infoEmail = {
				from: process.env.EMAIL_USER, // sender address
				to: user.email, // list of receivers
				subject: 'Pain Store - Pedido de compra', // Subject line
				html: `<html>
						<head>
							<style type="text/css">
								body {
									font-family: Arial, sans-serif;
								}
								table {
									border-collapse: collapse;
									width: 100%;
								}
								th, td {
									border: 1px solid #dddddd;
									text-align: left;
									padding: 8px;
								}
								th {
									background-color: #f2f2f2;
									}

								.paymentDetail {
									font-size: 16px
								}
								
								th:first-child, td:first-child {
									width: 250px;
								}
							</style>
						</head>
						<body>
							<h1>Pedido de compra - Pain Store</h1>
							<p>Estimado(a) ${user.firstName} ${user.lastName},</p>
							<p>Gracias por realizar tu pedido en Pain Store. A continuación, te presentamos los detalles de tu compra:</p>
							<h2>Detalles del pedido</h1>
							<h3>Detalles de usuario:</h2>
							<table>
								<tr>
									<td>
										<strong>Número de pedido:</strong>
									</td>
									<td>${purchaseOrder.orderNumber}</td>
								</tr>
								<tr>
									<td>
										<strong>Nombre:</strong>
									</td>
									<td>
										${purchaseOrder.firstName} ${purchaseOrder.lastName}
									</td>
								</tr>
								<tr>
									<td>
										<strong>Trade Link:</strong>
									</td>
									<td>${purchaseOrder.tradeLink}</td>
								</tr>
							</table>
							<h3>Detalles de productos:</h2>
							<table>
								<tr>
									<th>Nombre del Producto</th>
									<th>Precio</th>
								</tr>
								${purchaseOrder.products
									.map(
										(product) => `
									<tr>
										<td>${product.name}</td>
										<td>${ArsPriceFormat.format(product.price)}</td>
									</tr>
								`
									)
									.join('')}
							</table>
							<h3>Detalles de pago:</h2>
							<table class="paymentDetail">
								<tr>
									<td>
										<strong>Método de pago:</strong> 
									</td>
									<td>${purchaseOrder.paymentMethodType.paymentMethodTypeString}</td>
								</tr>
								<tr>
									<td>
										<strong>Total:</strong> 
									</td>
									<td>${ArsPriceFormat.format(purchaseOrder.totalPrice)}</td>
								</tr>
							</table>
						</body>`, // html body
			};

			return await sendEmail(infoEmail);
		} catch (err) {
			throw err;
		}
	}

	/**
	 *
	 * @description: Only for initial populate
	 */
	async populatePurchaseOrderStatuses() {
		const purchaseOrderStatuses = [
			{
				purchaseOrderStatusString: purchaseOrderStatusStrings.CANCELADO,
			},
			{
				purchaseOrderStatusString: purchaseOrderStatusStrings.PENDPAGO,
			},
			{
				purchaseOrderStatusString: purchaseOrderStatusStrings.PENDENVIO,
			},
			{
				purchaseOrderStatusString: purchaseOrderStatusStrings.COMPLETADO,
			},
		];
		return await this.purchaseOrderStatusDAO.insertPurchaseOrderStatuses(purchaseOrderStatuses);
	}
}

export { PurchaseOrderService };

import { Product } from '../model/Product/Product.js';
import { MarketHash } from '../model/Product/MarketHash.js';
import { ProductStatus } from '../model/Product/ProductStatus.js';
import { CategoryDAO } from '../supabase/modelDAO/CategoryDAO.js';
// import { ProductDAO } from '../supabase/modelDAO/ProductDAO.js';

let instance;

class ProductService {
	// Singleton class
	static getInstance() {
		if (instance) {
			return instance;
		} else {
			return new ProductService();
		}
	}
	constructor() {
		// this.productDAO = new ProductDAO();

		this.products = [
			new Product(
				null,
				'AK-47',
				new MarketHash(null, 'AK-47 | Redline (Minimal Wear)', { category: 'RIFLES' }),
				'Minimal Wear',
				0.85,
				'image1.jpg',
				null,
				50,
				ProductStatus.AVAILABLE
			),
			// new Product(
			// 	2,
			// 	'M4A1-S',
			// 	new MarketHash(null,'M4A1-S | Hyper Beast (Field-Tested)', 'WEAPON'),
			// 	'Field-Tested',
			// 	0.15,
			// 	'image2.jpg',
			// 	true,
			// 	100,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	3,
			// 	'AWP',
			// 	new MarketHash(null,'AWP | Asiimov (Battle-Scarred)', 'WEAPON'),
			// 	'Battle-Scarred',
			// 	0.75,
			// 	'image3.jpg',
			// 	false,
			// 	200,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	4,
			// 	'Glock-18',
			// 	new MarketHash(null,'Glock-18 | Fade (Factory New)', 'WEAPON'),
			// 	'Factory New',
			// 	0.05,
			// 	'image4.jpg',
			// 	true,
			// 	500,
			// 	ProductStatus.SOLD
			// ),
			// new Product(
			// 	5,
			// 	'USP-S',
			// 	new MarketHash(null,'USP-S | Orion (Minimal Wear)', 'WEAPON'),
			// 	'Minimal Wear',
			// 	0.12,
			// 	'image5.jpg',
			// 	false,
			// 	150,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	6,
			// 	'Desert Eagle',
			// 	new MarketHash(null,'Desert Eagle | Conspiracy (Field-Tested)', 'WEAPON'),
			// 	'Field-Tested',
			// 	0.35,
			// 	'image6.jpg',
			// 	true,
			// 	75,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	7,
			// 	'P90',
			// 	new MarketHash(null,'Desert Eagle | Conspiracy (Field-Tested)', 'WEAPON'),
			// 	'P90 | Asiimov (Well-Worn)',
			// 	'Well-Worn',
			// 	0.45,
			// 	'image7.jpg',
			// 	false,
			// 	120,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	8,
			// 	'Galil AR',
			// 	new MarketHash(null,'Desert Eagle | Conspiracy (Field-Tested)', 'WEAPON'),
			// 	'Galil AR | Rocket Pop (Factory New)',
			// 	'Factory New',
			// 	0.01,
			// 	'image8.jpg',
			// 	true,
			// 	250,
			// 	ProductStatus.SOLD
			// ),
			// new Product(
			// 	9,
			// 	'Famas',
			// 	new MarketHash(null,'Desert Eagle | Conspiracy (Field-Tested)', 'WEAPON'),
			// 	'Famas | Djinn (Minimal Wear)',
			// 	'Minimal Wear',
			// 	0.11,
			// 	'image9.jpg',
			// 	false,
			// 	80,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	10,
			// 	'M249',
			// 	new MarketHash(null,'Desert Eagle | Conspiracy (Field-Tested)', 'WEAPON'),
			// 	'M249 | Jungle DDPAT (Field-Tested)',
			// 	'Field-Tested',
			// 	0.3,
			// 	'image10.jpg',
			// 	true,
			// 	40,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	11,
			// 	'Sport Gloves',
			// 	new MarketHash(null,"Sport Gloves | Pandora's Box", 'GLOVES'),
			// 	'Minimal Wear',
			// 	0.12,
			// 	'gloves1.jpg',
			// 	false,
			// 	250,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	12,
			// 	'Driver Gloves',
			// 	new MarketHash(null,'Driver Gloves | Lunar Weave', 'GLOVES'),
			// 	'Factory New',
			// 	0.01,
			// 	'gloves2.jpg',
			// 	false,
			// 	1000,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	13,
			// 	'Moto Gloves',
			// 	new MarketHash(null,'Moto Gloves | Eclipse', 'Gloves'),
			// 	'Field-Tested',
			// 	0.33,
			// 	'gloves3.jpg',
			// 	false,
			// 	450,
			// 	ProductStatus.SOLD
			// ),
			// new Product(
			// 	14,
			// 	'Sticker Capsule',
			// 	new MarketHash(null,'Sticker Capsule | The Norse Collection', 'Sticker'),
			// 	'Vanilla',
			// 	null,
			// 	'sticker1.jpg',
			// 	true,
			// 	5,
			// 	ProductStatus.AVAILABLE
			// ),
			// new Product(
			// 	15,
			// 	'Sticker',
			// 	new MarketHash(null,'Faze Clan | Atlanta 2017', 'Sticker'),
			// 	'Vanilla',
			// 	null,
			// 	'sticker2.jpg',
			// 	false,
			// 	15,
			// 	ProductStatus.RESERVED
			// ),
			// new Product(
			// 	16,
			// 	'Karambit',
			// 	new MarketHash(null,'★ Karambit | Gamma Doppler (Factory New)', 'Knife'),
			// 	'Factory New',
			// 	0.05,
			// 	'knife1.jpg',
			// 	false,
			// 	1500,
			// 	ProductStatus.AVAILABLE
			// ),
		];
	}

	getAllProducts(limit, offset) {
		return this.products;
	}

	testProducts() {
		const category = new CategoryDAO().getCategory({ category: 'RIFLES' });
		return category;
	}
}

export { ProductService };

import e from 'express';

class CategoryDTO {
	constructor(categoryObject) {
		if (categoryObject.id != null) {
			this.id = categoryObject.id;
		} else {
			delete this.id;
		}
		this.category = categoryObject.category;
		this.parent_category_id = categoryObject.parent_category;
	}
}

export { CategoryDTO };

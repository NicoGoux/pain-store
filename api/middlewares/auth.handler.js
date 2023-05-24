import boom from '@hapi/boom';

function checkRoles(roles) {
	return (req, res, next) => {
		try {
			const user = req.user;
			if (roles.includes(user.role)) {
				next();
			} else {
				next(boom.forbidden('Permission denied'));
			}
		} catch (err) {
			next(err);
		}
	};
}

export { checkRoles };

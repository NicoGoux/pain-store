const paymentMethodTypeStrings = Object.freeze({
	TRANSFERENCIA: { name: 'TRANSFERENCIA', data: ['CBU/CVU', 'alias', 'nombre'] },
	CRYPTOMONEDA: { name: 'CRYPTOMONEDA', data: ['wallet', 'red', 'moneda'] },
});

export { paymentMethodTypeStrings };

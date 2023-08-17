const paymentMethodTypeStrings = Object.freeze({
	TRANSFERENCIA: { name: 'TRANSFERENCIA', data: ['cbu_cvu', 'nombre'] },
	CRYPTOMONEDA: { name: 'CRYPTOMONEDA', data: ['wallet', 'red', 'moneda'] },
});

export { paymentMethodTypeStrings };

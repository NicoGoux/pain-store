const paymentMethodTypeStrings = Object.freeze({
	TRANSFERENCIA: { name: 'TRANSFERENCIA', data: ['cbu_cvu', 'nombre'] },
	CRIPTOMONEDA: { name: 'CRIPTOMONEDA', data: ['wallet', 'red', 'moneda'] },
	OTROS_MEDIOS: { name: 'OTROS MEDIOS' },
});

export { paymentMethodTypeStrings };

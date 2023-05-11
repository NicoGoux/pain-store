const customColor = (colorCode) => {
	const ret = `\x1b[${colorCode}m%s\x1b[0m`;
	return ret;
};

const red = (text) => console.log(customColor(31), text);
const green = (text) => console.log(customColor(32), text);
const yellow = (text) => console.log(customColor(33), text);
const blue = (text) => console.log(customColor(34), text);
const magenta = (text) => console.log(customColor(35), text);
const cyan = (text) => console.log(customColor(36), text);

export default {
	red,
	green,
	yellow,
	blue,
	magenta,
	cyan,
};

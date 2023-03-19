const Colors = require('./colors.js');

/**
 * Resolves a ColorResolvable into a color number.
 * @param {String} color Color to resolve
 * @returns {Number} A color
 */
function resolveColor(color) {
	if (typeof color === 'string') {
		if (color === 'Random') return Math.floor(Math.random() * (0xffffff + 1));
		if (color === 'Default') return 0;
		color = Colors[color] ?? parseInt(color.replace('#', ''), 16);
	} else if (Array.isArray(color)) {
		color = (color[0] << 16) + (color[1] << 8) + color[2];
	}

	if (color < 0 || color > 0xffffff) throw new RangeError('COLOR_RANGE');
	else if (Number.isNaN(color)) throw new TypeError('COLOR_CONVERT');

	return color;
}


module.exports = resolveColor;
"use strict";

function colorblindBg(col, cfg, nbinv, bfilter, n_inv) {
	let cmin = Math.min(col[0],col[1],col[2]);
	let cmax = Math.max(col[0],col[1],col[2]);
	let pcol = '';
	if (cfg.forcePlhdr && !nbinv && !bfilter && cmin != col[2]) {
		if (col[1] >= col[0]) {
			let blu = col[2];
			col[2] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[0] > col[1]) {
			let blu = col[2];
			col[2] = col[1];
			col[1] = blu;
			pcol = 'rgba('+col+')';
		}
	} else if (cfg.forcePlhdr && (nbinv|| bfilter) && cmax != col[2]) {
		if (col[0] > col[1]) {
			let blu = col[2];
			col[2] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[1] > col[0]) {
			let blu = col[2];
			col[2] = col[1];
			col[1] = blu;
			pcol = 'rgba('+col+')';
		}
	} else if (!cfg.forcePlhdr && cfg.advDimming && cmax != col[2]) {
		if (col[0] >= col[1]) {
			let blu = col[2];
			col[2] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[1] > col[0]) {
			let blu = col[2];
			col[2] = col[1];
			col[1] = blu;
			pcol = 'rgba('+col+')';
		}
	} else if (!cfg.forcePlhdr && !cfg.advDimming && cmax != col[2]) {
		if (col[0] > col[1]) {
			let blu = col[2];
			col[2] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[1] > col[0]) {
			let blu = col[2];
			col[2] = col[1];
			col[1] = blu;
			pcol = 'rgba('+col+')';
		}
	}
	return pcol;
}

function colorblindFg(col, cfg, nbinv, bfilter, n_inv) {
	let cmin = Math.min(col[0],col[1],col[2]);
	let cmax = Math.max(col[0],col[1],col[2]);
	let pcol = '';
	if (cfg.forcePlhdr && n_inv > 2 && !nbinv && !bfilter && cmin != col[1]) {
		if (col[0] >= col[2]) {
			let blu = col[1];
			col[1] = col[2];
			col[2] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[2] > col[0]) {
			let blu = col[1];
			col[1] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		}
	} else if (cfg.forcePlhdr && n_inv > 2 && (nbinv || bfilter) && cmax != col[1]) {
		if (col[2] >= col[0]) {
			let blu = col[1];
			col[1] = col[2];
			col[2] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[0] > col[2]) {
			let blu = col[1];
			col[1] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		}
	} else if (cfg.forcePlhdr && !nbinv && !bfilter && cmin != col[1]) {
		if (col[2] > col[0]) {
			let blu = col[1];
			col[1] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[0] > col[2]) {
			let blu = col[1];
			col[1] = col[2];
			col[2] = blu;
			pcol = 'rgba('+col+')';
		}
	} else if (!cfg.forcePlhdr && cfg.advDimming && cmax != col[1]) {
		if (col[2] >= col[0]) {
			let blu = col[1];
			col[1] = col[2];
			col[2] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[0] > col[2]) {
			let blu = col[1];
			col[1] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		}
	} else if (!cfg.forcePlhdr && !cfg.advDimming && cmax != col[2]) {
		if (col[0] > col[1]) {
			let blu = col[2];
			col[2] = col[0];
			col[0] = blu;
			pcol = 'rgba('+col+')';
		} else if (col[1] > col[0]) {
			let blu = col[2];
			col[2] = col[1];
			col[1] = blu;
			pcol = 'rgba('+col+')';
		}
	}
	return pcol;
}

function rgbToHSL([r,g,b,a=1])
{
	r = r / 255;
	g = g / 255;
	b = b / 255;
	a = a != undefined ? parseFloat(a) : 1.0;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const c = max - min;
	const l = (max + min) / 2;
	if (c === 0)
		return [ 0, 0, l, a];
	let h = (max === r ? ((g - b) / c) % 6 : max === g ? (b - r) / c + 2 : (r - g) / c + 4) * 60;
	if (h < 0)
		h += 360;
	const s = c / (1 - Math.abs(2 * l - 1));
	return [h, s, l, a];
}

function hslToRGB([h,s,l,a=1]) {
	if (s.toString().indexOf('%') > 0) s = parseFloat(s)/100;
	if (l.toString().indexOf('%') > 0) l = parseFloat(l)/100;
	if (a.toString().indexOf('%') > 0) a = parseFloat(a)/100;
	if (s === 0) {
		const [r, b, g] = [l, l, l].map((x) => Math.round(x * 255));
		return [r, g, b, a];
	}
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	const [r, g, b] = (
		h < 60 ? [c, x, 0]: h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x] ).map((n) => Math.round((n + m) * 255));
	return [r, g, b, a];
}

function getHSLarr(hsl_str)
{
	let hsl = [];
	let x = hsl_str.indexOf(')');
	if (hsl_str.substring(0,4) == 'hsla') {
		hsl = hsl_str.substring(5, x).replace(/ /g, '').split(',');
	} else {
		hsl = hsl_str.substring(4, x).replace(/ /g, '').split(',');
	}
	hsl[0] = hsl[0].indexOf('deg') > 0 ? parseFloat(hsl[0]) : hsl[0];
	hsl[1] = hsl[1].indexOf('%') > 0 ? parseFloat(hsl[1])/100 : hsl[1];
	hsl[2] = hsl[2].indexOf('%') > 0 ? parseFloat(hsl[2])/100 : hsl[2];
	hsl[3] = hsl[3] == undefined ? 1 : hsl[3];
	return hsl;
}

function hexToRGBA(h,a=1) {
	let r = 0, g = 0, b = 0;

	if (h.length == 5) {
		r = parseInt("0x" + h[1] + h[1],16);
		g = parseInt("0x" + h[2] + h[2],16);
		b = parseInt("0x" + h[3] + h[3],16);
		a = parseInt("0x" + h[4] + h[4],16);
	} else if (h.length == 9) {
		r = parseInt("0x" + h[1] + h[2],16);
		g = parseInt("0x" + h[3] + h[4],16);
		b = parseInt("0x" + h[5] + h[6],16);
		a = parseInt("0x" + h[7] + h[8],16);
	}
	a = +(a / 255).toFixed(3);
	return [r, g, b, a];
}

function getRGBarr(rgba_str)
{
	let rgb = [];
		let x = rgba_str.indexOf(')');
	if (rgba_str.substring(0,4) == 'rgba') {
		rgb = rgba_str.substring(5, x).replace(/ /g, '').split(',');
	} else {
		rgb = rgba_str.substring(4, x).replace(/ /g, '').split(',');
	}
	rgb[3] = rgb[3] == undefined ? 1 : rgb[3];
	return rgb;
}

function clamp(x, min, max) {
	return Math.min(max, Math.max(min, x));
}

let gcol_cache = {};
function applyColorMatrix([r, g, b]) {
	let col = [r,g,b];
	let c = gcol_cache[col];
	if (c != undefined)
		return c;
//	const rgb = [[r / 255], [g / 255], [b / 255], [1], [1]];
	const rgb = [r / 255, g / 255, b / 255, 1, 1];
	const result = [  rgb[0]*g_m[0][0]+rgb[1]*g_m[0][1]+rgb[2]*g_m[0][2]+rgb[3]*g_m[0][3]+rgb[4]*g_m[0][4]  ,  rgb[0]*g_m[1][0]+rgb[1]*g_m[1][1]+rgb[2]*g_m[1][2]+rgb[3]*g_m[1][3]+rgb[4]*g_m[1][4]  ,  rgb[0]*g_m[2][0]+rgb[1]*g_m[2][1]+rgb[2]*g_m[2][2]+rgb[3]*g_m[2][3]+rgb[4]*g_m[2][4]  ];
//	const result = multiplyMatrices(g_m, rgb);
	const x = [0, 1, 2].map((i) =>
	clamp(Math.round(result[i] * 255), 0, 255));
//	const x = [ Math.round(result[0]*255), Math.round(result[1]*255), Math.round(result[2]*255) ];
	if (c == undefined)
		gcol_cache[col] = x;
	return x;
}

const Matrix = {
	identity() {
		return [
			[1, 0, 0, 0, 0],
			[0, 1, 0, 0, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 0, 1, 0],
			[0, 0, 0, 0, 1]
			];
	},
	invertNHue() {
		return [
			[0.333, -0.667, -0.667, 0, 1],
			[-0.667, 0.333, -0.667, 0, 1],
			[-0.667, -0.667, 0.333, 0, 1],
			[0, 0, 0, 1, 0],
			[0, 0, 0, 0, 1]
			];
	},
	brightness(v) {
		return [
			[v, 0, 0, 0, 0],
			[0, v, 0, 0, 0],
			[0, 0, v, 0, 0],
			[0, 0, 0, 1, 0],
			[0, 0, 0, 0, 1]
			];
	},
	contrast(v) {
		const t = (1 - v) / 2;
		return [
			[v, 0, 0, 0, t],
			[0, v, 0, 0, t],
			[0, 0, v, 0, t],
			[0, 0, 0, 1, 0],
			[0, 0, 0, 0, 1]
			];
	},
};

function multiplyMatrices(m1, m2) {
	const result = [];
	for (let i = 0, len = m1.length; i < len; i++) {
		result[i] = [];
		for (let j = 0, len2 = m2[0].length; j < len2; j++) {
			let sum = 0;
			for (let k = 0, len3 = m1[0].length; k < len3; k++) {
				sum += m1[i][k] * m2[k][j];
			}
			result[i][j] = sum;
		}
	}
	return result;
}

let g_brightness = 1.00;
let g_contrast = 1.00;

var g_m2;
let g_m = Matrix.invertNHue();

var style_node;
var css_node;
var doc_obs;
let b_html = false;
let f_sizes = [];
let f2_sizes = [];
let h_sizes = [];
let b_body = false;
let g_eng = false;
var str_style;
var str_style2 = '1';
var t_start, t_end;
var root_style;
let g_nokinput = /(checkbox|color|hidden|submit|image|radio|range)/i;
let g_okinput = /(text|number|email|password|date|time|week|month|url|tel|search|select)/i;
let m_fcol = new Map();
let m_bcol = new Map();
let m_bocol = new Map();
let g_mag = '';
let g_fntRule = false;
var g_globalCss;
var g_bg_contrast;
var g_bg_contrast_old;
var g_fg_brightness_min;
var g_min_colorfulness;
var g_bg_threshold;
var g_bg_threshold_new;
var g_bg_threshold_new_default;
var g_url;
var g_foot_re;

const focalAnchors = {};
focalAnchors.attrNameContainer = 'f-a-h';

focalAnchors.attrNameHighlight = 'f-a-i';

focalAnchors.classNameHighlight = 'f-a';

focalAnchors.toggleAnchorsById = function (id) {
	focalAnchors.toggleAnchorsByRef(document.getElementById(id));
}

focalAnchors.toggleAnchorsByRef = function (container, emoji = false, skiplinks = false, weight = 400) {
	if (container instanceof Element && container.hasAttribute(focalAnchors.attrNameContainer)) {
		focalAnchors.clearAnchors(container, emoji, skiplinks, weight);
	} else {
		focalAnchors.addAnchorsToContainer(container, emoji, skiplinks, weight);
	}
}

focalAnchors.clearAnchors = function (container, emoji, skiplinks, weight) {
const stack = [container];
while (stack.length > 0) {
	const topElement = stack.pop();
	topElement.removeAttribute(focalAnchors.attrNameContainer);
	Array.from(topElement.childNodes).forEach(node => {
		if (node.nodeType !== Node.TEXT_NODE && node instanceof Element) {
			if (node.hasAttribute(focalAnchors.attrNameContainer)) {
				stack.push(node);
			}
			if (node.hasAttribute(focalAnchors.attrNameHighlight)) {
				const prev = node.previousSibling;
				const next = node.nextSibling;
				if (prev !== null && prev.nodeType === Node.TEXT_NODE) {
				// Merge with previous node.
				prev.textContent += node.textContent;
				if (next.nodeType === Node.TEXT_NODE) {
				// Merge with next node.
				prev.textContent += next.textContent;
				node.parentNode.removeChild(next);
				}
				} else if (next !== null && next.nodeType === Node.TEXT_NODE) {
				next.textContent = node.textContent + next.textContent;
				} else {
				// If there are no adjacent text nodes, just insert.
				node.parentNode.insertBefore(document.createTextNode(node.textContent), node);
				}
				node.parentNode.removeChild(node);
			}
		}
	})
}
}

// Add anchors to children of container, recursively.
focalAnchors.addAnchorsToContainer = function (container, emoji, skiplinks, weight) {
	const stack = [container];
	while (stack.length > 0) {
		const topElement = stack.pop();
		Array.from(topElement.childNodes).forEach(node => {
			if (node.nodeType === Node.TEXT_NODE && node.textContent.length > 0 && !/(\<STYLE|\<SCRIPT)/i.test(node.parentNode.nodeName) && ((skiplinks && node.parentNode.nodeName.toUpperCase() != 'UL' && node.parentNode.nodeName.toUpperCase() != 'A') || !skiplinks) && ((emoji && /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/umg.test(node.textContent)) || !emoji)) {
				node.parentNode.setAttribute(focalAnchors.attrNameContainer, '');
				if (emoji)
					invertEmojis(node);
				else
					focalAnchors.injectAnchorText(node,weight);
				node.parentNode.removeChild(node);
			} else {
				if (node instanceof Element && !node.hasAttribute(focalAnchors.attrNameContainer)) {
				stack.push(node);
			}
			}
		});
	}
}

const mtrIndic = [ 2304, 2305, 2306, 2307, 2362, 2363, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2384, 2385, 2386, 2387, 2388, 2389, 2390, 2391, 2402, 2403, 2433, 2434, 2435, 2492, 2493, 2494, 2495, 2496, 2497, 2498, 2499, 2500, 2501, 2502, 2503, 2504, 2505, 2506, 2507, 2508, 2509, 2510, 2511, 2512, 2513, 2514, 2515, 2516, 2517, 2518, 2519, 2530, 2531, 2558, 2689, 2690, 2691, 2750, 2751, 2752, 2753, 2754, 2755, 2756, 2757, 2758, 2759, 2760, 2761, 2762, 2763, 2764, 2765, 2786, 2787, 2810, 2811, 2812, 2813, 2814, 2815, 2561, 2562, 2563, 2620, 2621, 2622, 2623, 2624, 2625, 2626, 2627, 2628, 2629, 2630, 2631, 2632, 2633, 2634, 2635, 2636, 2637, 2638, 2639, 2640, 2641, 2672, 2673, 2677, 3200, 3201, 3202, 3203, 3260, 3261, 3262, 3263, 3264, 3265, 3266, 3267, 3268, 3269, 3270, 3271, 3272, 3273, 3274, 3275, 3276, 3277, 3278, 3279, 3280, 3281, 3282, 3283, 3284, 3285, 3286, 3298, 3299, 3328, 3329, 3330, 3331, 3387, 3388, 3389, 3390, 3391, 3392, 3393, 3394, 3395, 3396, 3397, 3398, 3399, 3400, 3401, 3402, 3403, 3404, 3405, 3406, 3426, 3427, 2817, 2818, 2819, 2876, 2877, 2878, 2879, 2880, 2881, 2882, 2883, 2884, 2885, 2886, 2887, 2888, 2889, 2890, 2891, 2892, 2893, 2894, 2895, 2896, 2897, 2898, 2899, 2900, 2901, 2902, 2903, 2946, 2947, 3006, 3007, 3008, 3009, 3010, 3011, 3012, 3013, 3014, 3015, 3016, 3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3072, 3073, 3074, 3075, 3076, 3134, 3135, 3136, 3137, 3138, 3139, 3140, 3141, 3142, 3143, 3144, 3145, 3146, 3147, 3148, 3149, 3150, 3151, 3152, 3153, 3154, 3155, 3156, 3157, 3158, 3170, 3171 ];


// Add anchor points to a text string.
focalAnchors.injectAnchorText = function (node,weight) {
	if (node instanceof Element && node.hasAttribute(focalAnchors.attrNameContainer)) return;
	let txtc = node.textContent;
	var tag = '';
	var wt = parseInt(weight)+400;
	if (node.parentNode) tag = node.parentNode.nodeName;
	if (g_eng) {
	let words = txtc.split(/\b/);
	const spann = document.createElement('span');
	for (let wordID = 0; wordID < words.length; wordID++) {
		if (words[wordID] == undefined || words[wordID] == null) continue;
		if (!/(PRE|CODE)/i.test(tag) && (words[wordID].search(/\n\t+/) != -1 || words[wordID].search(/\n+\ /) != -1)) 
			if ((wordID > 0 && words[wordID-1].search(/\s/mg) != -1) || (wordID == 0 && words.length == 1))
			continue;
		let word = words[wordID];
		let boldNum = Math.min(word.length,3);
		const bold = document.createElement('b');
		if (weight <= 400)
			bold.setAttribute('style', 'font-weight:'+wt+'!important');
		else
			bold.setAttribute('style', 'font-weight:'+weight+'!important');
		bold.setAttribute(focalAnchors.attrNameHighlight, '');
		bold.textContent = word.substring(0, boldNum);
		node.parentNode.insertBefore(bold, node);
		node.parentNode.insertBefore(document.createTextNode(word.substr(boldNum)), node);
	}
	if (node.textContent.replaceAll(/\s+/mg,'').length > 1) {
	node.parentNode.appendChild(spann);
	spann.appendChild(node);
	}
	words.length = 0;
	} else {
	let words = txtc.split(' ');
	const spann = document.createElement('span');
	for (let wordID = 0; wordID < words.length; wordID++) {
		if (words[wordID] == undefined || words[wordID] == null || words[wordID].length == 0) continue;
		if (!/(PRE|CODE)/i.test(tag) && words[wordID].replaceAll(/\s/g,'').length == 0 && (words[wordID].search(/\n+\t*/) != -1 || words[wordID].search(/\n+\ /) != -1)) continue;
		let word = words[wordID];
		let boldNum = Math.min(word.length,3);
		if (mtrIndic.includes(word.charCodeAt(2)) || mtrIndic.includes(word.charCodeAt(3)) || mtrIndic.includes(word.charCodeAt(4)) || mtrIndic.includes(word.charCodeAt(5))) {
			if (mtrIndic.includes(word.charCodeAt(2))) boldNum =Math.min(word.length,4);
			if (mtrIndic.includes(word.charCodeAt(3))) boldNum =Math.min(word.length,5);
			if (mtrIndic.includes(word.charCodeAt(4))) boldNum =Math.min(word.length,6);
			if (mtrIndic.includes(word.charCodeAt(5))) boldNum =Math.min(word.length,7);
		}
		if (mtrIndic.includes(word.charCodeAt(boldNum)) && boldNum+1 <= word.length) boldNum++;
		if (mtrIndic.includes(word.charCodeAt(boldNum)) && boldNum+1 <= word.length) boldNum++;
		const bold = document.createElement('b');
		if (weight <= 400)
			bold.setAttribute('style', 'font-weight:'+wt+'!important');
		else
			bold.setAttribute('style', 'font-weight:'+weight+'!important');
		bold.setAttribute(focalAnchors.attrNameHighlight, '');
		bold.textContent = word.substr(0, boldNum);
		node.parentNode.insertBefore(bold, node);
		node.parentNode.insertBefore(document.createTextNode(word.substr(boldNum)+ '\u0020'), node);
	}
	if (node.textContent.replaceAll(/\s+/mg,'').length > 1) {
	node.parentNode.appendChild(spann);
	spann.appendChild(node);
	}
	words.length = 0;
	}
}

function invertEmojis(node) {
	if (node instanceof Element && node.hasAttribute(focalAnchors.attrNameContainer)) return;
	let txtc = node.textContent;
	var tag = '',ptag = '';
	if (node.parentNode) tag = node.parentNode.nodeName;
	if (node.parentNode && node.parentNode.parentNode) ptag = node.parentNode.parentNode.nodeName;
	let words = txtc.split(/' '/);
	for (let wordID = 0; wordID < words.length; wordID++) {
		if (words[wordID] == undefined || words[wordID] == null || words[wordID].length == 0) continue;
		if (!/(PRE|CODE)/i.test(tag) && words[wordID].replaceAll(/\s/g,'').length == 0) continue; // && (words[wordID].search(/\n+\t*/) != -1 || words[wordID].search(/\n+\ /) != -1)) continue;
		if (!/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/umg.test(words[wordID])) {
		let word = words[wordID];
		let boldNum = word.length;
		const bold = document.createElement('span');
		bold.textContent = word;
		node.parentNode.insertBefore(bold, node);
		node.parentNode.insertBefore(document.createTextNode(word.substring(boldNum)+' '), node);
		} else {
		let word = words[wordID];
		let matches = word.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]{1,}/umg);
		let indx2 = word.lastIndexOf(matches[matches.length-1]) + matches[matches.length-1].length;
		let boldNum = indx2;
		const bold = document.createElement('span');
		bold.textContent = word.substring(0, indx2);
		if ((/span/i.test(tag) && /filter.*invert/i.test(node.parentNode.getAttribute('style'))) || (/span/i.test(ptag) && /filter.*invert/i.test(node.parentNode.parentNode.getAttribute('style'))))
			bold.setAttribute('style', 'color:white!important;');
		else
			bold.setAttribute('style', 'filter:invert(1)!important;color:white!important;');
		node.parentNode.insertBefore(bold, node);
		node.parentNode.insertBefore(document.createTextNode(word.substring(boldNum)+' '), node);
		matches.length = 0;
		}
	}
	words.length = 0;
}

function calcBrightness([r, g, b, a = 1])
{
	return (0.299*r + 0.587*g + 0.114*b)*a;
}

function calcColorfulness([r, g, b, a = 1])
{
	let max = Math.max(r,g,b);
	let min = Math.min(r,g,b);
	if (max == 0) return 0;
	let cful = ((max + min)*(max - min))/max;
	return a*cful;
}

function containsText(node, mp, nc, map, b_ctext, nodes)
{
	let len = 0;
	var r, tot;
	if (mp.get(node) == true) return b_ctext[nc];
	if (node.innerText != undefined && mp.get(node) != true && node.innerText) {
		if (node.outerHTML.indexOf('<SCRIPT>') < 0 && node.outerHTML.indexOf('<STYLE>') < 0) {
		r = node.innerText.replace(/[^\S]+/g,"");
		len = len + parseInt(r.length);
		b_ctext[nc] = len;
		mp.set(node, true);
		return len;
		}
	}
	if (node.nodeType  == Node.TEXT_NODE) {
	 	r = node.nodeValue.replace(/[^\S]+/g,"");
		len = len + parseInt(r.length);
	}
	if (node.value != undefined && node.value) {
		if (node.outerHTML.indexOf('<SCRIPT>') < 0 && node.outerHTML.indexOf('<STYLE>') < 0) {
		r = node.value.replace(/[^\S]+/g,"");
		len = len + parseInt(r.length);
		}
	}

	if (mp.get(node) != true) {
	let childn = Array.from(node.getElementsByTagName('*'));
	var ch;
	tot = len;
	for (let x=0; x < childn.length; x++) {
		ch = childn[x];
		len = 0;
		if (map.get(ch) == undefined)
			map.set(ch, map.get(nodes[0])+nodes.indexOf(ch));
		if (mp.get(ch) == true) return b_ctext[map.get(ch)];
		if (ch.children)
			len = containsText(ch, mp, map.get(ch), map, b_ctext, nodes);
		if (ch instanceof Element && ch.outerHTML.indexOf('<SCRIPT>') < 0 && ch.outerHTML.indexOf('<STYLE>') < 0) {
			if (ch.innerText != undefined && ch.innerText) {
				r = ch.innerText.replace(/[^\S]+/g,"");
				len = len + parseInt(r.length);
			} else if (ch.value != undefined && ch.value) {
				r = ch.value.replace(/[^\S]+/g,'');
				len = len + parseInt(r.length);
			} else if (ch.textContent != undefined && ch.textContent) {
				r = ch.textContent.replace(/[^\S]+/g,'');
				len = len + parseInt(r.length);
			}
		}
		if (ch.nodeType  == Node.TEXT_NODE && /\S/.test(ch.nodeValue)) {
			r = ch.nodeValue.replace(/[^\S]+/g,"");
			len = len + parseInt(r.length);
		}
		b_ctext[map.get(ch)] = len;
		tot += len;
		mp.set(ch, true);
	}
	childn.length = 0;
	b_ctext[nc] = tot;
	mp.set(node, true);
	}

	if (b_ctext[nc] == undefined)
		b_ctext[nc] = len;
	return len;
}

function getVarValue(va) {
	var b = '';
	if (/var\(/i.test(va)) {
		b = va.replace(/var\((.*?)\)/i, `$1`);
		return root_style.getPropertyValue(b);
	} else {
		return '';
	}
}

async function waitForImage(im) {
return new Promise((res, rej) => {
if (im.complete) {
return res();
}
im.onload = () => res();
im.onerror = () => res();
});
}

async function getBgImage(ch, gcs, bgim) {
	if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
		return false;
	var im, src, src1, wi, he;
	if (/var\(/i.test(bgim))
		src1 = getVarValue(bgim);
	else
		src1 = bgim;
	im = new Image();
	src = src1.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
	im.src = src;
	await waitForImage(im);
	wi = parseInt(im.width);
	he = parseInt(im.height);
	return [wi, he];
}

async function isImage(ch, nc, imar, gcs, b_imgforce) {
	if (!(ch instanceof Element)) return false;
	if (b_imgforce[nc] != true) b_imgforce[nc] = false;
	var wi,he;
	let bgim = gcs.backgroundImage ? gcs.backgroundImage : '';
	let chsrc = ch.src ? ch.src : '';
	let itag = ch.nodeName.toUpperCase();
	switch (itag) {
	case 'IMG':
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		wi = parseInt(ch.width);
		he = parseInt(ch.height);
		if (!wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		}
		imar[nc] = wi*he;
		if (wi > 499 && he > 99) b_imgforce[nc] = true;
		return true;
	case'SVG':
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		imar[nc] = wi*he;
		if (wi > 499 && he > 99) b_imgforce[nc] = true;
		return true;
	case 'VIDEO':
	case 'EMBED':
	case 'OBJECT':
	case 'CANVAS':
	case 'PICTURE':
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		wi = parseInt(ch.width);
		he = parseInt(ch.height);
		if (!wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		}
		imar[nc] = wi*he;
		return true;
	default:
	if ( gcs != null && bgim != '' && bgim != 'none' && gcs.getPropertyValue('display') != 'none' && !/(php|htm[l]?|asp[x]?)[\"\'\)]/i.test(bgim) && /(\/|http|url)/ig.test(bgim)) {
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		var im, src, src1;
		if (/var\(/i.test(bgim))
			src1 = getVarValue(bgim);
		else
			src1 = bgim;
                im = new Image();
                src = src1.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
		im.src = src;
		await waitForImage(im);
		wi = parseInt(im.width);
		he = parseInt(im.height);
		if (/\.svg/i.test(src) && !wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width));
		he = parseInt(parseInt(ch.getBoundingClientRect().height));
		} else if (!wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		}
		imar[nc] = wi*he;
		if (wi > 499 && he > 99) b_imgforce[nc] = true;
		if ((wi > 0 && he > 0) || (wi == 0 && he == 0)) {
			return true;
		} else {
			return false;
		}
	} else if (chsrc != undefined && chsrc && ch.display != 'none' && ch.type != null && ch.type != undefined && ch.type.toLowerCase() == 'image' && !/(php|htm[l]?|asp[x]?)[\"\'\)]/i.test(chsrc) && !/(php|htm[l]?|asp[x]?)[\"\'\)]/i.test(bgim)  && (/(\/|http|url)/ig.test(chsrc))) {
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && ch.getAttribute('loading') != 'lazy')
			return false;
		var im, src, src1;
                im = new Image();
		if (/var\(/i.test(bgim))
			src1 = getVarValue(chsrc);
		else
			src1 = chsrc;
                src = src1.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
		im.src = src;
		await waitForImage(im);
		wi = parseInt(im.width);
		he = parseInt(im.height);
		if (!wi && !he) {
		wi = parseInt(parseInt(ch.getBoundingClientRect().width)/10);
		he = parseInt(parseInt(ch.getBoundingClientRect().height)/10);
		}
		imar[nc] = wi*he;
		if (wi > 499 && he > 99) b_imgforce[nc] = true;
		return true;
	} else {
		return false;
	}
	}
	return false;
}

function containsImage(node, imgs)
{
	let childn = Array.from(node.getElementsByTagName('*'));
	var img;
	for (let img of imgs) {
		if (childn.includes(img))
			return true;
	}
	childn.length = 0;
	return false;
}

function parentStyle(node,reg,arr) {
	let pch = node.parentNode;
	let b_found = false;
	let ns = [node];
	while (pch && !/^(BODY|HTML)/i.test(pch.nodeName)) {
		ns.push(pch);
		if (pch && pch.getAttribute)
		if (!reg.test(pch.getAttribute('style')) && !reg.test(pch.style.filter)) {
			pch = pch.parentNode;
			continue;
		} else {
			b_found = true; break;
		}
		pch = pch.parentNode;
	}
	if (b_found)
		arr.push(...ns);
	else
		for (let x=0; x < ns.length; x++) {
			let n = ns[x];
			let i = arr.indexOf(n);
			if (i >= 0)
				arr.splice(x,1);
		}
	return b_found;
}

function getBgColor(parnt, bg_color)
{
	let disp = '';

	let transparent = 'rgba(0, 0, 0, 0)';
	let bbg_color = bg_color;
	while (bbg_color == transparent && parnt && parnt != undefined) {
		if (parnt instanceof Element) {
		let gcs = getComputedStyle(parnt);
		bbg_color = gcs.backgroundColor;
		disp = gcs.display || gcs.visibility;
		if (bbg_color != undefined && bbg_color && disp != 'none' && disp != 'hidden' && bbg_color != transparent) {
			bg_color = bbg_color;
			break;
		}
		}
		parnt = parnt.parentNode;
	}

	return bg_color;
}

function getBgBrightness(parnt, bg_color)
{
	let bg_luma = 256;
	
	let bbg_color = getBgColor(parnt, bg_color);
	if (bbg_color != 'rgba(0, 0, 0, 0)') bg_luma = calcBrightness(getRGBarr(bbg_color));
	
	return bg_luma;
}

function topNode(node) {
	let pch = node.parentNode;
	let c = 0;
	while (pch && !/^(BODY|HTML)/i.test(pch.nodeName)) {
		pch = pch.parentNode;
		c++;
	}
	return c;
}

function getCSS(cfg) {

	const attr = '[d__],[d__][style]';
	let color_black = 'color:black!important;';

	let dim = '';
	let sCaps = '';
	var brght,ctrst;
	if (cfg.advDimming) {
		brght = 'var(--g_brightness)';
		ctrst = 'var(--g_contrast)';
		document.documentElement.style.setProperty('--g_brightness',(100 + (parseInt(cfg.contrast))).toFixed(1)+'%');
		document.documentElement.style.setProperty('--g_contrast', (50 + parseInt(cfg.brightness)).toFixed(1)+'%');
		dim = `filter:brightness(var(--g_brightness)) contrast(var(--g_contrast))!important;`;
	}

	let opacity = '';
	if (cfg.forceOpacity)
		opacity = 'opacity:1!important;';

	let boldw = cfg.weight;
	let bold = '';
	if (!(cfg.skipLinks && !cfg.start3))
	if (!cfg.start3 || boldw < 400)
	if (boldw != 400)
		bold = `*{font-weight:${boldw}!important};`;

	let underline = '';
	if (cfg.underlineLinks)
		underline = '[u__]{text-decoration:underline!important}';

	if (!cfg.forcePlhdr)
		color_black = '';

	if (cfg.makeCaps)
		sCaps = 'font-variant-caps:small-caps!important;';

	const placeholder = `::placeholder{opacity:1!important;${color_black}};`;

	let form_border = '';
	if (cfg.input_border)
		form_border = '[b__]{border:1px solid black!important}';

	if (cfg.forcePlhdr && (cfg.contrast != 0 || cfg.brightness != 50)) {
		g_brightness = 1.0+parseInt(cfg.contrast)/100;
		g_contrast = 1.0 + (parseInt(cfg.brightness)-50)/100;
		document.documentElement.style.setProperty('--g_brightness',parseInt(100*g_brightness)+'%');
		document.documentElement.style.setProperty('--g_contrast', parseInt(100*g_contrast)+'%');
		g_m = multiplyMatrices(Matrix.identity(), Matrix.brightness(g_brightness));
		g_m2 = multiplyMatrices(g_m, Matrix.contrast(g_contrast));
		g_m = multiplyMatrices(g_m2, Matrix.invertNHue());
	} else if (cfg.forcePlhdr && cfg.contrast == 0 && cfg.brightness == 50) {
		g_brightness = 1.00;
		g_contrast = 1.00;
		document.documentElement.style.setProperty('--g_brightness',parseInt(100*g_brightness)+'%');
		document.documentElement.style.setProperty('--g_contrast', parseInt(100*g_contrast)+'%');
		g_m = Matrix.invertNHue();
	}

	let cust = '';
	if (cfg.customCss)
		cust = cfg.customCssText;

	let size_inc = '';
//	let c = cfg.threshold;
//	let cc = parseInt(c) + parseFloat(cfg.size/c);
//	let height_inc = parseFloat(cfg.size/c)/parseFloat(cfg.size);
	let c = 0;
	let cc = 0;
	let height_inc = 1;
	var pcent;

	let n_zoo = Math.abs(parseFloat(cfg.strength)/100).toFixed(2);
	if (cfg.customCss && /\-\-g_zoom/.test(cust)) {
		let cs = cust;
		cs = cs.replace(/[\w\W]*g_zoom.*?([0-9\.]+)[\w\W]*/g,`$1`);
		n_zoo = parseFloat(cs);
	} else if (cfg.globalCss != undefined && cfg.globalCss && /\-\-g_zoom/.test(cfg.globalCss)) {
		let cs = cfg.globalCss;
		cs = cs.replace(/[\w\W]*g_zoom.*?([0-9\.]+)[\w\W]*/g,`$1`);
		n_zoo = parseFloat(cs);	
	} else if (cfg.strength == 0) {
		n_zoo = 1.75;
	}

	document.documentElement.style.setProperty('--g_zoom',n_zoo);

	g_mag = ".enlarge:hover { position: relative; overflow: visible;-webkit-transform: scale(var(--g_zoom));-moz-transform: scale(var(--g_zoom));-o-transform: scale(var(--g_zoom));-ms-transform: scale(var(--g_zoom));transform: scale(var(--g_zoom));max-width: 100%!important;-webkit-transition: all .2s ease-in-out;-moz-transition: all .2s ease-in-out;-o-transition: all .2s ease-in-out;-ms-transition: all .2s ease-in-out;z-index: 19999;} .enlarge {position: relative; overflow: hidden;z-index: 1000; }";

	g_foot_re = false;
	if (cfg.customCss && /\-\-g_foot_re/.test(cust)) {
		let cs = cust;
		cs = cs.replace(/[\w\W]*g_foot_re.*?([0-9\.]+)[\w\W]*/g,`$1`);
		let val = parseInt(cs);
		if (val) g_foot_re = true;
	} else if (cfg.globalCss != undefined && cfg.globalCss && /\-\-g_foot_re/.test(cfg.globalCss)) {
		let cs = cfg.globalCss;
		cs = cs.replace(/[\w\W]*g_foot_re.*?([0-9\.]+)[\w\W]*/g,`$1`);
		let val = parseInt(cs);
		if (val) g_foot_re = true;
	}

	if (cfg.size > 0 && cfg.threshold > 0) {
		while (c < cfg.threshold) {
			++c;
			if (!cfg.start3 && cfg.skipLinks)
				cc = (cfg.size*0.2) + (parseFloat(cfg.threshold*1.075) - (2*c/11))*(100+((cfg.weight+400) % 900))/900;
			else
				cc = (cfg.size*0.2) + parseFloat(cfg.threshold*1.075) - (2*c/11);
			if (!cfg.start3 && cfg.skipLinks)
				pcent = Math.abs((2.5*cfg.size) - (c*20/cfg.threshold))*(100+((cfg.weight+400) % 900))/900;
			else
				pcent = Math.abs((2.5*cfg.size) - (c*20/cfg.threshold));
			if (parseFloat(cc) < c) { cc = c; }
			if (parseFloat(cc) > cfg.threshold) cc = cfg.threshold;
			let cc1 = parseInt(cc);
			height_inc = ((c+(parseInt(cfg.size)+parseInt(cfg.threshold))*0.04)/c).toFixed(3);
			let cc2 = (cc1*(1+parseFloat(pcent)/100)).toFixed(1);
			size_inc += `[s__='${c}']{font-size: ${cc2}px!important;`;
			if (!cfg.skipHeights)
				size_inc += `line-height: ${height_inc}em!important;${sCaps}${dim}${opacity}}\n`;
			else
				size_inc += `${sCaps}${dim}${opacity}}\n`;
			size_inc += `[h__='${c}']{line-height:110%!important;min-height: ${height_inc}em!important}`;
			if (!cfg.skipHeights)
//				f_sizes[c] = "font-size: calc(" + cc + "px + " + pcent + "%)!important;"+sCaps+"line-height: " + height_inc + "em!important;" + dim + opacity;
				f_sizes[c] = "font-size: " + cc2 + "px!important;"+sCaps+"line-height: " + height_inc + "em!important;" + dim + opacity;
			else
				f_sizes[c] = "font-size: " + cc2 + "px!important;"+sCaps+ dim + opacity;
//				f_sizes[c] = "font-size: calc(" + cc + "px + " + pcent + "%)!important;"+sCaps+";" + dim + opacity;
			h_sizes[c] = `${height_inc}em`;
//			f2_sizes[c] = "calc(" + cc + "px + " + pcent + "%)";
			if (/\.0$/.test(cc2)) cc2 = parseInt(cc2);
			f2_sizes[c] = cc2 + "px";
		}
	}
	str_style = `brightness(${brght}) contrast(${ctrst})`;
	str_style2 = '1';

	g_globalCss = '';
	if (cfg.globalCss != undefined && cfg.globalCss)
		g_globalCss = cfg.globalCss;

	return `${bold}${size_inc}${g_mag}${form_border}${underline}${g_globalCss}${cust}`;
}

function createElem()
{
	let doc = document;

	style_node = doc.createElement('style');
	style_node.setAttribute('id', '_btv_');
	let d_head = doc.head || doc.getElementsByTagName('HEAD')[0];
	if (d_head != undefined && d_head != null)
		d_head.appendChild(style_node);
	else
		d_head = '';

	css_node = doc.createTextNode('');
}

async function init()
{
	if (document.getElementById('_btv_')) {
		if (style_node != null && style_node != undefined) {
			style_node.appendChild(css_node);
			return;
		}
	}

	createElem();

	let stored = [
		'enableEverywhere',
		'whitelist',
		'blacklist',
		'globalStr',
		'size',
		'sizeThreshold',
		'weight',
		'skipColoreds',
		'skipHeadings',
		'advDimming',
		'brightness',
		'contrast',
		'forceOpacity',
		'normalInc',
		'normalInc2',
		'ssrules',
		'forcePlhdr',
		'forceIInv',
		'pseudoAB',
		'skipWhites',
		'makeCaps',
		'start3',
		'skipLinks',
		'skipNavSection',
		'skipHeights',
		'underlineLinks',
		'input_border',
		'fontFamily',
		'fontFamilyName',
		'customCss',
		'customCssText',
		'globalCss'
	];

	let cfg = await new Promise(res => chrome.storage.local.get(stored, res));

	cfg.strength  = cfg.globalStr;
	cfg.threshold = cfg.sizeThreshold;

	let url = window.location.hostname || window.location.href;
	g_url = url.trim();

	let bl  = cfg.blacklist || [];
	let idx = bl.findIndex(x => x.url === url);

	if (idx > -1) {
		let cnode = document.getElementById("_btv_");
		if (style_node.hasChildNodes()) {
			style_node.removeChild(cnode);
		}
		cnode.remove();
		return;
	}

	let wl  = cfg.whitelist || [];
	idx = wl.findIndex(x => x.url === url);

	let g_css = cfg.globalCss;
	if (idx > -1) {
		cfg = wl[idx];
	} else if (!cfg.enableEverywhere) {
		let cnode = document.getElementById("_btv_");
		cnode.remove();
		return;
	}
	cfg.globalCss = g_css;
	t_start = Date.now();

	start(cfg);
}

async function start(cfg, url)
{
	css_node.nodeValue = getCSS(cfg);

/**	for (let s of document.getElementsByTagName('STYLE')) {
		css_node.nodeValue += s.innerHTML;
	}*/

	let nodes = [];

	if (document.body)
		nodes = Array.from(document.body.getElementsByTagName('*'));
	else
		return;

	let tags_to_skip = [
		'SCRIPT',
		'STYLE',
		'VIDEO',
		'AUDIO',
		'SVG',
		'IMG',
		'PICTURE',
		'EMBED',
		'OBJECT',
		'SOURCE',
		'CANVAS',
		'NOSCRIPT',
		'UNDEFINED'
	];

	let colors_to_skip  = [
		'rgb(0, 0, 0)',
		'rgba(0, 0, 0, 0)'
	];

	let hdr_tags = ['H1', 'H2', 'H3', 'H4'];

	if (cfg.skipWhites) {
		let white = [
			'rgb(255, 255, 255)',
			'rgb(254, 254, 254)',
			'rgb(253, 253, 253)'
		];

		colors_to_skip.push(...white);
	}

	let callcnt = 0;

	let b_ctext = {};
	let b_chimg = {};
	let b_iimg = {};
	let b_fnt = {};
	let b_dim = {};
	let m_sty = {};
	let b_emo = {};
	let b_noemo = true;
	let b_idone = {};
	let b_cdone = {};
	let b_chk = {};
	let b_imgforce = {};
	let n_rulecount = 0;
	let images = [];
	let img_area = {};
	let map = new Map();
	let mp = new Map();
	let m_ss = {};
	let m_done = {};
	let nodes_behind_img = [];
	let nodes_behind_inv = [];
	let n_imgcount = 0;
	let b_csp = true;
	let b_forced = false;
	let str300 = cfg.strength == -300;
	root_style = getComputedStyle(document.documentElement);
	let rootsty = root_style;
	let browser_sfz = 'px';
	if (rootsty.fontSize && /\d.*?px/i.test(rootsty.fontSize))
		browser_sfz = rootsty.fontSize;
	g_eng = false;
	var lang;
	if (cfg.start3 || cfg.makeCaps) {
		lang = document.documentElement.lang;
		if (lang == null || lang.length == 0)
			g_eng = true;
		else if (/^en/i.test(lang))
			g_eng = true;
	} else {
		g_eng = true;
	}
	let rootcolor       =  getRGBarr(rootsty.backgroundColor);
	let bodycolor       =  getRGBarr(getComputedStyle(document.body).backgroundColor)
	if (rootcolor != '' && bodycolor != '') {
	let rootLightness   = 1 -  rootcolor[3] + rootcolor[3] * calcBrightness(rootcolor)/255;
	let finalLightness  = Math.abs((1 - bodycolor[3]) * rootLightness + bodycolor[3] * calcBrightness(bodycolor)/255);
	finalLightness = Math.sqrt(finalLightness);
        if (window.self == window.top)
		chrome.storage.local.set({lightness: finalLightness, default_size: browser_sfz});
	console.log('Dark / Light = '+finalLightness.toFixed(2));
	if (cfg.forcePlhdr || cfg.advDimming)
	if (finalLightness < 0.5)  {
		if (cfg.advDimming && cfg.forcePlhdr) {
			var cs = css_node.nodeValue;
			var rcs = cs.replaceAll(/filter.*?brightness.*?contrast.*?important\;/mg,'');
			css_node.nodeValue = rcs;
			cfg.forcePlhdr = true;
			cfg.advDimming = false;
		} else {
			if (cfg.advDimming) {
				cfg.forcePlhdr = false;
				cfg.forceIInv = false;
			} else if (cfg.forcePlhdr) {
				cfg.forcePlhdr = false;
				cfg.forceIInv = false;
				cfg.advDimming = true;
				b_forced = true;
			}
		}
	} else {
		if (cfg.advDimming && cfg.forcePlhdr) {
			cfg.forcePlhdr = false;
			cfg.forceIInv = false;
		} else {
			if (cfg.advDimming) b_forced = true;
			cfg.forcePlhdr = true;
			cfg.advDimming = false;
			var cs = css_node.nodeValue;
			var rcs = cs.replaceAll(/filter.*?brightness.*?contrast.*?important\;/mg,'');
			css_node.nodeValue = rcs;
		}
	}
	}

	let style_rule = "";
	if (cfg.forcePlhdr && cfg.forceIInv) {
	style_rule += "IMG,SVG,CANVAS,OBJECT,VIDEO,EMBED,INPUT[type='image'] { filter:invert(1); }";
	style_rule += "._btvinvertb_:before,._btvinverta_:after { filter:invert(1); }";
	style_rule += "[style*='background-image:url'],[style*='background-image:var'],[style*='background-image: url'],[style*='background-image: var']  { filter:invert(1); }";
	style_rule += "body[style*='background-image:url'],body[style*='background-image:var'],body[style*='background-image: url'],body[style*='background-image: var'] { filter:unset!important; }";
	style_rule += "[style*='background-image:none'],[style*='background-image: none'] { filter:unset!important; }";
	style_rule += "frame,iframe { filter:invert(1); }";
	}

	css_node.nodeValue += style_rule;

	style_node.appendChild(css_node);

	if ((cfg.customCss && cfg.customCssText) || g_globalCss) {

	let docs = getComputedStyle(document.documentElement);

	g_bg_contrast_old = docs.getPropertyValue('--g_bg_contrast_old');
	if (!g_bg_contrast_old || g_bg_contrast_old == undefined)
		g_bg_contrast_old = 19;

	g_bg_contrast = docs.getPropertyValue('--g_bg_contrast');
	if (!g_bg_contrast || g_bg_contrast == undefined)
		g_bg_contrast = 27;

	g_fg_brightness_min = docs.getPropertyValue('--g_fg_brightness_min');
	if (!g_fg_brightness_min || g_fg_brightness_min == undefined)
		g_fg_brightness_min = 90;

	g_min_colorfulness = docs.getPropertyValue('--g_min_colorfulness');
	if (!g_min_colorfulness || g_min_colorfulness == undefined)
		g_min_colorfulness = 41;

	g_bg_threshold = docs.getPropertyValue('--g_bg_threshold');
	if (!g_bg_threshold || g_bg_threshold == undefined)
		g_bg_threshold = 160;

	g_bg_threshold_new = docs.getPropertyValue('--g_bg_threshold_new');
	if (!g_bg_threshold_new || g_bg_threshold_new == undefined)
		g_bg_threshold_new = 50;

	g_bg_threshold_new_default = docs.getPropertyValue('--g_bg_threshold_new_default');
	if (!g_bg_threshold_new_default || g_bg_threshold_new_default == undefined)
		g_bg_threshold_new_default = 150;

	} else {
		g_bg_contrast_old = 19;
		g_bg_contrast = 27;
		g_fg_brightness_min = 90;
		g_min_colorfulness = 41;
		g_bg_threshold = 160;
		g_bg_threshold_new = 50;
		g_bg_threshold_new_default = 150;
	}

	var doc = document;
	let rn = 0;
	let b_sec = false;
	let body_nfz = 16;
	let b_bdone = false;
	if (browser_sfz) body_nfz = parseInt(browser_sfz);
	for (var si = 0; si < document.styleSheets.length; si++) {
		var sheet,rules
		try {
		sheet = document.styleSheets[si];
		rules = sheet.cssRules;
		} catch (e) { continue; }
		try {
		let rl = rules.length;
		if (rl > 1000) continue;
		let ri = 0;
		for (ri = 0; ri < rl; ri++) {
		b_sec = false;
		let rule= rules[ri];
		let fgr = '';
		let txtrul = '';
		let txtrul2 = '';
		if (rule.href) { rules = rule.styleSheet.cssRules; ri = 0; rl = rules.length;continue; }
		if (rule.selectorText && rule.style) {
		let key = rule.selectorText;
		let value = rule.style.cssText;
		if (m_done[key] == undefined) m_done[key] = 0;
		if ((cfg.forcePlhdr && cfg.normalInc) || cfg.advDimming)
		if (m_done[key] < 3 && (rule.style.color || rule.style.backgroundColor || rule.style.borderColor)) {
			m_done[key]++;
			if (/\:(before|after)/i.test(key)) {
				if (rule.style.color && rule.style.color.indexOf('calc\(') < 0) {
					if (/var\(/i.test(rule.style.color)) {
					let a = rule.style.getPropertyValue('color');
					let b = getVarValue(a);
					if (!/^rgb/i.test(b))
					if (b.indexOf('#') >= 0) {
						let c = b.length == 4 ? b+'f' : b+'ff';
						b = hexToRGBA(c);
					} else if (/^hsl/i.test(b)) {
						let c = getHSLarr(b);
						b = hslToRGB(c);
					}
					let fgarr = b;
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindFg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					} else if (/rgba?/i.test(rule.style.color)) {
					let fgarr = getRGBarr(rule.style.color);
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindFg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					} else if (/^\#/.test(rule.style.color)) {
					let a = rule.style.color;
					let b = a.length == 4 ? a+'f' : a+'ff';
					let fgarr = hexToRGBA(b);
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindFg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					} else if (/^hsl/i.test(rule.style.color)) {
					let c = getHSLarr(rule.style.color);
					let fgarr = hslToRGB(c);
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindFg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					}
				}
				if (rule.style.backgroundColor && rule.style.backgroundColor.indexOf('calc\(') < 0) {
					if (/var\(/i.test(rule.style.backgroundColor)) {
					let a = rule.style.getPropertyValue('background-color');
					let b = getVarValue(a);
					if (!/^rgb/i.test(b))
					if (b.indexOf('#') >= 0) {
						let c = b.length == 4 ? b+'f' : b+'ff';
						b = hexToRGBA(c);
					} else if (/^hsl/i.test(b)) {
						let c = getHSLarr(b);
						b = hslToRGB(c);
					}
					let fgarr = b;
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindBg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('background-color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					} else if (/rgba?/i.test(rule.style.backgroundColor)) {
					let fgarr = getRGBarr(rule.style.backgroundColor);
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindBg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('background-color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					} else if (/^\#/.test(rule.style.backgroundColor)) {
					let a = rule.style.backgroundColor;
					let b = a.length == 4 ? a+'f' : a+'ff';
					let fgarr = hexToRGBA(b);
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindBg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('background-color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					} else if (/^hsl/i.test(rule.style.backgroundColor)) {
					let c = getHSLarr(rule.style.color);
					let fgarr = hslToRGB(c);
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindBg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('background-color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					}
				}
				if (rule.style.borderColor && rule.style.borderColor.indexOf('calc\(') < 0) {
					if (/var\(/i.test(rule.style.borderColor)) {
					let a = rule.style.getPropertyValue('border-color');
					let b = getVarValue(a);
					if (!/^rgb/i.test(b))
					if (b.indexOf('#') >= 0) {
						let c = b.length == 4 ? b+'f' : b+'ff';
						b = hexToRGBA(c);
					} else if (/^hsl/i.test(b)) {
						let c = getHSLarr(b);
						b = hslToRGB(c);
					}
					let fgarr = b;
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindFg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('border-color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					} else if (/rgba?/i.test(rule.style.borderColor)) {
					let fgarr = getRGBarr(rule.style.borderColor);
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindFg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('border-color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					} else if (/^\#/.test(rule.style.borderColor)) {
					let a = rule.style.borderColor;
					let b = a.length == 4 ? a+'f' : a+'ff';
					let fgarr = hexToRGBA(b);
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindFg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('border-color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					} else if (/^hsl/i.test(rule.style.borderColor)) {
					let c = getHSLarr(rule.style.color);
					let fgarr = hslToRGB(c);
					var fgr1;
					if (cfg.advDimming)
						fgr1 = applyColorMatrix([parseInt(fgarr[0]), parseInt(fgarr[1]), parseInt(fgarr[2])]);
					else
						fgr1 = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
					fgr1[3] = fgarr[3];
					if (fgr1[0] != fgarr[0] || fgr1[1] != fgarr[1] || fgr1[2] != fgarr[2]) {
					if (cfg.normalInc2) {
						fgr = colorblindFg(fgr1, cfg, false, false, 10);
						fgr1 = getRGBarr(fgr);
					}
					fgr = 'rgba('+fgr1+')';
					rule.style.setProperty('border-color',fgr,'important');
					if (!cfg.advDimming) {
						m_sty[fgarr] = fgr1;
						m_sty[fgr1] = fgr1;
					}
					}
					}
				}
			} else if (!cfg.advDimming) {
			if (rule.style.color && rule.style.color.indexOf('calc\(') < 0) {
			var colr, tcol;
			tcol = rule.style.color;
			if (/var\(/i.test(tcol))
				colr = getVarValue(tcol);
			else
				colr = tcol;
			if (colr.substring(0,3) == 'rgb') {
			let fgarr = getRGBarr(colr);
			fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
			fgr[3] = fgarr[3];
			if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
			m_sty[fgarr] = fgr;
			m_sty[fgr] = fgr;
			}
			let co = 'rgba('+fgr+')';
			rule.style.setProperty('color',co,'important');
			} else if (colr.substring(0,3) == 'hsl') {
			let c = getHSLarr(colr);
			let fgarr = hslToRGB(c);
			fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
			fgr[3] = fgarr[3];
			if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
			m_sty[fgarr] = fgr;
			m_sty[fgr] = fgr;
			}
			let co = 'rgba('+fgr+')';
			rule.style.setProperty('color',co,'important');
			} else if (colr.substring(0,1) == '#') {
			let c = colr.length == 4 ? colr+'f' : colr+'ff';
			let fgarr = hexToRGBA(c);
			fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
			fgr[3] = fgarr[3];
			if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
			m_sty[fgarr] = fgr;
			m_sty[fgr] = fgr;
			}
			let co = 'rgba('+fgr+')';
			rule.style.setProperty('color',co,'important');
			}
			}
			if (rule.style.backgroundColor && rule.style.backgroundColor.indexOf('calc\(') < 0) {
			var colr, tcol;
			tcol = rule.style.backgroundColor;
			if (/var\(/i.test(tcol))
				colr = getVarValue(tcol);
			else
				colr = tcol;
			if (colr.substring(0,3) == 'rgb') {
			let fgarr = getRGBarr(colr);
			fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
			fgr[3] = fgarr[3];
			if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
			m_sty[fgarr] = fgr;
			m_sty[fgr] = fgr;
			}
			//let co = 'rgba('+fgr+')';
			//rule.style.setProperty('background-color',co,'important');
			} else if (colr.substring(0,3) == 'hsl') {
			let c = getHSLarr(colr);
			let fgarr = hslToRGB(c);
			fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
			fgr[3] = fgarr[3];
			if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
			m_sty[fgarr] = fgr;
			m_sty[fgr] = fgr;
			}
			let co = 'rgba('+fgr+')';
			rule.style.setProperty('background-color',co,'important');
			} else if (colr.substring(0,1) == '#') {
			let c = colr.length == 4 ? colr+'f' : colr+'ff';
			let fgarr = hexToRGBA(c);
			fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
			fgr[3] = fgarr[3];
			if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
			m_sty[fgarr] = fgr;
			m_sty[fgr] = fgr;
			}
			let co = 'rgba('+fgr+')';
			rule.style.setProperty('background-color',co,'important');
			}
			}
			if (rule.style.borderColor && rule.style.borderColor.indexOf('calc\(') < 0) {
			var colr, tcol;
			tcol = rule.style.borderColor;
			if (/var\(/i.test(tcol))
				colr = getVarValue(tcol);
			else
				colr = tcol;
			if (colr.substring(0,3) == 'rgb') {
			let fgarr = getRGBarr(colr);
			fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
			fgr[3] = fgarr[3];
			if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
			m_sty[fgarr] = fgr;
			m_sty[fgr] = fgr;
			}
			//let co = 'rgba('+fgr+')';
			//rule.style.setProperty('border-color',co,'important');
			} else if (colr.substring(0,3) == 'hsl') {
			let c = getHSLarr(colr);
			let fgarr = hslToRGB(c);
			fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
			fgr[3] = fgarr[3];
			if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
			m_sty[fgarr] = fgr;
			m_sty[fgr] = fgr;
			}
			let co = 'rgba('+fgr+')';
			rule.style.setProperty('border-color',co,'important');
			} else if (colr.substring(0,1) == '#') {
			let c = colr.length == 4 ? colr+'f' : colr+'ff';
			let fgarr = hexToRGBA(c);
			fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])]);
			fgr[3] = fgarr[3];
			if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
			m_sty[fgarr] = fgr;
			m_sty[fgr] = fgr;
			}
			let co = 'rgba('+fgr+')';
			rule.style.setProperty('border-color',co,'important');
			}
			}
			}
		}
		if (/(\bbody|\bhtml|\[s__)/i.test(key) && b_bdone != true && cfg.threshold > 0 && cfg.size > 0 && rule.style.fontSize) {
			if (/\[s__/.test(key)) continue;
			var rt, rt1;
			rt1 = rule.style.fontSize;
			if (/var\(/i.test(rt1))
				rt = getVarValue(rt1);
			else
				rt = rt1;
			if (/[\d\.]+.*?px/i.test(rt)) {
			let nfz = parseInt(rt);
			if (nfz <= cfg.threshold && nfz > 1) {
			txtrul = key+' { font-size: '+f2_sizes[nfz]+' !important; }';
			n_rulecount++;
			b_bdone = true;
			if (!cfg.ssrules) m_done[key] = 3;
			}
			}
		}
		if (m_done[key] < 3 && cfg.threshold > 0 && cfg.size > 0 && rule.style.fontSize) {
			m_done[key]++;
			var rt, rt1;
			rt1 = rule.style.fontSize;
			if (/var\(/i.test(rt1))
				rt = getVarValue(rt1);
			else
				rt = rt1;
			if (/[\d\.]+.*?px/i.test(rt)) {
			let nfz = parseInt(rt);
			if (nfz <= cfg.threshold && nfz > 1) {
			txtrul = key+' { '+f_sizes[nfz]+' }';
			n_rulecount++;
			}
			} else if (/[\d\.]+.*?pt/i.test(rt)) {
			let nfz = parseInt(parseFloat(rt)*1.333334);
			if (nfz <= cfg.threshold && nfz > 1) {
			txtrul = key+' { '+f_sizes[nfz]+' }';
			n_rulecount++;
			}
			}/* else if (/[\d\.]+.*?r?em/i.test(rt)) {
			let nfz = parseInt(parseFloat(rt)*body_nfz);
			if (nfz <= cfg.threshold && nfz > 1) {
			txtrul = key+' { '+f_sizes[nfz]+' }';
			n_rulecount++;
			}
			}*/
		}
		if (!txtrul && m_done[key] < 3 && cfg.threshold > 0 && cfg.size > 0 && rule.style.fontSize) {
				m_done[key]++;
				var rt,rt1;
				rt1 = rule.style.fontsize;
				if (/var\(/i.test(rt1))
					rt = getVarValue(rt1);
				else
					rt = rt1;
				if (/\d+.*?px/i.test(rt)) {
				let fsz = parseInt(rt);
				if (fsz > 1 && fsz <= cfg.threshold) {
					txtrul = key + ' { ' + f_sizes[fsz] + ' }';
					}
				}
		}
		if (cfg.forcePlhdr && cfg.forceIInv) {
		if (rule.style.content && !/invert/i.test(rule.style.filter) && /url\(/i.test(rule.style.content))
			rule.style.setProperty('filter','invert(1)','important');
		}
		}
		if (!b_sec && txtrul) {
			style_node.sheet.insertRule(txtrul, 0);
			b_sec = false;
		}

		}
		} catch (error) {
			console.log('cssrules security   !');
			console.log(error);
			b_sec = true;
		}
	}
	if (n_rulecount < 3) { console.log('Rule count cleared'); n_rulecount = 0; }

	if (!cfg.fontFamilyName || !cfg.fontFamily) {
		let rul = 'var(--g_btvfont)';
		if (style_node.sheet != undefined) {
		let rl = style_node.sheet.cssRules;
		let x = 0;
		for (x = 0; x < rl.length; x++ )
			if (rl[x].cssText.indexOf(rul) > -1) break;
		if (x < rl.length)
			style_node.sheet.deleteRule(x);
		}
	} else {
		let fntFmly = `*{font-family:var(--g_btvfont)!important;}`;
		if (cfg.fontFamily) {
			document.documentElement.style.setProperty('--g_btvfont',cfg.fontFamilyName);
			g_fntRule = true;
		} else {
			fntFmly = '';
			document.documentElement.style.setProperty('--g_btvfont','');
			g_fntRule = false;
		}
		style_node.sheet.insertRule(fntFmly, 0);
	}

		if (cfg.forcePlhdr && cfg.forceIInv) {
		let ms = null;
		let cmap = [];
		b_noemo = false;
		if (doc.body != null && doc.body.innerText != null)
			ms = doc.body.innerText.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/mgu);
		if (ms) {
			var totemo = '';
			for (let str of ms) { totemo += str; if(!cmap.includes(str)) cmap.push(str); }
			if (totemo.replaceAll(/[®©✓✔✕✖✗✘]+/mgu, '').length < 3) b_noemo = true;
		} else {
			b_noemo = true;
		}
		}

		var zoom_mode = false, orig_val = [], t_zoom = 0, t_zc = 0, l_z = [], orig_cursor = '';

			window.addEventListener("mousemove", mousemove);
			window.addEventListener("mouseover", mousemove);
			window.addEventListener("mouseenter", mousemove);
			window.addEventListener("mouseleave", mouseout);
			window.addEventListener("mouseout", mouseout);
			window.addEventListener("keyup", keyup);
			window.addEventListener("keydown", keydown);

			function keyup(e) {
				if (e.keyCode == 107 && e.getModifierState("NumLock")) {
					zoom_mode = false;
					t_zc = Date.now();
					document.documentElement.style.cursor = orig_cursor;
				}
			}

			function keydown(e) {
				if (e.keyCode == 107 && e.getModifierState("NumLock")) {
					zoom_mode = true;
					t_zc = Date.now();
					if (!/zoom\-(in|out)/.test(document.documentElement.style.cursor)) {
						orig_cursor = document.documentElement.style.cursor;
						if (parseFloat(document.documentElement.style.getPropertyValue('--g_zoom')) > 1.0)
							document.documentElement.style.cursor = 'zoom-in';
						else
							document.documentElement.style.cursor = 'zoom-out';
					}
				}
			}

			function mousemove(e) {
				if (e.buttons == 0) {
				if (!zoom_mode) return;
				if (zoom_mode && Date.now() - t_zc > 10000) {
					zoom_mode = false;
					document.documentElement.style.cursor = orig_cursor;
					return;
				}
				let targ = getTarget(e);
				if (l_z.includes(targ)) return;
				let val = [];
				if (Date.now()-t_zoom > 260) {
				t_zoom = Date.now();
				val[0] = targ.className;
				val[2] = targ.style.textShadow;
				val[3] = targ.style.position;
				val[4] = targ.style.zIndex;
				val[1] = targ.style.transformOrigin;
				val[10] = targ.style.padding;
				val[5] = ''; val[6] = ''; val[7] = '';
				if (targ.parentNode && targ.parentNode.style) {
					val[5] = targ.parentNode.style.zIndex;
					if (targ.parentNode.getBoundingClientRect().width == targ.getBoundingClientRect().width) {
						targ.parentNode.style.zIndex = '9999999';
						if (targ.parentNode.parentNode && targ.parentNode.parentNode.style) {
							val[6] = targ.parentNode.parentNode.style.zIndex;
							if (targ.parentNode.parentNode.getBoundingClientRect().width == targ.getBoundingClientRect().width) { 
								targ.parentNode.parentNode.style.zIndex = '9999999';
								if (targ.parentNode.parentNode.parentNode && targ.parentNode.parentNode.parentNode.style) {
									val[7] = targ.parentNode.parentNode.parentNode.style.zIndex;
									if (targ.parentNode.parentNode.parentNode.getBoundingClientRect().width == targ.getBoundingClientRect().width) {
										targ.parentNode.parentNode.parentNode.style.zIndex = '9999999';
									}
								}
							}
						}
					}
				}
				orig_val.push(val);
				targ.style.zIndex = '9999999';
				targ.style.position = 'relative';
				targ.style.padding = '0% 16% 6% 16%';
				targ.style.transformOrigin = e.offsetX+'px '+e.offsetY+'px';
				let co = getRGBarr(getComputedStyle(targ).color) || [127,127,127,1.0];
				co = [ parseInt(co[0]), parseInt(co[1]), parseInt(co[2]), parseFloat(co[0]) ];
				co[3] = 0.95;
				targ.style.textShadow = '0 0 4px rgba('+(255-co[0])+','+(255-co[1])+','+(255-co[2])+','+co[3]+')';//, 0 0 7px rgba('+(co[0])+','+(co[1])+','+(co[2])+','+co[3]+')';
				targ.setAttribute('class', targ.className+ ' enlarge ');
				l_z.push(targ);
				}
				}
			}

			function mouseout(e) {
				if (e.buttons == 0)
				if (Date.now() - t_zoom > 260) {
				let val = [];
				if (orig_val && l_z) {
					for (let x = 0; x < l_z.length; x++) {
						let targ = l_z.pop();
						let val = orig_val.pop();
						targ.setAttribute('class', val[0]);
						targ.style.textShadow = val[2];
						targ.style.position = val[3];
						targ.style.padding = val[10];
						targ.style.transformOrigin = val[1];
						targ.style.zIndex = val[4];
						if (targ.parentNode && targ.parentNode.style) {
							targ.parentNode.style.zIndex = val[5];
							if (targ.parentNode.parentNode && targ.parentNode.parentNode.style) {
								targ.parentNode.parentNode.style.zIndex = val[6];
								if (targ.parentNode.parentNode.parentNode && targ.parentNode.parentNode.parentNode.style) {
									targ.parentNode.parentNode.parentNode.style.zIndex = val[7];
								}
							}
						}
					}
				}
				if (zoom_mode && Date.now() - t_zc > 10000) zoom_mode = false;
				document.documentElement.style.cursor = orig_cursor;
				}
			}

			function getTarget(e){
				if (e.target) return e.target;
				else if (e.srcElement) return e.srcElement;
			}

	const process = async (nodes, mutation = false) =>
	{
		b_body = false;
		b_ctext = {};
		b_chimg = {};
		b_iimg = {};
		b_fnt = {};
		b_dim = {};
		b_emo = {};
		b_idone = {};
		images = [];
		img_area = {};
		n_imgcount = 0;

		var nn_style, nn_reg;
		var n_inv = 0;

		if (!cfg.forcePlhdr && cfg.advDimming){
			nn_style = ';filter:revert!important;';
			nn_reg = /revert/;
		} else if (cfg.forcePlhdr && cfg.forceIInv) {
			nn_style = ';filter:invert(1)!important;';
			nn_reg = /invert/;
		} else {
			nn_style = '';
			nn_reg = /\<\&\%/;
		}

		let node_count = 0;
		if (mutation) node_count = parseInt(1000*Date.now());

		if (Object.entries(map).length < 1 || mutation) {
			let nc = node_count;
			var n;
			for (n of nodes) {
			nc++;
			map.set(n, nc);
			let t = n.nodeName.toUpperCase();
			if (tags_to_skip.includes(t)) {
				let chln = n.getElementsByTagName('*');
				for (let ch of chln) {
					if (!tags_to_skip.includes(ch.nodeName.toUpperCase()))
						tags_to_skip.push(ch.nodeName.toUpperCase());
				}
			}
			if (tags_to_skip.includes(t) || (cfg.skipHeadings && hdr_tags.includes(t)))
				if (!/(VIDEO|EMBED|OBJECT|CANVAS|SVG|IMG)/.test(t))
					continue;
			containsText(n, mp, nc, map, b_ctext, nodes);
			let gcs = getComputedStyle(n);
			if (/(VIDEO|EMBED|OBJECT|CANVAS|SVG|IMG|PICTURE)/.test(t) || (gcs.backgroundImage && /(url|http|\/)/i.test(gcs.backgroundImage)) || (gcs.src && /(url|http|\/)/i.test(gcs.src)))
				b_iimg[nc] = await isImage(n, nc, img_area, gcs, b_imgforce);
			else
				b_iimg[nc] = false;
			if (cfg.pseudoAB && cfg.forcePlhdr && cfg.forceIInv) {
			let gcsa = getComputedStyle(n,':before');
			if ((gcsa.backgroundImage && gcsa.backgroundImage != 'none') || (gcsa.content && /(url|http|\/)/i.test(gcsa.content))) {
				var im;
				if (gcsa.backgroundImage && gcsa.backgroundImage != 'none')
					im = gcsa.backgroundImage;
				else
					im = gcsa.content;
				let arr = await getBgImage(n, gcsa, im);
				if (arr[0] && arr[1])
					n.className += ' _btvinvertb_ ';
			}
			gcsa = getComputedStyle(n,':after');
			if ((gcsa.backgroundImage && gcsa.backgroundImage != 'none') || (gcsa.content && /(url|http|\/)/i.test(gcsa.content))) {
				var im;
				if (gcsa.backgroundImage && gcsa.backgroundImage != 'none')
					im = gcsa.backgroundImage;
				else
					im = gcsa.content;
				let arr = await getBgImage(n, gcsa, im);
				if (arr[0] && arr[1])
					n.className += ' _btvinverta_ ';
			}
			}
			if (b_iimg[nc]) {
				images.push(n);
				let img_children = Array.from(n.getElementsByTagName("*"));
				if (img_area[nc] >= 0 && img_area[nc] < 90000000) {
					nodes_behind_img.push(...img_children);
					n_imgcount++;
				}
				if (n.parentNode && b_iimg[map.get(n.parentNode)]) {
					if (map.get(n.parentNode) == undefined)
						map.set(n.parentNode, map.get(nodes[0])+nodes.indexOf(n.parentNode));
					b_chimg[map.get(n.parentNode)] = true;
				}
			}
			if (cfg.forcePlhdr && cfg.normalInc && mutation) {
				let ps = parentStyle(n,/invert/,nodes_behind_inv);
				if (ps) nodes_behind_inv.push(Array.from(n.getElementsByTagName('*')));
			}
			}
		}

		let save_nc = node_count;
		let node = doc.body;
		let footr = null;
		if (cfg.forcePlhdr && b_idone[node_count] != true) {
		if (g_foot_re) {
		var pn,n,ftr_done = false,bcol = '';
		let t = document.body.getElementsByTagName('footer');
		if (t.length > 0) {
			let tc = 111111;
			let tn = n;
			for (n of t) {
				let c = topNode(n);
				if (c < tc) {
					tc = c;
					tn = n;
				}
			}
			if (tn.nodeName != 'BODY') {
				bcol = tn.style.backgroundColor;
				tn.style.setProperty('filter','invert(1)', 'important');
				footr = tn;
				ftr_done = true;
			}
		}
		if (!ftr_done) {
		t = [];
		for (n of nodes) {
		if (/footer/i.test(n.id)) t.push(n);
		}
		if (t.length > 0) {
			let tc = 111111;
			let tn = n;
			for (n of t) {
				let c = topNode(n);
				if (c < tc) {
					tc = c;
					tn = n;
				}
			}
			if (tn.nodeName != 'BODY') {
				bcol = tn.style.backgroundColor;
				tn.style.setProperty('filter','invert(1)', 'important');
				footr = tn;
				ftr_done = true;
			}
		}
		}
		if (!ftr_done) {
		t = [];
		for (n of nodes) {
		if (/footer/i.test(n.className)) t.push(n);
		}
		if (t.length > 0) {
			let tc = 111111;
			let tn = n;
			for (n of t) {
				let c = topNode(n);
				if (c < tc) {
					tc = c;
					tn = n;
				}
			}
			if (tn.nodeName != 'BODY') {
				bcol = tn.style.backgroundColor;
				tn.style.setProperty('filter','invert(1)', 'important');
				footr = tn;
				ftr_done = true;
			}
		}
		}
		if (!ftr_done) {
		t = [];
		for (n of nodes) {
		if (/foot/i.test(n.id) && n.getBoundingClientRect().top > parseInt(window.innerHeight)*2/3) t.push(n);
		}
		if (t.length > 0) {
			let tc = 111111;
			let tn = n;
			for (n of t) {
				let c = topNode(n);
				if (c < tc) {
					tc = c;
					tn = n;
				}
			}
			if (tn.nodeName != 'BODY') {
				bcol = tn.style.backgroundColor;
				tn.style.setProperty('filter','invert(1)', 'important');
				footr = tn;
				ftr_done = true;
			}
		}
		}
		if (!ftr_done) {
		t = [];
		for (n of nodes) {
		if (/foot/i.test(n.className) && n.getBoundingClientRect().top > parseInt(window.innerHeight)*2/3) t.push(n);
		}
		if (t.length > 0) {
			let tc = 111111;
			let tn = n;
			for (n of t) {
				let c = topNode(n);
				if (c < tc) {
					tc = c;
					tn = n;
				}
			}
			if (tn.nodeName != 'BODY') {
				bcol = tn.style.backgroundColor;
				tn.style.setProperty('filter','invert(1)', 'important');
				footr = tn;
				ftr_done = true;
			}
		}
		}
		if (footr) {
			let bc = getComputedStyle(footr).backgroundColor;
			if (bcol && bc == bcol) {
				bcol = getRGBarr(bcol);
				bcol[0] = 255-bcol[0];
				bcol[1] = 255-bcol[1];
				bcol[2] = 255-bcol[2];
				if (bcol[3] == undefined) bcol[3] = 1;
				footr.style.setProperty('background-color','rgba('+bcol+')','important');
			} else if (bc == 'rgba(0, 0, 0, 0)') {
				footr.style.setProperty('background-color','white','important');
				//let chn = footr.getElementsByTagName('*');
				//for (let n of chn) 
				//	if (n.nodeName != 'A')
				//	n.style.setProperty('color','black','important');
			}
			footr.style.setProperty('height', 'auto','important');
		}
		}
		if (node == undefined || node == null)
			node = document.getElementsByTagName('BODY')[0];

		if (!(node == undefined || node == null)) {
		let pnode = doc.getElementsByTagName('HTML')[0];

		node_count = map.get(node);
		let tag = node.nodeName.toUpperCase();

			b_idone[node_count] = true;
			var htm;
			htm = pnode;
			if (!/invert/.test(htm.style.getPropertyValue('filter')))
				htm.style.setProperty('filter','invert(1)','important');
			if (cfg.forceIInv) {
			var hdrs;
			if (!b_html)
				hdrs = Array.from(document.body.getElementsByTagName('HEADER'));
			else
				hdrs = Array.from(htm.getElementsByTagName('HEADER'));
			var hdr;
			let b_hdr = hdrs.length > 0 && parseInt(hdrs[0].getBoundingClientRect().top) < parseInt(window.innerHeight)/2;
			let n_hdrs = hdrs.length;
			if (b_hdr && n_hdrs < 5) {
				hdr = hdrs[0];
				if (hdr == undefined || hdr == null) hdr = hdrs[1];
			} else {
				if (!b_html)
					hdrs = Array.from(document.body.getElementsByTagName('*'));
				else
					hdrs = Array.from(htm.getElementsByTagName('*'));
				b_hdr = false;
				for (hdr of hdrs) {
				if (hdr.className != undefined && hdr.className && /header/i.test(hdr.className)) {
					b_hdr = true; break;
				} else if (hdr.id != undefined && hdr.id && /header/i.test(hdr.id)) {
					b_hdr = true; break;
				}
				}
			}
			if (!b_hdr) hdr = null;
			var n_c;
			for (let img of images) {
//				if (/INPUT/i.test(img.nodeName) && (img.type == null || !/image/i.test(img.type))) continue;
			n_c = map.get(img);
			let p_s = parentStyle(img,/invert/,nodes_behind_inv);
			let cst = getComputedStyle(img);
			let sects = Array.from(img.getElementsByTagName('SECTION'));
			let arts =  Array.from(img.getElementsByTagName('ARTICLE'));
			if (sects.length > 2 || arts.length > 2 || img == footr) continue;
			if (nodes_behind_inv.includes(img)) {
				img.style.setProperty('filter','unset', 'important');
				continue;
			}
			if (cst.filter != 'unset' && /^(INPUT|TEXT|TEXTAREA)/i.test(img.nodeName) && g_okinput.test(img.type)) {
				img.style.setProperty('filter','unset', 'important');
				continue;
			}
			let isty = img.style.getPropertyValue('filter');
			var pisty = '';
			if (img.parentNode) pisty = img.parentNode.style.getPropertyValue('filter');
			let bgim = cst.backgroundImage;
			if (!bgim || /none/i.test(bgim))
				bgim = '';
			let imsrc = img.src ? img.src : '';
			if (!imsrc || imsrc == 'none')
				imsrc = '';
			if (!b_imgforce[n_c] || b_ctext[n_c] > 95)
			if (!/(IMG|SVG|VIDEO|OBJECT|EMBED|CANVAS)/i.test(img.nodeName) && !/(slide|banner|background.*page|page.*background)/ig.test(img.className) && ((imsrc != undefined && imsrc && !/(\/|http|url)/ig.test(imsrc)) || (bgim != undefined && bgim != '' && bgim != 'none' && !/(\/|http|url)/ig.test(bgim)) || (b_ctext[n_c] > 95 && !b_imgforce[n_c])) || (((img_area[n_c] > 0 && img_area[n_c] < 399 && img.textContent.indexOf(' ') > 0 && !/button/i.test(img.className)) || /nav/i.test(img.className)) && !b_imgforce[n_c] && img_area[n_c] < 399 && img_area[n_c] > 0)) {
				if (!(hdr && hdr.contains(img))) {
				img.style.setProperty('filter','unset', 'important');
				continue;
				}
			} else if (b_ctext[n_c] > 95 && (img_area[n_c] <= 50000 || !b_imgforce[n_c])) {
				img.style.setProperty('filter','unset', 'important');
				continue;
			}
			let bnav = false;
			if (pisty == undefined || pisty == null) pisty = '';
			if (isty == undefined || isty == null) isty = '';
			let pch = img;
			if (hdr != null && hdr.contains(img) && cfg.skipNavSection) {
				bnav = true;
			} else if (cfg.skipNavSection) {
			while (pch != null && pch != undefined && pch.nodeName != 'BODY') {
				if (pch && /(NAV|HEADER)/i.test(pch.nodeName) && cfg.skipNavSection) {
					if (pch.nodeName == 'NAV' || (pch.nodeName == 'HEADER' && n_hdrs < 5)) {
					bnav = true;
					break;
					}
				}
				pch = pch.parentNode;
			}
			}
			if (bnav) {
				img.style.setProperty('filter','unset','important');
				continue;
			}
			if (!nn_reg.test(isty) && !nn_reg.test(pisty) && !p_s && (!containsImage(img, images) || b_imgforce[n_c] || ((!b_chimg[n_c] && hdr != null && hdr.contains(img)) || /image/i.test(img.type) || bgim || imsrc || b_chimg[n_c])))
				if (!(/^(UL|OL)/i.test(img.nodeName) && img.childNodes.length < 4)) {
					img.style.setProperty('filter','invert(1)','important');
					let chldn = Array.from(img.getElementsByTagName('*'));
					nodes_behind_inv.push(...chldn);
					n_inv++;
				}
			}
			hdrs,length = 0;
/**			for (let i of images) {
				let ps = parentStyle(i,/invert/,nodes_behind_inv);
				if (ps) {
					let chdn = Array.from(i.getElementsByTagName('*'));
					if (!nodes_behind_inv.includes(chdn[0]) && nodes_behind_inv.includes(chdn[1]))
						nodes_behind_inv.push(chdn);
				}
			}*/
			}
			b_html = true;
		}

		}
		b_idone = {};

		if (cfg.advDimming)
			if (!cfg.ssrules && n_imgcount > 2) {
			for (let img of images) {
				let pn = img;
				let lastn = pn;
				while (pn && !/^(BODY|HTML)/i.test(pn.nodeName)) {
					lastn = pn;
					let nsty = lastn.getAttribute('style');
					if (!b_iimg[map.get(lastn)] && nsty != null && !nn_reg.test(nsty) && ((nsty+nn_style).length > 0))
						//lastn.setAttribute('style',nsty+nn_style);
						lastn.style.setProperty('filter','revert','important');
					else if (!b_iimg[map.get(lastn)] && nsty == null && nn_style)
						lastn.style.setProperty('filter','revert','important');
						//lastn.setAttribute('style',nn_style);
					let cn = map.get(lastn);
					b_dim[cn] = true;
					pn = lastn.parentNode;
				}
				node = lastn;
				node_count = map.get(node);
				if (b_dim[node_count]) continue;
				b_dim[node_count] = true;
			}
		}
		b_dim = {};
		node_count = save_nc;
		node = nodes[node_count];

		let setAttribs = node => {

			let tag = String(node.nodeName.toUpperCase());
			let pnode = node.parentNode;
			let sk = false;
			let is_einput = /^(INPUT|SELECT|TEXT|TEXTAREA)/.test(tag);
			var style, is_oinput, is_xinput;

			if (tags_to_skip.includes(tag) || (cfg.skipHeadings && hdr_tags.includes(tag))) return;

			if (/I?FRAME\b/i.test(tag)) {
				let fsty = node.style.getPropertyValue('filter');
				if (fsty == null) fsty = '';
				if (!/invert/.test(fsty) && cfg.forcePlhdr)  {
					node.style.setProperty('filter','invert(1)','important');
				}
				node.onload = function()  {
					let iframe = node;
					const innerDoc = iframe.contentDocument;
					if (innerDoc != null) {
						setTimeout(() => process(Array.from(innerDoc.getElementsByTagName('*')), true), 55);
					} else {
						console.log('Frame security');
					}
				}
			}

			if (cfg.forceOpacity && !cfg.start3 && cfg.skipLinks && !b_body && cfg.forcePlhdr && pnode != null && pnode.nodeName == 'BODY') {
				let fsty = getComputedStyle(pnode).getPropertyValue('background-color');
				if (fsty == null || fsty == '' || fsty == 'none') fsty = 'rgb(0,0,0)';
				let bcol = getRGBarr(fsty);
				bcol[0] = 255 - bcol[0];
				bcol[1] = 255 - bcol[1];
				bcol[2] = 255 - bcol[2];
				fsty = 'rgb('+bcol+')';
				b_body = true;
				pnode.style.setProperty('background-color',fsty);
			}

			if (n_rulecount > 0) {
			style = getComputedStyle(node);
			if (style.fontSize && !f2_sizes.includes(style.fontSize))
				sk = false;
			else if (style.fontSize && f2_sizes.includes(style.fontSize))
				sk = true;
			}

			if (style == undefined)
				style = getComputedStyle(node);

			node_count = map.get(node);

			if (is_einput) {
				is_xinput = node.type && g_nokinput.test(node.type);
				is_oinput = node.type && g_okinput.test(node.type);
			}

			if (is_einput && is_oinput)
			if (cfg.input_border && !node.getAttribute('b__'))
				if (!(!cfg.start3 && cfg.skipLinks))
					node.setAttribute('b__', '');

			let g_n_inv = nodes_behind_inv.includes(node);
			if (g_foot_re)
				g_n_inv = g_n_inv || (g_foot_re && footr && footr.contains(node));

			let ftr = g_foot_re && footr && footr.contains(node);
			if (cfg.normalInc && cfg.forcePlhdr && (!b_iimg[node_count] || style.filter.indexOf('invert') < 0) && !g_n_inv && m_fcol.get(node) == undefined && m_bcol.get(node) == undefined && m_bocol.get(node) == undefined) {
				var cs,pcs;
				let err = false;
				try {
				cs = style;
				pcs = getComputedStyle(pnode);
				} catch (error) {
					err = true;
				}
				if (!err) {
				let fg = !colors_to_skip.includes(cs.color) ? cs.color : '';
				let fg2 = !colors_to_skip.includes(pcs.color) ? pcs.color : '';
				let bg = !colors_to_skip.includes(cs.backgroundColor) ? cs.backgroundColor : '';
				let bg2 = !colors_to_skip.includes(pcs.backgroundColor) ? pcs.backgroundColor : '';
				let bog = !colors_to_skip.includes(cs.borderTopColor) ? cs.borderTopColor : ''  || !colors_to_skip.includes(cs.borderRightColor) ? cs.borderRightColor : '' || !colors_to_skip.includes(cs.borderBottomColor) ? cs.borderBottomColor : '' || !colors_to_skip.includes(cs.borderLeftColor) ? cs.borderLeftColor : '';
				let bog2 = !colors_to_skip.includes(pcs.borderTopColor) ? pcs.borderTopColor : ''  || !colors_to_skip.includes(pcs.borderRightColor) ? pcs.borderRightColor : '' || !colors_to_skip.includes(pcs.borderBottomColor) ? pcs.borderBottomColor : '' || !colors_to_skip.includes(pcs.borderLeftColor) ? pcs.borderLeftColor : '';
				var fgbrt, bgbrt;
				if (fg == fg2 && bg == bg2 && bog == bog2) {
				} else if (!ftr) {
				if (fg) {
					let fgarr = getRGBarr(fg);
					if (m_sty[fgarr] != undefined || (b_idone[fgarr] != undefined && cfg.normalInc2)) {
						var fgr;
						if (cfg.normalInc2 && b_idone[fgarr] != undefined)
							fgr = b_idone[fgarr];
						else
							fgr = m_sty[fgarr];
						if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2] || fgr[3] != fgarr[3]) {
						fgr[3] = fgarr[3];
						node.style.setProperty('color','rgba('+fgr+')','important');
						m_fcol.set(node, [fgarr[0],fgarr[1],fgarr[2],fgarr[3]]);
						}
					} else {
					let fgr = applyColorMatrix([255-fgarr[0], 255-fgarr[1], 255-fgarr[2]]);
					fgr[3] = fgarr[3];
					if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
					fgbrt = calcBrightness([fgr[0],fgr[1],fgr[2],fgarr[3]]);
					if (fgbrt >= 0) {
						m_fcol.set(node, [fgarr[0],fgarr[1],fgarr[2],fgarr[3]]);
						node.style.setProperty('color','rgba('+fgr+')','important');
						m_sty[fgarr] = fgr;
						m_sty[fgr] = fgr;
					}
					}
					}
				}
				if (bog) {
					let fgarr = getRGBarr(bog);
					var fgr;
					if (m_sty[fgarr] != undefined || (b_idone[fgarr] != undefined && cfg.normalInc2)) {
						var fgr;
						if (cfg.normalInc2 && b_idone[fgarr] != undefined)
							fgr = b_idone[fgarr];
						else
							fgr = m_sty[fgarr];
						if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2] || fgr[3] != fgarr[3]) {
						fgr[3] = fgarr[3];
						m_bocol.set(node, [fgarr[0],fgarr[1],fgarr[2],fgarr[3]]);
						}
					} else {
						fgr = applyColorMatrix([255-fgarr[0], 255-fgarr[1], 255-fgarr[2]]);
						fgr[3] = fgarr[3];
						if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
						m_bocol.set(node, [fgarr[0],fgarr[1],fgarr[2],fgarr[3]]);
						m_sty[fgarr] = fgr;
						m_sty[fgr] = fgr;
						}
					}
					if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2] || fgr[3] != fgarr[3]) {
					bgbrt = calcBrightness([fgr[0],fgr[1],fgr[2],fgarr[3]]);
					if (bgbrt > 0 && (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2] || fgr[3] != fgarr[3])) {
						m_bocol.set(node, [fgarr[0],fgarr[1],fgarr[2],fgarr[3]]);
						if (bog == cs.borderColor)
							node.style.setProperty('border-color','rgba('+fgr+')','important');
						else if (bog == cs.borderTopColor)
							node.style.setProperty('border-top-color','rgba('+fgr+')','important');
						else if (bog == cs.borderBottomColor)
							node.style.setProperty('border-bottom-color','rgba('+fgr+')','important');
						else if (bog == cs.borderLeftColor)
							node.style.setProperty('border-left-color','rgba('+fgr+')','important');
						else if (bog == cs.borderRightColor)
							node.style.setProperty('border-right-color','rgba('+fgr+')','important');
					}
					}
				}
				if (bg) {
					let fgarr = getRGBarr(bg);
					if (m_sty[fgarr] != undefined || (b_idone[fgarr] != undefined && cfg.normalInc2)) {
						var fgr;
						if (cfg.normalInc2 && b_idone[fgarr] != undefined)
							fgr = b_idone[fgarr];
						else
							fgr = m_sty[fgarr];
						if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2] || fgr[3] != fgarr[3]) {
						fgr[3] = fgarr[3];
						node.style.setProperty('background-color','rgba('+fgr+')','important');
						m_bcol.set(node, [fgarr[0],fgarr[1],fgarr[2],fgarr[3]]);
						}
					} else {
					let fgr = applyColorMatrix([255-fgarr[0], 255-fgarr[1], 255-fgarr[2]]);
					fgr[3] = fgarr[3];
					if (fgr[0] != fgarr[0] || fgr[1] != fgarr[1] || fgr[2] != fgarr[2]) {
					bgbrt = calcBrightness([fgr[0],fgr[1],fgr[2],fgarr[3]]);
					if (bgbrt > 0) {
						m_bcol.set(node, [fgarr[0],fgarr[1],fgarr[2],fgarr[3]]);
						node.style.setProperty('background-color','rgba('+fgr+')','important');
						m_sty[fgarr] = fgr;
					}
					}
					}
				}
				}
				}
			}

			if (!cfg.skipNavSection) {
				if (tag == 'SECTION') {
					let snw = style.getPropertyValue('width');
					if (/\d+.*?px/.test(snw)) {
						let nw = parseInt(snw);
						if (!isNaN(nw) && nw/window.innerWidth < 0.8 && nw/window.innerWidth > 0.3) {
							let nwidth = ';width: calc( ' + snw + ' + ' + cfg.size + '% );';
							if (style.display.length == 0) nwidth += 'display:table;';
							let nsty = node.getAttribute('style');
							if (nsty == null) nsty = '';
							if ((nsty+nwidth).length > 0)
								node.setAttribute('style', nsty + nwidth);
						}
					}
				} else if (tag == 'NAV') {
					var nwidth = '';
					var nheight = '';
					let sw = style.getPropertyValue('width');
					if (/\d+.*?px/.test(sw)) {
						let nw = parseInt(sw);
						nwidth = ';width: calc( ' + sw + ' + ' + cfg.size + '% );';
						if (pnode != null && node.firstElementChild != null) {
							if (node.firstElementChild.getBoundingClientRect().left - pnode.getBoundingClientRect().left > 180)
								nwidth = nwidth + 'margin-left:-'+cfg.size/2+'%;';
						}
						if (isNaN(nw) || nw/parseInt(window.innerWidth) < 0.6)
							nwidth = '';
					}
					let sh = style.getPropertyValue('height');
					let sfz = parseInt(style.getPropertyValue('font-size'));
					if (sh && sfz*2.75 < parseInt(sh))
						nheight = '';
					else if (sfz < cfg.threshold)
						nheight = ';height:' + h_sizes[sfz] + ';';
					let nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					if ((nsty+nheight+nwidth).length > 0)
						node.setAttribute('style', nsty + nheight + nwidth);
				}
			}

			if (cfg.start3)
			if (!node.hasAttribute(focalAnchors.attrNameContainer) && b_ctext[node_count] > 1) {
				if (doc_obs != undefined && doc_obs != null)
					doc_obs.disconnect();
				focalAnchors.toggleAnchorsByRef(node, false, cfg.skipLinks, cfg.weight);
				if (doc_obs != undefined && doc_obs != null)
					doc_obs.observe(document.body, { childList: true, subtree: true });
			}

			if (!sk || is_oinput) {
			if (b_fnt[node_count] == false && cfg.threshold > 0 && (!b_iimg[node_count] || b_ctext[node_count] > 0)) {
				b_fnt[node_count] = true;
				let nsty = node.getAttribute('style');
				if (nsty == null) nsty = '';
				let sfz = style.fontSize;
				let nfz = parseInt(sfz);
				if (parseFloat(sfz) <= cfg.threshold) {
					if (/font-size[^;]*important/i.test(nsty)) {
						let rsty = nsty.replace(/font-size[^\;]*important/ig,'');
						node.setAttribute('style',rsty);
						nsty = node.getAttribute('style');
						if (nsty == null) nsty = '';
					}
					if (/line-height[^;]*important/i.test(nsty)) {
						let rsty = nsty.replace(/line-height[^\;]*important/ig,'');
						node.setAttribute('style',rsty);
						nsty = node.getAttribute('style');
						if (nsty == null) nsty = '';
					}
					node.setAttribute('s__', nfz);
					if (style.fontSize == sfz) {
						node.style.setProperty('font-size',f2_sizes[nfz],'important');
					if (!cfg.skipHeights)
						node.style.setProperty('line-height', h_sizes[nfz],"important");
					if (cfg.advDimming) {
						if (!nn_reg.test(nsty) || cfg.ssrules)
							node.style.setProperty('filter',str_style,'important');
					}
					if (cfg.forceOpacity)
						node.style.setProperty('opacity',str_style2,'important');
					} else if (nn_reg.test(nsty) && cfg.advDimming && cfg.ssrules) {
						nsty += 'filter:'+str_style+'!important;';
						node.setAttribute('style',nsty);
						nsty = node.getAttribute('style');
						if (nsty == null) nsty = '';
					}
				}
				if (b_ctext[node_count] > 0 && parseInt(style.lineHeight) <= nfz) {
					let rsty = nsty;
					rsty += ';line-height:'+h_sizes[2]+'!important;';
					node.setAttribute('style',rsty);
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
				}
			} else if (b_fnt[node_count] != true && cfg.threshold > 0 && (!b_iimg[node_count] || b_ctext[node_count] > 0)) {
				b_fnt[node_count] = true;
				let sfz = style.fontSize;
				let nfz = parseInt(sfz);
				if (parseFloat(sfz) <= cfg.threshold) {
					node.setAttribute('s__', nfz);
					if (style.fontSize == sfz) {
						node.style.setProperty('font-size',f2_sizes[nfz],'important');
					if (!cfg.skipHeights)
						node.style.setProperty('line-height', h_sizes[nfz],"important");
					if (cfg.advDimming) {
						if (!/revert/.test(node.style.filter) || cfg.ssrules)
							node.style.setProperty('filter',str_style,'important');
					}
					if (cfg.forceOpacity)
						node.style.setProperty('opacity',str_style2,'important');
					} else if (cfg.advDimming) {
						let nsty = node.getAttribute('style');
						if (nsty == null) nsty = '';
						if (/revert/.test(nsty) && cfg.ssrules) {
							nsty += 'filter:'+str_style+'!important;';
							node.setAttribute('style',nsty);
						//	node.style.setProperty('filter',m_str_style);
						}
					}
				}
			}
			}
			if (cfg.threshold > 0 && (!b_iimg[node_count] || b_ctext[node_count] > 0 || (is_einput && is_oinput))) {
				let nsty = node.getAttribute('style');
				if (nsty == null) nsty = '';
				if (cfg.normalInc2)
				if (style.color || style.backgroundColor || style.borderColor) {
					var pcol, ocol, cola;
					if (style.color && !colors_to_skip.includes(style.color)) {
					let col = getRGBarr(style.color);
					col = [parseInt(col[0]), parseInt(col[1]), parseInt(col[2]), parseInt(col[3])];
					let cful = calcColorfulness(col);
					ocol = col;
					pcol = '';
					if (b_idone[ocol] == undefined && col && cful > 34) {
						pcol = colorblindFg(col, cfg, g_n_inv, /invert/.test(style.filter), n_inv);
						cola = getRGBarr(pcol);
					} else if (b_idone[ocol] != undefined && col && cful > 34) {
						cola = b_idone[ocol];
						pcol = 'rgba('+cola+')';
					}
					if (/^rgba/.test(pcol)) {
						b_idone[ocol] = cola;
						b_idone[cola] = cola;
						node.style.setProperty('color', pcol,'important');
					}
					}
					if (style.backgroundColor && !colors_to_skip.includes(style.backgroundColor)) {
					let col = getRGBarr(style.backgroundColor);
					col = [parseInt(col[0]), parseInt(col[1]), parseInt(col[2]), parseInt(col[3])];
					let cful = calcColorfulness(col);
					ocol = col;
					pcol = '';
					if (b_idone[ocol] == undefined && col && cful > 34) {
						pcol = colorblindBg(col, cfg, g_n_inv, /invert/.test(style.filter), n_inv);
						cola = getRGBarr(pcol);
					} else if (b_idone[ocol] != undefined && col && cful > 34) {
						cola = b_idone[ocol];
						pcol = 'rgba('+cola+')';
					}
					if (/^rgba/.test(pcol) && pcol != style.color) {
						b_idone[ocol] = cola;
						b_idone[cola] = cola;
						node.style.setProperty('background-color', pcol,'important');
					}
					}
					if (style.borderColor && !colors_to_skip.includes(style.borderColor)) {
					let bog = style.borderTopColor || style.borderRightColor || style.borderBottomColor || style.borderLeftColor;
					let col = getRGBarr(bog);
					col = [parseInt(col[0]), parseInt(col[1]), parseInt(col[2]), parseInt(col[3])];
					let cful = calcColorfulness(col);
					ocol = col;
					pcol = '';
					if (b_idone[ocol] == undefined && col && cful > 34) {
						pcol = colorblindFg(col, cfg, g_n_inv, /invert/.test(style.filter), n_inv);
						cola = getRGBarr(pcol);
					} else if (b_idone[ocol] != undefined && col && cful > 34) {
						cola = b_idone[ocol];
						pcol = 'rgba('+cola+')';
					}
					if (/^rgba/.test(pcol)) { 
						b_idone[ocol] = cola;
						b_idone[cola] = cola;
						if (bog == style.borderColor)
							node.style.setProperty('border-color',pcol,'important');
						else if (bog == style.borderTopColor)
							node.style.setProperty('border-top-color',pcol,'important');
						else if (bog == style.borderBottomColor)
							node.style.setProperty('border-bottom-color',pcol,'important');
						else if (bog == style.borderLeftColor)
							node.style.setProperty('border-left-color',pcol,'important');
						else if (bog == style.borderRightColor)
							node.style.setProperty('border-right-color',pcol,'important');
					}
					}
				}
				if (!cfg.skipHeights && !node.hasAttribute('s__') && (b_ctext[node_count] > 2 || (node.type && is_oinput)) && (node.getElementsByTagName('*').length < 4 || (cfg.start3 && node.hasAttribute(focalAnchors.attrNameContainer) && node.getElementsByTagName('*').length < 50)))
					node.setAttribute('h__', parseInt(cfg.threshold/2.5 + 1));
				if (cfg.makeCaps) {
					if (g_eng)
						node.style.setProperty('font-variant-caps', 'small-caps');
					else
						node.style.setProperty('text-transform', 'uppercase');
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
				}

				if (cfg.forcePlhdr && cfg.forceIInv && !b_noemo) {
				if (b_emo[node_count] != true && node.children.length < 10) {
					if (/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/umg.test(node.textContent)) {
					if (doc_obs != undefined && doc_obs != null)
					doc_obs.disconnect();
					let chldn = Array.from(node.children);
					for (let ch of chldn) { b_emo[map.get(ch)] = true; }
					//let srt = node.innerHTML.replaceAll(/([\p{Emoji_Presentation}\p{Extended_Pictographic}]+)/umg, '<span style="filter:invert(1);">$1</span>');
					//invertEmojis(node);
					focalAnchors.toggleAnchorsByRef(node, true);
					//node.innerHTML = srt;
					b_emo[node_count] = true;
					if (doc_obs != undefined && doc_obs != null)
						doc_obs.observe(document.body, { childList: true, subtree: true });
					}
				}
				}
				if (is_einput && b_dim[node_count] != true) {
					b_dim[node_count] = true;
					if (!is_xinput) {
					if (!(cfg.input_border && !cfg.start3 && cfg.skipLinks))
					if (node.value && style.getPropertyValue('width')) {
					var nwidth = style.getPropertyValue('width');
					if (tag == 'INPUT' && node.type == 'text' && node.value.length < 50 && parseInt(nwidth) < 100)
						nwidth = ';width: calc( ' + nwidth + ' + ' + (node.value.length/3).toFixed(1) + 'em )!important;';
					else
						nwidth = ';width: calc( ' + nwidth + ' + ' + (cfg.size/2).toFixed(1) + '% )!important;';
					if (style.height && parseInt(style.height) <= parseInt(cfg.threshold)*2.25)
						nwidth += ';height:'+cfg.threshold*2.25+'px!important;';
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					nsty += nwidth;
					if (nsty && !cfg.skipHeights)
						node.setAttribute('style', nsty);
					}
					if (!node.disabled && cfg.strength % 2 == 1 && (is_einput || is_oinput)) {
					let txtcolor = style.color;
					if (txtcolor == null || txtcolor.length < 1) txtcolor = 'rgb(0,0,0)';
					let txt_brt = calcBrightness(getRGBarr(txtcolor));
					if (txt_brt > 176)
						txtcolor = '#fff';
					else
						txtcolor = '#000';
					if (txtcolor != style.color) {
						node.style.setProperty('color',txtcolor,'important');
						b_cdone[node_count] = true;
						if (cfg.forcePlhdr && cfg.forceIInv)
							node.style.setProperty('filter','unset','important');
					}
					}
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					if (cfg.advDimming)
						node.style.setProperty('filter','revert','important');
					}
				}
			}
/**
			if (cfg.makeCaps)
			if (node.nextSibling != null && !(node.nextSibling instanceof Element) && /\#text/i.test(node.nextSibling.nodeName) && /\bBODY/i.test(pnode.nodeName)) {
				let nxtTxt = node.nextSibling.wholeText;
				let upperTxt = nxtTxt.toUpperCase();
				node.nextSibling.textContent = upperTxt;
			}
*/
			let is_link  = tag === 'A';

			if (cfg.underlineLinks && is_link) {
				node.setAttribute('u__', '');
				node.style.setProperty('text-decoration','underline');
			}

			if (str300 || ftr) return;

			if (b_ctext[node_count] < 1)
			if (!(node.children.length == 1))
				return;

			let color = style.getPropertyValue('color');

			if (colors_to_skip.includes(color))
				return;

			let rgba_arr = getRGBarr(color);

			if (!rgba_arr)
				return;

			let oc = color;

			if (cfg.forceOpacity && rgba_arr[3] > 0 && rgba_arr[3] < 1) {
				rgba_arr[3] = 1;
				color = 'rgba('+rgba_arr+')';
				node.style.setProperty('color',color,'important');
			}

			/*let img_offset = 0;

			if (b_iimg[node_count] || nodes_behind_img.includes(node))
				img_offset += 60;
			if (is_link || pnode.nodeName == 'A')
				img_offset += 60;*/

			let bg_transp       = false;

			let bg_color        = getBgColor(pnode, style.backgroundColor);
			let bg_color_arr    = getRGBarr(bg_color);
			
			let fg_brt          = calcBrightness(rgba_arr);

			let bg_brt          = calcBrightness(bg_color_arr);

			let bg_threshold    = g_bg_threshold - cfg.strength; // + img_offset;

			let contrast        = color == bg_color ? fg_brt :  Math.abs(bg_brt - fg_brt);

			if (cfg.ssrules)
				if (cfg.strength == 0)
					bg_threshold = g_bg_threshold_new_default;
				else
					bg_threshold = g_bg_threshold_new - cfg.strength;

			if (cfg.skipColoreds) {
				let fg_colorfulness   = calcColorfulness(rgba_arr);
				let min_contrast      = cfg.strength / 3;
				let min_link_contrast = min_contrast;
				let min_colorfulness  = g_min_colorfulness;

				if (is_link)
					min_contrast = min_link_contrast;

				if ((contrast > min_contrast || cfg.strength > 200) && fg_colorfulness > min_colorfulness)
					return;
			}

			let fg_bg_val = [ rgba_arr, bg_color_arr ];

			if (b_chk[fg_bg_val] != undefined) {
				let co = b_chk[fg_bg_val];
				co[3] = co[3] == undefined ? 1 : co[3];
				node.style.setProperty('color','rgba('+co+')','important');
				return;
			}

			if (bg_color == 'rgba(0, 0, 0, 0)') {
				bg_threshold = -1;
				bg_transp = true;
			}

			if (b_cdone[node_count] != true)
			if (!cfg.ssrules) {
			if (bg_brt > bg_threshold)
			if (!cfg.forcePlhdr) {
				let bstl = '';
				if (cfg.strength > 200 && fg_brt >= 95 && bg_brt <= 176 && 255-bg_brt > g_bg_contrast_old) {
					bstl = 'white';
				} else if (bg_brt >= 0 && bg_brt <= 176 && fg_brt > 176 && 255-bg_brt > g_bg_contrast_old) {
					bstl = 'white';
				} else if (bg_brt > 176 && bg_brt <= 255 && fg_brt <= 176) {
					bstl = 'black';
				} else if (bg_brt == 256 && fg_brt > 176) {
					bstl = 'white';
				} else if (bg_brt == 256) {
					bstl = 'black';
				}
				if (bstl) {
				node.style.setProperty('color',bstl,'important'); }
			} else if (cfg.forcePlhdr) {
				let bstl = '';
				if (cfg.strength > 200 && fg_brt >= 95 && bg_brt <= 176 && 255-bg_brt > g_bg_contrast_old) {
					bstl = 'white';
				} else if (bg_brt >= 0 && bg_brt <= 176 && fg_brt > 176 && 255-bg_brt > g_bg_contrast_old) {
					bstl = 'white';
				} else if (bg_brt > 176 && bg_brt <= 255 && fg_brt <= 176) {
					bstl = 'black';
				} else if (bg_brt == 256 && fg_brt > 176 && !g_n_inv) {
					bstl = 'white';
				} else if (bg_brt == 256 && fg_brt <= 176 && !g_n_inv) {
					bstl = 'black';
				}
				if (bstl) {
				node.style.setProperty('color',bstl,'important'); }
			} else {
				let bstl = '';
				if (cfg.strength > 200 && fg_brt >= 95 && bg_brt <= 176 && 255-bg_brt > g_bg_contrast_old) {
					bstl = 'white';
				} else if (fg_brt > 176 && 255-bg_brt > g_bg_contrast_old) {
					bstl = 'white';
				} else if (bg_brt == 256 && fg_brt > 176) {
					bstl = 'white';
				} else if (bg_brt == 256) {
					bstl = 'black';
				}
				if (bstl) {
				node.style.setProperty('color',bstl,'important'); }
			}
			} else if (cfg.ssrules) {
			if (bg_brt == 256) bg_brt = 0;
			let str = cfg.strength == 0 ? 230 : cfg.strength;
			let bstl = '';
			if (bg_brt > bg_threshold)
			if (!cfg.forcePlhdr) {
				if (fg_brt/255 < str/300.0)
					bstl = '#000';
				else if (bg_brt < g_bg_contrast)
					bstl = '#fff';
				if (255-bg_brt > contrast && fg_brt > g_fg_brightness_min && !bg_transp)
					if (bstl == '#000')
						bstl = '#fff';
				node.style.setProperty('color',bstl,'important');
			} else if (cfg.forcePlhdr) {
				if (fg_brt/255 < str/300.0)
					bstl = '#000';
				else if (bg_brt < g_bg_contrast)
					bstl = '#fff';
				if (g_n_inv)
					if (bstl == '#000')
						bstl = '#fff';
					else if (bstl == '#fff')
						bstl = '#000';
				node.style.setProperty('color',bstl,'important');
			}
			}
			if (style.color != oc)
				b_chk[fg_bg_val] = getRGBarr(style.color);
		};

		const iterateBigArr = (arr) => {
			let chunk = arr.length;
			let len   = arr.length;

			let idx = 0;

			const doChunk = () => {
				let c = chunk;

				while (c--) {
					if (idx > len - 1)
						return;

					setAttribs(arr[idx++]);
				}

				setTimeout(doChunk, 0);
			};

			doChunk();
		}

		iterateBigArr(nodes);

		if (cfg.advDimming && !cfg.ssrules)
			document.body.style.setProperty('filter','unset','important');
	}

	await process(nodes);

	t_end = Date.now();

	console.log('Time processing = '+((t_end-t_start)/1000.0).toFixed(2) + ' seconds');
	const observer = mutations => {
		let new_nodes = [];

		mutations.forEach(mut => {
			for (let node of mut.addedNodes) {
				if (!(node instanceof Element))
					continue;

				nodes = Array.from(node.getElementsByTagName('*'));
				nodes.push(node);

				new_nodes.push(...nodes);
			}
		});

		if(new_nodes.length) {
			b_html = false;
			setTimeout(() => process(new_nodes, true), 55);
		}
	};

	if (doc_obs != undefined && doc_obs != null) {
		doc_obs.observe(document.body, { childList: true, subtree: true });
	} else {
		doc_obs = new MutationObserver(observer);
		doc_obs.observe(document.body, { childList: true, subtree: true });
	}
}

var timerid2 = setTimeout(changeBrightnessContrast, 1000);
var g_brt, g_ctr;

function changeBrightnessContrast() {

	chrome.storage.local.get(["url","abrightness","acontrast","azoom","afont"]).then((res) => {

	let url_g = window.location.hostname || window.location.href;
	let url = url_g.trim();

	let url1 = '';
	if (res.url != undefined && res.url)
		url1 = res.url.trim();

	let brt = document.documentElement.style.getPropertyValue("--g_brightness");
	let ctr = document.documentElement.style.getPropertyValue("--g_contrast");
	let zoo = parseFloat(document.documentElement.style.getPropertyValue("--g_zoom"));
	let fnt = document.documentElement.style.getPropertyValue("--g_btvfont");

	if (url1 == url && (brt != res.abrightness || ctr != res.acontrast || zoo != parseFloat(res.azoom) || fnt != res.afont))
	if ((!isNaN(parseInt(res.abrightness)) && !isNaN(parseInt(res.acontrast)) && !isNaN(parseFloat(res.azoom))) || res.afont) {

	g_brt = res.abrightness;
	g_ctr = res.acontrast;

	if (parseFloat(res.azoom) >= 0.0099)
		document.documentElement.style.setProperty('--g_zoom',Math.abs(parseFloat(res.azoom)));
	else
		document.documentElement.style.setProperty('--g_zoom',1.75);

	if (res.afont) {
		document.documentElement.style.setProperty('--g_btvfont',res.afont);
		let rul = `*{font-family:var(--g_btvfont)!important;}`;
		if (!g_fntRule) {
			style_node.sheet.insertRule(rul,0);
			g_fntRule = true;
		}
	} else if (g_fntRule) {
		document.documentElement.style.setProperty('--g_btvfont','');
		g_fntRule = false;
		let rul = 'var(--g_btvfont)';
		let rl = style_node.sheet.cssRules;
		let x = 0;
		for (x = 0; x < rl.length; x++ )
			if (rl[x].cssText.indexOf(rul) > -1) break;
		if (x < rl.length)
			style_node.sheet.deleteRule(x);
	}

	document.documentElement.style.setProperty('--g_brightness',g_brt);
	document.documentElement.style.setProperty('--g_contrast', g_ctr);

	let f_brt = parseInt(g_brt)/100;
	let f_ctr = parseInt(g_ctr)/100;

	g_brightness = f_brt;
	g_contrast = f_ctr;

	g_m = multiplyMatrices(Matrix.identity(), Matrix.brightness(f_brt));
	g_m2 = multiplyMatrices(g_m, Matrix.contrast(f_ctr));
	g_m = multiplyMatrices(g_m2, Matrix.invertNHue());

	if (m_fcol != undefined)
	for (let [n, col] of m_fcol.entries()) {
		let fgcol = [ 255-col[0], 255-col[1], 255-col[2] ];
		let fgr = applyColorMatrix(fgcol);
		fgr[3] = col[3];
		let nsty = n.getAttribute('style');
		if (nsty == null) nsty = '';
		let rsty = nsty.replace(/color[^\;]*/ig, 'color:rgba('+fgr+')!important;');
		n.setAttribute('style',rsty);
	}

	if (m_bcol != undefined)
	for (let [n, col] of m_bcol.entries()) {
		let fgcol = [ 255-col[0], 255-col[1], 255-col[2] ];
		let fgr = applyColorMatrix(fgcol);
		fgr[3] = col[3];
		let nsty = n.getAttribute('style');
		if (nsty == null) nsty = '';
		let rsty = nsty.replace(/background-color[^\;]*/ig, 'background-color:rgba('+fgr+')!important;');
		n.setAttribute('style',rsty);
	}

	if (m_bocol != undefined)
	for (let [n, col] of m_bocol.entries()) {
		let fgcol = [ 255-col[0], 255-col[1], 255-col[2] ];
		let fgr = applyColorMatrix(fgcol);
		fgr[3] = col[3];
		let nsty = n.getAttribute('style');
		if (nsty == null) nsty = '';
		let rsty = nsty.replace(/border-color[^\;]*/ig, 'border-color:rgba('+fgr+')!important;');
		n.setAttribute('style',rsty);
	}

	chrome.storage.local.remove(["url","abrightness","acontrast","azoom","afont"]);
	}

	});
	timerid2 = setTimeout(changeBrightnessContrast, 1000);
}

var timerid = setTimeout(isloaded, 5000);

function isloaded() {
	if (document.getElementById('_btv_')) {
		clearTimeout(timerid);
	} else {
		clearTimeout(timerid);
		init();
	}
}

window.onload = init();

chrome.runtime.sendMessage({ from: 'toggle', enabled: true });

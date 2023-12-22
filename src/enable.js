"use strict";


function createFilterMatrix(config) {
	return g_m;
}
function clamp(x, min, max) {
	return Math.min(max, Math.max(min, x));
}
let gcol_cache = {};
function applyColorMatrix([r, g, b], matrix) {
	let col = [r,g,b];
	if (typeof gcol_cache[col] != 'undefined')
		return gcol_cache[col];
	const rgb = [[r / 255], [g / 255], [b / 255], [1], [1]];
	const result = multiplyMatrices(matrix, rgb);
	const x = [0, 1, 2].map((i) =>
	clamp(Math.round(result[i][0] * 255), 0, 255));
	if (typeof gcol_cache[col]== 'undefined')
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

let g_m = Matrix.identity();
g_m = multiplyMatrices(g_m, Matrix.brightness(g_brightness));
g_m = multiplyMatrices(g_m, Matrix.contrast(g_contrast));
g_m = multiplyMatrices(g_m, Matrix.invertNHue());


var style_node;
var css_node;
var doc_obs;
let b_html = false;
let b_imgforce = {};
let f_sizes = [];
let f2_sizes = [];
let h_sizes = [];
let b_body = false;
let eng = false;
var str_style;
var str_style2;
var t_start, t_end;

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
	var eng = /^en/i.test(document.documentElement.lang);
	if (eng) {
	let words = txtc.split(/\b/);
	const spann = document.createElement('span');
	for (let wordID = 0; wordID < words.length; wordID++) {
		if (typeof words[wordID] == 'undefined' || words[wordID] == null) continue;
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
		if (typeof words[wordID] == 'undefined' || words[wordID] == null || words[wordID].length == 0) continue;
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
		if (typeof words[wordID] == 'undefined' || words[wordID] == null || words[wordID].length == 0) continue;
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

function getRGBarr(rgba_str)
{
	let rgb = null;
		let x = rgba_str.indexOf(')');
	if (rgba_str.substring(0,4) == 'rgba') {
		rgb = rgba_str.substring(5, x).replace(/ /g, '').split(',');
	} else {
		rgb = rgba_str.substring(4, x).replace(/ /g, '').split(',');
	}
	return rgb;
}

function calcBrightness([r, g, b, a = 1])
{
	return Math.sqrt( 0.299*(r*r) + 0.587*(g*g) + 0.114*(b*b) )*a;
}

function calcColorfulness([r, g, b, a = 1])
{
	let max = Math.max(r,g,b);
	let min = Math.min(r,g,b);
	if (max == 0) return 0;
	let cful = ((max + min)*(max - min))/max;
	return a*cful;
}

function containsText(node, mp)
{
	let len = 0;
	var r;
	if (typeof node.innerText != 'undefined' && mp.get(node) != true && node.innerText != null && node.innerText.length > 0) {
		if (node.outerHTML.indexOf('<SCRIPT>') < 0 && node.outerHTML.indexOf('<STYLE>') < 0) {
		mp.set(node, true);
		r = node.innerText.replace(/[^\S]+/g,"");
		len = len + parseInt(r.length);
		return len;
		}
	}
	if (node.nodeType  == Node.TEXT_NODE) {
	 	r = node.nodeValue.replace(/[^\S]+/g,"");
		len = len + parseInt(r.length);
	}
	if (typeof node.value != 'undefined' && node.value != null && node.value.length > 0) {
		if (node.outerHTML.indexOf('<SCRIPT>') < 0 && node.outerHTML.indexOf('<STYLE>') < 0) {
		r = node.value.replace(/[^\S]+/g,"");
		len = len + parseInt(r.length);
		}
	}

	if (mp.get(node) != true) {
	let childn = Array.from(node.getElementsByTagName('*'));
	var ch;
	mp.set(node, true);
	for (let x=0; x < childn.length; x++) {
		ch = childn[x];
		if (ch instanceof Element && ch.outerHTML.indexOf('<SCRIPT>') < 0 && ch.outerHTML.indexOf('<STYLE>') < 0) {
			if (typeof ch.innerText != 'undefined' && ch.innerText != null && ch.innerText.length > 0) {
				r = ch.innerText.replace(/[^\S]+/g,"");
				len = len + parseInt(r.length);
			} else if (typeof ch.value != 'undefined' && ch.value != null && ch.value.length > 0) {
				r = ch.value.replace(/[^\S]+/g,'');
				len = len + parseInt(r.length);
			}
		}
		if (ch.nodeType  == Node.TEXT_NODE && /\S/.test(ch.nodeValue)) {
			r = ch.nodeValue.replace(/[^\S]+/g,"");
			len = len + parseInt(r.length);
		}
	}
	childn.length = 0;
	}

	return len;
}

function isImage(ch, nc, imar) {
	if (!(ch instanceof Element)) return false;
	let gcs = getComputedStyle(ch);
	if (b_imgforce[nc] != true) b_imgforce[nc] = false;
	var wi,he;
	let bgim = gcs.backgroundImage ? gcs.backgroundImage : '';
	let chsrc = ch.src ? ch.src : '';
	let itag = ch.nodeName.toUpperCase();
	switch (itag) {
	case 'IMG':
		wi = parseInt(ch.getBoundingClientRect().width);
		he = parseInt(ch.getBoundingClientRect().height);
		imar[nc] = wi*he;
		if (wi > 499 && he > 139) b_imgforce[nc] = true;
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && imar[nc] < 35000) return false;
		return true;
	case'SVG':
		wi = parseInt(ch.getBoundingClientRect().width);
		he = parseInt(ch.getBoundingClientRect().height);
		imar[nc] = wi*he;
		if (wi > 499 && he > 139) b_imgforce[nc] = true;
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && imar[nc] < 35000) return false;
		return true;
	case 'VIDEO':
	case 'EMBED':
	case 'OBJECT':
	case 'CANVAS':
		wi = parseInt(ch.getBoundingClientRect().width);
		he = parseInt(ch.getBoundingClientRect().height);
		imar[nc] = wi*he;
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && imar[nc] < 35000) return false;
		return true;
	default:
	if ( gcs != null && bgim != '' && bgim != 'none' && gcs.getPropertyValue('display') != 'none' && !/(php|htm[l]?|asp[x]?)[\"\'\)]/i.test(bgim) && /(\/|http|url|gradient)/ig.test(bgim)) {
		wi = parseInt(ch.getBoundingClientRect().width);
		he = parseInt(ch.getBoundingClientRect().height);
		if (!/gradient/i.test(bgim)) {
                let im = new Image();
                let src = gcs.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
                im.src = src;
		im.onload = function () {
		};
		imar[nc] = wi*he;
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && imar[nc] < 35000) return false;
		if ((parseInt(im.width) > 1 && parseInt(im.height) > 1) || (parseInt(im.width) == 0 && parseInt(im.height) == 0)) {
			if (wi > 499 && he > 139) b_imgforce[nc] = true;
				return true;
			} else {
				return false;
		}
		} else {
		imar[nc] = wi*he;
		if ((wi> 1 && he > 1) || (wi == 0 && he == 0)) {
			if (wi > 499 && he > 139) b_imgforce[nc] = true;
				return true;
			} else {
				return false;
			}		
		}
	} else if (typeof chsrc != 'undefined' && chsrc != null && chsrc != '' && ch.display != 'none' && ch.type != null && typeof ch.type != 'undefined' && ch.type.toLowerCase() == 'image' && !/(php|htm[l]?|asp[x]?)[\"\'\)]/i.test(chsrc) && !/(php|htm[l]?|asp[x]?)[\"\'\)]/i.test(bgim)  && (/(\/|http|url)/ig.test(chsrc) || /gradient/i.test(bgim))) {
		wi = parseInt(ch.getBoundingClientRect().width);
		he = parseInt(ch.getBoundingClientRect().height);
		imar[nc] = parseInt(ch.width) * parseInt(ch.height);
		if (parseInt(ch.width) > 499 && parseInt(ch.height) > 139) b_imgforce[nc] = true;
		if ((/(hidden|none)/i.test(gcs.visibility) || /(hidden|none)/i.test(gcs.display)) && imar[nc] < 35000) return false;
		return true;
	} else {
		return false;
	}
	}
}

function containsImage(node, imgs)
{
	let childn = Array.from(node.getElementsByTagName('*'));
	var img;
	for (let x=0; x < imgs.length; x++) {
		img = imgs[x];
		if (childn.includes(img))
			return true;
	}
	childn.length = 0;
	return false;
}

function parentStyle(node,reg) {
	let pch = node.parentNode;
	let b_found = false;
	while (pch && !/\b(BODY|HTML)/i.test(pch.nodeName)) {
		if (pch && pch.getAttribute)
		if (!reg.test(pch.getAttribute('style'))) {
			pch = pch.parentNode;
			continue;
		} else {
			b_found = true; break;
		}
		pch = pch.parentNode;
	}
	return b_found;
}

function getBgColor(parnt, bg_color)
{
	let bbg_color = bg_color;
	let disp = '';

	let transparent = 'rgba(0, 0, 0, 0)';
	while (bg_color == transparent && parnt != null && typeof parnt != 'undefined') {
		if (parnt instanceof Element) {
		let gcs = getComputedStyle(parnt);
		bbg_color = gcs.backgroundColor;
		disp = gcs.display || gcs.visibility;
		if (typeof bbg_color != 'undefined' && bbg_color != null && bbg_color != '' && disp != 'none' && disp != 'hidden' && bbg_color != transparent) {
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
	let bbg_color = bg_color;
	let disp = '';

	let transparent = 'rgba(0, 0, 0, 0)';
	while (bg_color == transparent && parnt != null && typeof parnt != 'undefined') {
		if (parnt instanceof Element) {
		let gcs = getComputedStyle(parnt);
		bbg_color = gcs.backgroundColor;
		disp = gcs.display || gcs.visibility;
		if (typeof bbg_color != 'undefined' && bbg_color != null && bbg_color != '' && disp != 'none' && disp != 'hidden' && bbg_color != transparent) {
			bg_color = bbg_color;
			break;
		}
		}
		parnt = parnt.parentNode;
	}

	if (bg_color != transparent) bg_luma = calcBrightness(getRGBarr(bg_color));
	return bg_luma;
}

function getCSS(cfg) {

	const attr = '[d__],[d__][style]';
	let color_black = 'color:black!important;';

	let dim = '';
	let sCaps = '';
	var brght,ctrst;
	if (cfg.advDimming) {
		brght = (100 + (parseInt(cfg.contrast))).toFixed(1);
		ctrst = (50 + parseInt(cfg.brightness)).toFixed(1);
		dim = `filter:brightness(${brght}%) contrast(${ctrst}%)!important;`;
	}

	let opacity = '';
	if (cfg.forceOpacity)
		opacity = 'opacity:1!important;';

	let boldw = cfg.weight;
	let bold = '';
	if (!cfg.start3 || boldw < 400)
	if (boldw != 400)
		bold = `*{font-weight:${boldw}!important};`;

	let underline = '';
	if (cfg.underlineLinks)
		if (!(cfg.advDimming && cfg.input_border))
		underline = '[u__]{text-decoration:underline!important}*{font-family:sans-serif,sans!important}';

	if (!cfg.forcePlhdr)
		color_black = '';

	if (cfg.makeCaps)
		sCaps = 'font-variant-caps:small-caps!important;';

	const placeholder = `::placeholder{opacity:1!important;${color_black}};`;

	let form_border = '';
	if (cfg.input_border)
		if (!(cfg.advDimming && cfg.underlineLinks))
		form_border = '[b__]{border:1px solid black!important}*{font-family:serif!important}';

	if (cfg.forcePlhdr && cfg.contrast != 0 && cfg.brightness != 50) {
		g_brightness = 1.0+parseInt(cfg.contrast)/100;
		g_contrast = 1.0 + (parseInt(cfg.brightness)-50)/100;
		g_m = Matrix.identity();
		g_m = multiplyMatrices(g_m, Matrix.brightness(g_brightness));
		g_m = multiplyMatrices(g_m, Matrix.contrast(g_contrast));
		g_m = multiplyMatrices(g_m, Matrix.invertNHue());
	} else if (cfg.forcePlhdr && cfg.contrast == 0 && cfg.brightness == 50) {
		g_brightness = 1.00;
		g_contrast = 1.00;
		g_m = Matrix.identity();
		g_m = multiplyMatrices(g_m, Matrix.brightness(g_brightness));
		g_m = multiplyMatrices(g_m, Matrix.contrast(g_contrast));
		g_m = multiplyMatrices(g_m, Matrix.invertNHue());
	}

	let cust = '';
	if (cfg.customCss)
		cust = cfg.customCssText;

	let size_inc = '';
//	let c = cfg.threshold;
//	let cc = parseInt(c) + parseFloat(cfg.size/c);
//	let height_inc = parseFloat(cfg.size/c)/parseFloat(cfg.size);
	let c = 1;
	let cc = 1;
	let height_inc = 1;
	var pcent;

	if (cfg.size > 0 && cfg.threshold > 0) {
		while (c < cfg.threshold) {
			++c;
			cc = (cfg.size*0.2) + parseFloat(cfg.threshold*1.075) - (2*c/11);
			pcent = Math.abs((2.5*cfg.size) - (c*20/cfg.threshold));
			if (parseFloat(cc) < c) { cc = c; }
			if (parseFloat(cc) > cfg.threshold) cc = cfg.threshold;
			let cc1 = parseInt(cc);
			height_inc = ((c+(parseInt(cfg.size)+parseInt(cfg.threshold))*0.04)/c).toFixed(3);
			let cc2 = (cc1*(1+parseFloat(pcent)/100)).toFixed(1);
			size_inc += `[s__='${c}']{font-size: ${cc2}px!important;}`;
			if (!cfg.skipHeights)
				size_inc += `[s__='${c}']{line-height: ${height_inc}em!important;${sCaps}${dim}${opacity}}\n`;
			else
				size_inc += `[s__='${c}']{${sCaps}${dim}${opacity}}\n`;
			size_inc += `[h__='${c}']{line-height:normal!important;min-height: ${height_inc}em!important}`;
			if (!cfg.skipHeights)
//				f_sizes[c] = "font-size: calc(" + cc + "px + " + pcent + "%)!important;"+sCaps+"line-height: " + height_inc + "em!important;" + dim + opacity;
				f_sizes[c] = "font-size: " + cc2 + "px!important;"+sCaps+"line-height: " + height_inc + "em!important;" + dim + opacity;
			else
				f_sizes[c] = "font-size: " + cc2 + "px!important;"+sCaps+ dim + opacity;
//				f_sizes[c] = "font-size: calc(" + cc + "px + " + pcent + "%)!important;"+sCaps+";" + dim + opacity;
			h_sizes[c] = `${height_inc}em`;
//			f2_sizes[c] = "calc(" + cc + "px + " + pcent + "%)";
			f2_sizes[c] = cc2 + "px";
		}
		str_style = `brightness(${brght}%) contrast(${ctrst}%)`;
		str_style2 = `1`;
	}

	return `${bold}${size_inc}${form_border}${underline}${cust}`;
}

function createElem()
{
	let doc = document;

	style_node = doc.createElement('style');
	style_node.setAttribute('id', '_btv_');
	let d_head = doc.head || doc.getElementsByTagName('HEAD')[0];
	if (typeof d_head != 'undefined' && d_head != null)
		d_head.appendChild(style_node);
	else
		d_head = '';

	css_node = doc.createTextNode('');
}

async function init()
{
	if (document.getElementById('_btv_')) {
		if (style_node != null && typeof style_node != 'undefined') {
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
		'skipWhites',
		'makeCaps',
		'start3',
		'skipLinks',
		'skipNavSection',
		'skipHeights',
		'underlineLinks',
		'input_border',
		'customCss',
		'customCssText'
	];

	let cfg = await new Promise(res => chrome.storage.local.get(stored, res));

	cfg.strength  = cfg.globalStr;
	cfg.threshold = cfg.sizeThreshold;

	let url = window.location.hostname || window.location.href;

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

	if (idx > -1) {
		cfg = wl[idx];
	} else if (!cfg.enableEverywhere) {
		let cnode = document.getElementById("_btv_");
		cnode.remove();
		return;
	}

	t_start = Date.now();

	start(cfg, url);
}

function start(cfg, url)
{
	css_node.nodeValue = getCSS(cfg);

	style_node.appendChild(css_node);

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
		'IMG',
		'SVG',
		'EMBED',
		'OBJECT',
		'SOURCE',
		'CANVAS',
		'NOSCRIPT',
		'undefined'
	];

	let colors_to_skip  = [
		'rgb(0, 0, 0)',
		'rgba(0, 0, 0, 0)'
	];

	let hdr_tags = ['H1', 'H2', 'H3', 'H4'];
	if (cfg.skipHeadings)
		tags_to_skip.push(...hdr_tags);

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
	let m_fcol = new Map();
	let m_bcol = new Map();
	let m_bocol = new Map();
	let m_sty = {};
	let b_emo = {};
	let b_noemo = false;
	let b_idone = {};
	let b_cdone = {};
	let b_rules = '';
	let n_rulecount = 0;
	let images = [];
	let img_area = [];
	let map = new Map();
	let mp = new Map();
	let m_ss = new Map();
	let nodes_behind_img = [];
	let nodes_behind_inv = [];
	let n_imgcount = 0;
	let b_csp = true;
	let b_forced = false;
	var lang = document.documentElement.lang;
	eng = false;
	if (lang == null || lang.length == 0)
		eng = true;
	else if (/^en/i.test(lang))
		eng = true;
	let rootcolor       =  getRGBarr(getComputedStyle(document.documentElement).backgroundColor);
	let bodycolor       =  getRGBarr(getComputedStyle(document.body).backgroundColor)
	if (rootcolor != '' && bodycolor != '') {
	if (typeof bodycolor[3] == 'undefined') bodycolor[3] = 1;
	if (typeof rootcolor[3] == 'undefined') rootcolor[3] = 1;
	let rootLightness   = 1 -  rootcolor[3] + rootcolor[3] * calcBrightness(rootcolor)/255;
	let finalLightness  = Math.abs((1 - bodycolor[3]) * rootLightness + bodycolor[3] * calcBrightness(bodycolor)/255);
	finalLightness = Math.sqrt(finalLightness);
        if (window.self == window.top)
		chrome.storage.local.set({lightness: finalLightness});
	console.log('Dark / Light = '+finalLightness.toFixed(2));
	if (cfg.forcePlhdr || cfg.advDimming)
	if (finalLightness < 0.5)  {
		if (cfg.advDimming && cfg.forcePlhdr) {
			cfg.forcePlhdr = true;
			cfg.advDimming = false;
			var cs = css_node.nodeValue;
			var rcs = cs.replaceAll(/filter\W*brightness[\W\d]*contrast[\W\d]*important\;/mg,'');
			css_node.nodeValue = rcs;
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
			var rcs = cs.replaceAll(/filter\W*brightness[\W\d]*contrast[\W\d]*important\;/mg,'');
			css_node.nodeValue = rcs;
		}
	}
	}

	const process = (nodes, mutation = false) =>
	{
		b_body = false;
		b_ctext = {};
		b_chimg = {};
		b_iimg = {};
		b_fnt = {};
		b_dim = {};
		b_emo = {};
		b_rules = '';
		n_rulecount = 0;
		b_noemo = false;
		b_idone = {};
		images = [];
		img_area = [];
		n_imgcount = 0;

		var nn_style, nn_reg;
		var notInsertedRule = true;
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
			for (let x=0; x < nodes.length; x++) {
			n = nodes[x];
			nc++;
			map.set(n, nc);
			b_ctext[nc] = containsText(n, mp);
			b_iimg[nc] = isImage(n, nc, img_area);
			if (b_iimg[nc]) images.push(n);
			if (cfg.forcePlhdr && cfg.normalInc && mutation) {
				let ps = parentStyle(n,/filter\W*invert/);
				if (ps) nodes_behind_inv.push(n);
			}
			}
			for (let x=0; x < images.length; x++) {
			n = images[x];
			nc = map.get(n);
			let img_children = Array.from(n.getElementsByTagName("*"));
			if (img_area[nc] > 35000 && img_area[nc] < 5000000) {
				nodes_behind_img.push(...img_children);
				n_imgcount++;
			}
			if (n.parentNode && b_iimg[map.get(n.parentNode)])
				b_chimg[map.get(n.parentNode)] = true;
			}
		}
		var doc = document;
		if (!cfg.ssrules) {
		let sheets = doc.styleSheets;
		for (let j =0; j < sheets.length; j++ ) {
			try {
				const ruleList = sheets[j].cssRules;
				let rl = ruleList.length;
				for (let i = 0; i < ruleList.length; i++) {
					if (ruleList[i].href) { ruleList = ruleList[i].styleSheet.cssRules; i = 0; continue; }
					if (ruleList[i].style && /\d+.*?px/i.test(ruleList[i].style.fontSize)) {
					let fsz = parseInt(ruleList[i].style.fontSize);
					if (/font(-size)?/i.test(ruleList[i].style.cssText))
					if (fsz > 1 && fsz <= cfg.threshold ) {
						if (/\b(BODY|HTML|\-\-root)/i.test(ruleList[i].selectorText) && cfg.advDimming) {
							let tmp = f_sizes[fsz].replace(/filter.*brightness.*contrast[^;]*/mg, '');
							sheets[j].insertRule(ruleList[i].selectorText + "{" + tmp + "}", ruleList.length);
							b_csp = false;
						} else {
							sheets[j].insertRule(ruleList[i].selectorText + "{" + f_sizes[fsz] + "}", ruleList.length);
							b_csp = false;
						}
					}
					}
				}
			} catch (error) {
				b_csp = true;
				console.log('cssrules security!');
				break;
			}
		}
		}
		let rn = 0;
		if (cfg.ssrules) {
		let m_sec = {};
		let m_count = {};
		let b_sec = false;
		let body_nfz = 16;
		let bcs = getComputedStyle(document.body);
		if (bcs.fontSize && /\d.*?px/i.test(bcs.fontSize))
			body_nfz = parseFloat(bcs.fontSize);
		for (var si = 0; si < document.styleSheets.length; si++) {
			try {
			var sheet = document.styleSheets[si];
			var rules = sheet.cssRules;
			b_sec = false;
			for (var ri = 0; ri < rules.length; ri++) {
				var rule= rules[ri];
			var txtrul = '';
				if (rule.href) { rules = rule.styleSheet.cssRules; ri = 0;continue; }
				if (rule.selectorText && rule.style) {
				let key = rule.selectorText;
				let value = rule.style.cssText;
			if (cfg.forcePlhdr && cfg.normalInc && (rule.style.color || rule.style.backgroundColor || rule.style.borderColor)) {
				m_count[sheet] = true;
				if (rule.style.color && rule.style.color.substring(0,3) == 'rgb') {
				let fgarr = getRGBarr(rule.style.color);
				if (typeof fgarr[3] == 'undefined') fgarr[3] = 1.0;
				if (typeof m_sty[fgarr] == 'undefined') {
					let fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])], g_m);
					m_sty[fgarr] = [fgr[0],fgr[1],fgr[2],fgarr[3]];
				}
				}
				if (rule.style.backgroundColor && rule.style.backgroundColor.substring(0,3) == 'rgb') {
				let fgarr = getRGBarr(rule.style.backgroundColor);
				if (typeof fgarr[3] == 'undefined') fgarr[3] = 1.0;
				if (typeof m_sty[fgarr] == 'undefined') {
					let fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])], g_m);
					m_sty[fgarr] = [fgr[0],fgr[1],fgr[2],fgarr[3]];
				}
				}
				if (rule.style.borderColor && rule.style.borderColor.substring(0,3) == 'rgb') {
				let fgarr = getRGBarr(rule.style.borderColor);
				if (typeof fgarr[3] == 'undefined') fgarr[3] = 1.0;
				if (typeof m_sty[fgarr] == 'undefined') {
					let fgr = applyColorMatrix([255-parseInt(fgarr[0]), 255-parseInt(fgarr[1]), 255-parseInt(fgarr[2])], g_m);
					m_sty[fgarr] = [fgr[0],fgr[1],fgr[2],fgarr[3]];
				}
				}
			}
			if (/(\bbody|\bhtml|\[s__)/i.test(key)) continue;
			if (typeof m_ss.get(key) == 'undefined' && cfg.threshold > 0 && cfg.size > 0 && rule.style.fontSize) {
				m_count[sheet] = true;
				let b_set = false;
				if (/[\d\.]+.*?px/i.test(rule.style.fontSize)) {
				let rt = rule.style.fontSize.replace(/px/ig, '');
				let nfz = parseInt(rt);
				if (nfz <= cfg.threshold && nfz > 1) {
				txtrul = key+' { '+f_sizes[nfz]+' }';
				m_ss.set(key, f_sizes[nfz]);
				b_set = true;
				n_rulecount++;
				}
				} else if (/[\d\.]+.*?pt/i.test(rule.style.fontSize)) {
				let rt = rule.style.fontSize.replace(/pt/ig, '');
				let nfz = parseInt(parseFloat(rt)*1.333334);
				if (nfz <= cfg.threshold && nfz > 1) {
				txtrul = key+' { '+f_sizes[nfz]+' }';
				m_ss.set(key, f_sizes[nfz]);
				b_set = true;
				n_rulecount++;
				}
				} else if (/[\d\.]+.*?r?em/i.test(rule.style.fontSize)) {
				let rt = rule.style.fontSize.replace(/r?em/ig, '');
				let nfz = parseInt(parseFloat(rt)*body_nfz);
				if (nfz <= cfg.threshold && nfz > 1) {
				txtrul = key+' { '+f_sizes[nfz]+' }';
				m_ss.set(key, f_sizes[nfz]);
				b_set = true;
				n_rulecount++;
				}
				}
				if (b_set) {
					if (key.indexOf(',') < 0) {
						b_rules += '||'+key.trim()+'||';
					} else {
						let arr_sels = key.trim().split(',');
						for (let sel of arr_sels) { b_rules += '||'+sel.trim()+'||'; }
					}
				}
			}
			}
			if (!b_sec && txtrul.length > 0) {
				sheet.insertRule(txtrul,0);
				b_sec = false;
			}

			}
			} catch (error) {
				console.log('cssrules security   !');
				m_sec[sheet] = true;
				b_sec = true;
			}
		}
		if (n_rulecount < 3) { console.log('Rules cleared'); b_rules = ''; n_rulecount = 0; }
		}

		if (cfg.forcePlhdr && cfg.forceIInv) {
		if (notInsertedRule && style_node.sheet != null) {
			style_node.sheet.insertRule("IMG,SVG,CANVAS,OBJECT,VIDEO,EMBED,INPUT[type='image'] { filter:invert(1)!important; }", rn++);
			style_node.sheet.insertRule("frame,iframe { filter:invert(1)!important; }", rn++);
			b_html = false;
			notInsertedRule = false;
		}
		let ms = null;
		let cmap = [];
		if (doc.body != null && doc.body.innerText != null)
			ms = doc.body.innerText.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/mgu);
		if (ms != null && ms.length > 0) {
			var totemo = '';
			for (let str of ms) { totemo += str; if(!cmap.includes(str)) cmap.push(str); }
			if (/[®©✓✔✕✖✗✘]+/mgu.test(totemo) && cmap.length < 6) b_noemo = true;
		} else {
			b_noemo = true;
		}
		}

		let save_nc = node_count;
		let node = doc.body;
		if (cfg.forcePlhdr && b_idone[node_count] != true) {
		if (typeof node == 'undefined' || node == null)
			node = document.getElementsByTagName('BODY')[0];

		if (!(typeof node == 'undefined' || node == null)) {
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
				if (typeof hdr == 'undefined' || hdr == null) hdr = hdrs[1];
			} else {
				if (!b_html)
					hdrs = Array.from(document.body.getElementsByTagName('*'));
				else
					hdrs = Array.from(htm.getElementsByTagName('*'));
				b_hdr = false;
				for (hdr of hdrs) {
				if (typeof hdr.className != 'undefined' && hdr.className != null && hdr.className.length > 0 && /header/i.test(hdr.className)) {
					b_hdr = true; break;
				} else if (typeof hdr.id != 'undefined' && hdr.id != null && hdr.id.length > 0 && /header/i.test(hdr.id)) {
					b_hdr = true; break;
				}
				}
			}
			if (!b_hdr) hdr = null;
			var n_c;
			for (let x=0; x < images.length; x++) {
			let img = images[x];
//				if (/INPUT/i.test(img.nodeName) && (img.type == null || !/image/i.test(img.type))) continue;
			n_c = map.get(img);
			let p_s = parentStyle(img,/filter\W*invert/i);
			let cst = getComputedStyle(img);
			if (nodes_behind_inv.includes(img)) {
				img.style.setProperty('filter','unset', 'important');
				continue;
			}
			let isty = img.style.getPropertyValue('filter');
			var pisty = '';
			if (img.parentNode) pisty = img.parentNode.style.getPropertyValue('filter');
			let bgim = cst.backgroundImage ? cst.backgroundImage : '';
			let imsrc = img.src ? img.src : '';
			if (!b_imgforce[n_c] || b_ctext[n_c] > 95)
			if (!/(IMG|SVG|VIDEO|OBJECT|EMBED|CANVAS)/i.test(img.nodeName) && !/(slide|banner|background.*page|page.*background)/ig.test(img.className) && ((typeof imsrc != 'undefined' && imsrc != null && imsrc != '' && !/(\/|http|url)/ig.test(imsrc) && /gradient/i.test(bgim)) || (typeof bgim != 'undefined' && bgim != '' && bgim != 'none' && !/(\/|http|url|gradient)/ig.test(bgim)) || (b_ctext[n_c] > 95 && !b_imgforce[n_c]) && !/gradient/i.test(bgim)) || (((img.textContent.indexOf(' ') > 0 && b_ctext[n_c] > 0 && !/gradient/i.test(bgim) && !/\b(A|INPUT)/i.test(img.nodeName) && !/button/i.test(img.className)) || /nav/i.test(img.className)) && !b_imgforce[n_c] && img_area[n_c] < 35000 && img_area[n_c] >= 0)) {
				if (!(hdr && hdr.contains(img))) {
				img.style.setProperty('filter','unset', 'important');
				continue;
				}
			} else if (b_ctext[n_c] > 95) {
				img.style.setProperty('filter','unset', 'important');
				continue;
			}
			let bnav = false;
			if (typeof pisty == 'undefined' || pisty == null) pisty = '';
			if (typeof isty == 'undefined' || isty == null) isty = '';
			let pch = img;
			if (hdr != null && hdr.contains(img) && cfg.skipNavSection) {
				bnav = true;
			} else if (cfg.skipNavSection) {
			while (pch != null && typeof pch != 'undefined' && pch.nodeName != 'BODY') {
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
			if (!nn_reg.test(isty) && !nn_reg.test(pisty) && !p_s && (!containsImage(img, images) || b_imgforce[n_c] || ((!b_chimg[n_c] && hdr != null && hdr.contains(img)) || /image/i.test(img.type) || bgim.length > 0 || imsrc.length > 0 || b_chimg[n_c])))
				if (!(/\b(UL|OL)/i.test(img.nodeName) && img.childNodes.length < 4)) {
					img.style.setProperty('filter','invert(1)','important');
					let chldn = Array.from(img.getElementsByTagName('*'));
					nodes_behind_inv.push(...chldn);
					n_inv++;
				}
			}
			hdrs,length = 0;
			}
			b_html = true;
		}

		}
		b_idone = {};

		if (cfg.advDimming)
			if (!(cfg.input_border && cfg.underlineLinks) || n_imgcount > 2) {
			for (let x=0; x < images.length; x++) {
				let img = images[x];
				let pn = img;
				let lastn = pn;
				while (pn && !/\b(BODY|HTML)/i.test(pn.nodeName)) {
					lastn = pn;
					let nsty = lastn.getAttribute('style');
					if (nsty != null && !nn_reg.test(nsty) && ((nsty+nn_style).length > 0))
						//lastn.setAttribute('style',nsty+nn_style);
						lastn.style.setProperty('filter','revert','important');
					else if (nsty == null && nn_style.length > 0)
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
		node_count = save_nc;
		node = nodes[node_count];

		let setAttribs = node => {

			let tag = String(node.nodeName.toUpperCase());
			let pnode = node.parentNode;
			let sk = false;

			if (cfg.ssrules && n_rulecount > 0) {
			let cnames = node.className.length > 0 ? node.className.split(/\s+/) : [];
			let style = getComputedStyle(node);
			if (style.fontSize && !f2_sizes.includes(style.fontSize)) {
				sk = false;
			} else if (node.id.length > 0 && b_rules.indexOf(node.id+'||') > 0) {
				sk = true;
			} else if (node.className.length > 0 && (b_rules.indexOf(cnames[0]+'||') > 0 || b_rules.indexOf(cnames[1]+'||') > 0 || b_rules.indexOf(cnames[2]+'||') > 0 || b_rules.indexOf(cnames[3]+'||') > 0 || b_rules.indexOf(cnames[4]+'||') > 0 || b_rules.indexOf(cnames[5]+'||') > 0)) {
				sk = true;
			} else if (b_rules.search('\\b'+tag.toLowerCase()+'||') > 0 || b_rules.search('\\b'+tag+'||') > 0) {
				sk = true;
			}
			}

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

			if (cfg.forceOpacity && !b_body && cfg.forcePlhdr && pnode != null && pnode.nodeName == 'BODY') {
				let fsty = getComputedStyle(pnode).getPropertyValue('background-color');
				if (fsty == null || fsty == '' || fsty == 'none') fsty = 'rgb(0,0,0)';
				let bcol = getRGBarr(fsty);
				bcol[0] = 255 - bcol[0];
				bcol[1] = 255 - bcol[1];
				bcol[2] = 255 - bcol[2];
				fsty = 'rgb('+bcol[0]+','+bcol[1]+','+bcol[2]+')';
				b_body = true;
				pnode.style.setProperty('background-color',fsty);
			}

			if (tags_to_skip.includes(tag)) return;

			node_count = map.get(node);

			let style = getComputedStyle(node);

			if (cfg.normalInc && cfg.forcePlhdr && !b_iimg[node_count] && !nodes_behind_inv.includes(node) && typeof m_fcol.get(node) == 'undefined' && typeof m_bcol.get(node) == 'undefined' && typeof m_bocol.get(node) == 'undefined') {
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
				} else {
				if (fg.length > 0) {
					let fgarr = getRGBarr(fg);
					if (typeof fgarr[3] == 'undefined') fgarr[3] = 1;
					if (typeof m_sty[fgarr] != 'undefined') {
						let fgr = m_sty[fgarr];
						node.style.setProperty('color','rgba('+fgr[0]+','+fgr[1]+','+fgr[2]+','+fgarr[3]+')','important');
						m_fcol.set(node, [fgr[0],fgr[1],fgr[2],fgarr[3]]);
					} else {
					let fgr = applyColorMatrix([255-fgarr[0], 255-fgarr[1], 255-fgarr[2]], g_m);
					fgbrt = calcBrightness([fgr[0],fgr[1],fgr[2],fgarr[3]]);
					if (fgbrt >= 0) {
						m_fcol.set(node, [fgr[0],fgr[1],fgr[2],fgarr[3]]);
						node.style.setProperty('color','rgba('+fgr[0]+','+fgr[1]+','+fgr[2]+','+fgarr[3]+')','important');
						m_sty[fgarr] = fgr;
					}
					}
				}
				if (bog.length > 0) {
					let fgarr = getRGBarr(bog);
					if (typeof fgarr[3] == 'undefined') fgarr[3] = 1;
					var fgr;
					if (typeof m_sty[fgarr] != 'undefined') {
						fgr = m_sty[fgarr];
					} else {
						fgr = applyColorMatrix([255-fgarr[0], 255-fgarr[1], 255-fgarr[2]], g_m);
					}
					bgbrt = calcBrightness([fgr[0],fgr[1],fgr[2],fgarr[3]]);
					if (bgbrt > 0) {
						m_bocol.set(node, [fgr[0],fgr[1],fgr[2],fgarr[3]]);
						if (bog == cs.borderColor)
							node.style.setProperty('border-color','rgba('+fgr[0]+','+fgr[1]+','+fgr[2]+','+fgarr[3]+')','important');
						else if (bog == cs.borderTopColor)
							node.style.setProperty('border-top-color','rgba('+fgr[0]+','+fgr[1]+','+fgr[2]+','+fgarr[3]+')','important');
						else if (bog == cs.borderBottomColor)
							node.style.setProperty('border-bottom-color','rgba('+fgr[0]+','+fgr[1]+','+fgr[2]+','+fgarr[3]+')','important');
						else if (bog == cs.borderLeftColor)
							node.style.setProperty('border-left-color','rgba('+fgr[0]+','+fgr[1]+','+fgr[2]+','+fgarr[3]+')','important');
						else if (bog == cs.borderRightColor)
							node.style.setProperty('border-right-color','rgba('+fgr[0]+','+fgr[1]+','+fgr[2]+','+fgarr[3]+')','important');
					}
				}
				if (bg.length > 0) {
					let fgarr = getRGBarr(bg);
					if (typeof fgarr[3] == 'undefined') fgarr[3] = 1;
					if (typeof m_sty[fgarr] != 'undefined') {
						let fgr = m_sty[fgarr];
						node.style.setProperty('background-color','rgba('+fgr[0]+','+fgr[1]+','+fgr[2]+','+fgarr[3]+')','important');
						m_bcol.set(node, [fgr[0],fgr[1],fgr[2],fgarr[3]]);
					} else {
					let fgr = applyColorMatrix([255-fgarr[0], 255-fgarr[1], 255-fgarr[2]], g_m);
					bgbrt = calcBrightness([fgr[0],fgr[1],fgr[2],fgarr[3]]);
					if (bgbrt > 0) {
						m_bcol.set(node, [fgr[0],fgr[1],fgr[2],fgarr[3]]);
						node.style.setProperty('background-color','rgba('+fgr[0]+','+fgr[1]+','+fgr[2]+','+fgarr[3]+')','important');
						m_sty[fgarr] = fgr;
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
					if (sh.length > 0 && sfz*2.75 < parseInt(sh))
						nheight = '';
					else if (sfz < cfg.threshold)
						nheight = ';height:' + h_sizes[sfz] + ';';
					let nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					if ((nsty+nheight+nwidth).length > 0)
						node.setAttribute('style', nsty + nheight + nwidth);
				}
			}

			let img_offset = 0;

			if (b_iimg[node_count])
				img_offset = 64;
			else if (nodes_behind_img.includes(node))
				img_offset = 64;

			if (cfg.start3)
			if (!node.hasAttribute(focalAnchors.attrNameContainer) && b_ctext[node_count] > 1) {
				if (typeof doc_obs != 'undefined' && doc_obs != null)
					doc_obs.disconnect();
				focalAnchors.toggleAnchorsByRef(node, false, cfg.skipLinks, cfg.weight);
				if (typeof doc_obs != 'undefined' && doc_obs != null)
					doc_obs.observe(document.body, { childList: true, subtree: true });
			}

			let is_xinput = node.type && /(checkbox|color|date|hidden|submit|image|month|radio|range)/i.test(node.type);
			let is_oinput = node.type && /(text|number|email|password|date|time|week|url|tel|search|month)/i.test(node.type);

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
						if (!nn_reg.test(nsty) || (cfg.input_border && cfg.underlineLinks))
							node.style.setProperty('filter',str_style,'important');
					}
					if (cfg.forceOpacity)
						node.style.setProperty('opacity',str_style2,'important');
					} else if (nn_reg.test(nsty) && cfg.advDimming && cfg.input_border && cfg.underlineLinks) {
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
						if (!/revert/.test(node.style.filter) || (cfg.input_border && cfg.underlineLinks))
							node.style.setProperty('filter',str_style,'important');
					}
					if (cfg.forceOpacity)
						node.style.setProperty('opacity',str_style2,'important');
					} else if (cfg.advDimming) {
						let nsty = node.getAttribute('style');
						if (nsty == null) nsty = '';
						if (/revert/.test(nsty) && cfg.input_border && cfg.underlineLinks) {
							nsty += 'filter:'+str_style+'!important;';
							node.setAttribute('style',nsty);
						//	node.style.setProperty('filter',str_style);
						}
					}
				}
			}
			}
			if (cfg.threshold > 0 && (!b_iimg[node_count] || b_ctext[node_count] > 0)) {
				let nsty = node.getAttribute('style');
				if (nsty == null) nsty = '';
				if (cfg.normalInc2) {
					let col = getRGBarr(style.color);
					if (typeof col[3] == 'undefined') col[3] = 1;
					col = [parseInt(col[0]), parseInt(col[1]), parseInt(col[2]), parseInt(col[3])];
					let cful = calcColorfulness(col);
					let pcol = col;
					if (typeof b_idone[style.color] == 'undefined' && col.length > 0 && cful >= 24) {
						let cmin = Math.min(col[0],col[1],col[2]);
						let cmax = Math.max(col[0],col[1],col[2]);
						if (cfg.forcePlhdr && n_inv > 2 && !nodes_behind_inv.includes(node) && !/invert/.test(style.filter) && cmin != col[1]) {
						if (col[0] >= col[2]) {
							let blu = col[1];
							col[1] = col[2];
							col[2] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						} else if (col[2] > col[0]) {
							let blu = col[1];
							col[1] = col[0];
							col[0] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						}
						} else if (cfg.forcePlhdr && n_inv > 2 && (nodes_behind_inv.includes(node) || /invert/.test(style.filter)) && cmax != col[1]) {
						if (col[2] >= col[0]) {
							let blu = col[1];
							col[1] = col[2];
							col[2] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						} else if (col[0] > col[2]) {
							let blu = col[1];
							col[1] = col[0];
							col[0] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						}
						} else if (cfg.forcePlhdr && n_inv <= 2  && cmax != col[2]) {
						if (col[0] > col[1]) {
							let blu = col[2];
							col[2] = col[0];
							col[0] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						} else if (col[1] > col[0]) {
							let blu = col[2];
							col[2] = col[1];
							col[1] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						}
						} else if (!b_forced && !cfg.forcePlhdr && cfg.advDimming && cmin != col[1]) {
						if (col[2] >= col[0]) {
							let blu = col[1];
							col[1] = col[2];
							col[2] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						} else if (col[0] > col[2]) {
							let blu = col[1];
							col[1] = col[0];
							col[0] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						}
						} else if (!cfg.forcePlhdr && cmax != col[2]) {
						if (col[0] > col[1]) {
							let blu = col[2];
							col[2] = col[0];
							col[0] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						} else if (col[1] > col[0]) {
							let blu = col[2];
							col[2] = col[1];
							col[1] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						}
						}
					} else if (typeof b_idone[style.color] != 'undefined') {
						pcol = b_idone[style.color];
					}
					if (/^rgba/.test(pcol)) {
						b_idone[style.color] = pcol;
						node.style.setProperty('color', pcol,'important');
					}
					col = getRGBarr(style.backgroundColor);
					if (typeof col[3] == 'undefined') col[3] = 1;
					col = [parseInt(col[0]), parseInt(col[1]), parseInt(col[2]), parseInt(col[3])];
					cful = calcColorfulness(col);
					pcol = col;
					if (typeof b_idone[style.backgroundColor] == 'undefined' && col.length > 0 && cful >= 24) {
						let cmin = Math.min(col[0],col[1],col[2]);
						let cmax = Math.max(col[0],col[1],col[2]);
						if (cfg.forcePlhdr && !nodes_behind_inv.includes(node) && !/invert/.test(style.filter) && cmin != col[2]) {
						if (col[1] >= col[0]) {
							let blu = col[2];
							col[2] = col[0];
							col[0] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						} else if (col[0] > col[1]) {
							let blu = col[2];
							col[2] = col[1];
							col[1] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						}
						} else if (!b_forced && !cfg.forcePlhdr && cfg.advDimming && cmax != col[2]) {
						if (col[0] >= col[1]) {
							let blu = col[2];
							col[2] = col[0];
							col[0] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						} else if (col[1] > col[0]) {
							let blu = col[2];
							col[2] = col[1];
							col[1] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						}
						} else if (cfg.forcePlhdr && (nodes_behind_inv.includes(node) || /invert/.test(style.filter)) && cmax != col[2]) {
						if (col[0] > col[1]) {
							let blu = col[2];
							col[2] = col[0];
							col[0] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						} else if (col[1] > col[0]) {
							let blu = col[2];
							col[2] = col[1];
							col[1] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						}
						} else if (!cfg.forcePlhdr && cmax != col[2]) {
						if (col[0] > col[1]) {
							if (col[0] > col[1]) {
							let blu = col[2];
							col[2] = col[0];
							col[0] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
						} else if (col[1] > col[0]) {
							let blu = col[2];
							col[2] = col[1];
							col[1] = blu;
							pcol = 'rgba('+col[0]+','+col[1]+','+col[2]+','+col[3]+')';
							}
						}
						}
					} else if (typeof b_idone[style.backgroundColor] != 'undefined') {
						pcol = b_idone[style.backgroundColor];
					}
					if (/^rgba/.test(pcol)) { 
						b_idone[style.backgroundColor] = pcol;
						node.style.setProperty('background-color', pcol,'important');
					}
				}
				if (!cfg.skipHeights && !is_xinput && b_ctext[node_count] > 2 && (node.getElementsByTagName('*').length < 4 || (cfg.start3 && node.hasAttribute(focalAnchors.attrNameContainer) && node.getElementsByTagName('*').length < 50)))
					node.setAttribute('h__', 2);
				if (cfg.makeCaps) {
					if (eng)
						node.style.setProperty('font-variant-caps', 'small-caps');
					else
						node.style.setProperty('text-transform', 'uppercase');
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
				}

				if (cfg.forcePlhdr && cfg.forceIInv && !b_noemo) {
				if (b_emo[node_count] != true && node.children.length < 10) {
					if (/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/umg.test(node.textContent)) {
					if (typeof doc_obs != 'undefined' && doc_obs != null)
					doc_obs.disconnect();
					let chldn = Array.from(node.children);
					for (let x=0; x < chldn.length; x++) { let ch = chldn[x]; b_emo[map.get(ch)] = true; }
					//let srt = node.innerHTML.replaceAll(/([\p{Emoji_Presentation}\p{Extended_Pictographic}]+)/umg, '<span style="filter:invert(1);">$1</span>');
					//invertEmojis(node);
					focalAnchors.toggleAnchorsByRef(node, true);
					//node.innerHTML = srt;
					b_emo[node_count] = true;
					if (typeof doc_obs != 'undefined' && doc_obs != null)
						doc_obs.observe(document.body, { childList: true, subtree: true });
					}
				}
				}
				if (/\b(INPUT|TEXTAREA|SELECT|BUTTON)/i.test(tag)) {
					if (!is_xinput) {
					if (node.textContent != null && node.textContent != '' && style.getPropertyValue('width') != null && style.getPropertyValue('width') != '') {
					let nwidth = ';width: calc( ' + style.getPropertyValue('width') + ' + ' + (cfg.size/2).toFixed(1) + '% )!important;';
					if (style.height && parseInt(style.height) <= parseInt(cfg.threshold)*2.25)
						nwidth += ';height:'+cfg.threshold*2.25+'px!important;';
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					nsty += nwidth;
					if (nsty.length > 0 && !cfg.skipHeights)
						node.setAttribute('style', nsty);
					}
					if (!node.disabled && cfg.strength % 2 == 1 && (/(TEXTAREA|TEXT)/i.test(tag) || is_oinput)) {
					let txtcolor = style.color;
					let bgcolor = style.backgroundColor;
					if (txtcolor == null || txtcolor.length < 1) txtcolor = 'rgb(0,0,0)';
					if (bgcolor == null || bgcolor.length < 1) bgcolor = 'rgb(255,255,255)';
					let txt_brt = calcBrightness(getRGBarr(txtcolor));
					let bg_brt = calcBrightness(getRGBarr(bgcolor));
					let brtdiff = Math.abs(txt_brt - bg_brt);
					if (brtdiff > 60 && (txt_brt || bg_brt))
					if (brtdiff > 60 && bg_brt < txt_brt)
						txtcolor = 'white';
					else if (brtdiff > 60 && bg_brt > txt_brt)
						txtcolor = 'black';
					let txtstyle = ';color:'+txtcolor+'!important;';
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
					if (cfg.forcePlhdr && cfg.forceIInv && !nn_reg.test(nsty)) nsty = ';filter:unset!important;'+nsty;
					nsty += txtstyle;
					node.setAttribute('style', nsty);
					}
					nsty = node.getAttribute('style');
					if (nsty == null) nsty = '';
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
			if (cfg.input_border && !(cfg.advDimming && cfg.underlineLinks)) {
				if(/(INPUT|TEXTAREA|SELECT)/i.test(tag) && is_oinput)
					node.setAttribute('b__', '');
			}

			if (b_ctext[node_count] < 1)
				return;

			let is_link  = tag === 'A';

			if (cfg.underlineLinks && !(cfg.advDimming && cfg.input_border))
			if (is_link) {
				node.setAttribute('u__', '');
				let txtcolor = style.color;
				if (txtcolor == null || txtcolor.length < 1) txtcolor = 'rgb(0,0,0)';
				let txt_brt = calcBrightness(getRGBarr(txtcolor));
				if (txt_brt <= 160) 
					txtcolor = 'rgb(0,0,0)';
				else
					txtcolor = 'rgb(255,255,255)';
				node.style.setProperty('color',txtcolor,'important');
				node.style.setProperty('text-decoration','underline');
			}

			let color = style.getPropertyValue('color');

			if (colors_to_skip.includes(color))
				return;

			let rgba_arr = getRGBarr(color);

			if (!rgba_arr)
				return;

			if (cfg.forceOpacity && rgba_arr[3] > 0 && rgba_arr[3] < 1) {
				rgba_arr[3] = 1;
				color = 'rgba('+rgba_arr[0]+','+rgba_arr[1]+','+rgba_arr[2]+','+rgba_arr[3]+')';
				node.style.setProperty('color',color,'important');
			}

			let bg_color        = getBgColor(pnode, style.backgroundColor);

			let fg_brt          = calcBrightness(rgba_arr);

			let bg_brt          = getBgBrightness(pnode, bg_color);

			let bg_threshold    = 190 - cfg.strength + img_offset;

			if (cfg.skipColoreds) {
				let contrast          = Math.abs(bg_brt - fg_brt);
				let fg_colorfulness   = calcColorfulness(rgba_arr);
				let min_contrast      = 40 + (cfg.strength / 2);
				let min_link_contrast = 80 + (cfg.strength / 2);
				let min_colorfulness  = 64;

				if (is_link)
					min_contrast = min_link_contrast;

				if ((contrast > min_contrast || cfg.strength > 200) && fg_colorfulness > min_colorfulness)
					return;
			}

			if (bg_brt > bg_threshold)
			if (!cfg.advDimming && !cfg.forcePlhdr) {
				let bstl = '';
				if (cfg.strength > 200 && fg_brt >= 95 && bg_brt <= 176 && 255-bg_brt > 19) {
					bstl = 'white';
				} else if (bg_brt >= 0 && bg_brt <= 176 && fg_brt > 176 && 255-bg_brt > 19) {
					bstl = 'white';
				} else if (bg_brt > 176 && bg_brt <= 255 && fg_brt <= 176) {
					bstl = 'black';
				} else if (bg_brt == 256 && fg_brt > 176) {
					bstl = 'white';
				} else if (bg_brt == 256) {
					bstl = 'black';
				}
				if (bstl.length > 0) {
				node.style.setProperty('color',bstl,'important'); }
			} else if (cfg.forcePlhdr && !cfg.advDimming) {
				let bstl = '';
				if (cfg.strength > 200 && fg_brt >= 95 && bg_brt <= 176 && 255-bg_brt > 19) {
					bstl = 'white';
				} else if (bg_brt >= 0 && bg_brt <= 176 && fg_brt > 176 && 255-bg_brt > 19) {
					bstl = 'white';
				} else if (bg_brt > 176 && bg_brt <= 255 && fg_brt <= 176) {
					bstl = 'black';
				} else if (bg_brt == 256 && fg_brt > 176 && !nodes_behind_inv.includes(node)) {
					bstl = 'white';
				} else if (bg_brt == 256 && fg_brt <= 176 && !nodes_behind_inv.includes(node)) {
					bstl = 'black';
				}
				if (bstl.length > 0) {
				node.style.setProperty('color',bstl,'important'); }
			} else {
				let bstl = '';
				if (cfg.strength > 200 && fg_brt >= 95 && bg_brt <= 176 && 255-bg_brt > 19) {
					bstl = 'white';
				} else if (fg_brt > 176 && 255-bg_brt > 19) {
					bstl = 'white';
				} else if (bg_brt == 256 && fg_brt > 176) {
					bstl = 'white';
				} else if (bg_brt == 256) {
					bstl = 'black';
				}
				if (bstl.length > 0) {
				node.style.setProperty('color',bstl,'important'); }
			}

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
	}

	process(nodes);

	t_end = Date.now();

	console.log('Time procesing = '+((t_end-t_start)/1000.0).toFixed(2) + ' seconds');
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

	if (typeof doc_obs != 'undefined' && doc_obs != null) {
		doc_obs.observe(document.body, { childList: true, subtree: true });
	} else {
		doc_obs = new MutationObserver(observer);
		doc_obs.observe(document.body, { childList: true, subtree: true });
	}
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

let storage = chrome.storage.local;

let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

let url_text = $('#url');
let refreshBtn = $("#refreshBtn");

let url_visible = false;

function init(tabs)
{
	let strSlider       = $("#strSlider");
	let strLabel        = $("#strLabel");

	let sizeSlider      = $("#sizeSlider");
	let sizeLabel       = $("#sizeLabel");

	let thresholdSlider = $("#thresholdSlider");
	let thresholdLabel  = $("#thresholdLabel");

	let brt_slider      = $('#brt-slider');
	let brt_label       = $('#brt-label');
	let con_slider      = $('#con-slider');
	let con_label       = $('#con-label');

	let weight_slider   = $('#weightSlider');
	let weight_label    = $('#weightLabel');

	let WLcheck         = $("#addWL");
	let BLcheck         = $("#addBL");
	let BLchecktemp     = $("#addBLtemp");

	let skipColoreds    = $("#skipColoreds");
	let skipHeadings    = $("#skipHeadings");
	let advDimming      = $("#advDimming");
	let input_border    = $("#outline");
	let forcePlhdr      = $("#forcePlhdr");
	let forceIInv       = $("#forceIInv");
	let forceOpacity    = $("#forceOpacity");
	let skipWhites      = $("#skipWhites");
	let makeCaps        = $("#makeCaps");
	let start3          = $("#start3");
	let skipLinks       = $("#skipLinks");
	let customCss       = $("#customCss");
	let customCssText   = $("#customCssText");
	let normalInc       = $("#normalInc");
	let normalInc2      = $("#normalInc2");
	let ssrules         = $("#ssrules");
	let skipNavSection  = $("#skipNavSection");
	let skipHeights     = $("#skipHeights");

	let optionsBtn      = $("#optionsBtn");
	let LightDark       = $("#LightDark");
	let presetSel       = $("#presetSelect");
	let presetSave      = $("#presetSave");
	let presetLoad      = $("#presetLoad");

	let url = tabs[0].url;

	let hostname = '';

	chrome.storage.local.get(["lightness", "default_size"]).then((result) => {
		if (result.lightness && result.default_size) {
			LightDark.innerText = 'Site lightness = '+result.lightness.toFixed(2);
			LightDark.innerText += '\nBrowser font size = '+result.default_size;
		}
	});

	if (url.startsWith('file://')) {
		hostname = url;
	} else {
		hostname = url.match(/\/\/(.+?)\//)[1];

		if (!url.startsWith('http'))
			showRefreshBtn();
	}

	url_text.innerText = hostname;

	strSlider.oninput = () => {
		strLabel.innerText = strSlider.value;
		chrome.storage.local.set( { abrightness:  (parseInt(con_slider.value)+100)+'%', acontrast:  (parseInt(brt_slider.value)+50)+'%', azoom: Math.abs(parseFloat(strSlider.value/100)).toFixed(2) } );
		if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); }
	}

	sizeSlider.oninput = () => { sizeLabel.innerText = sizeSlider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	thresholdSlider.oninput = () => { thresholdLabel.innerText = thresholdSlider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	brt_slider.oninput = () => {
		brt_label.innerText = (parseInt(brt_slider.value)+50);
		chrome.storage.local.set( { abrightness:  (parseInt(con_slider.value)+100)+'%', acontrast:  (parseInt(brt_slider.value)+50)+'%', azoom: Math.abs(parseFloat(strSlider.value/100)).toFixed(2) } );
		if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); }
	}
	con_slider.oninput = () => {
		con_label.innerText = (parseInt(con_slider.value)+100);
		chrome.storage.local.set( { abrightness:  (parseInt(con_slider.value)+100)+'%', acontrast:  (parseInt(brt_slider.value)+50)+'%', azoom: Math.abs(parseFloat(strSlider.value/100)).toFixed(2) } );
		if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); }
	}
			
	weight_slider.oninput = () => { weight_label.innerText = weight_slider.value; if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }
	customCssText.oninput = () => { if (!WLcheck.checked) { WLcheck.click(); } else { WLcheck.click();WLcheck.click(); } }

	optionsBtn.onclick = () =>  {
		if (chrome.runtime.openOptionsPage)
			chrome.runtime.openOptionsPage();
		else
			window.open(chrome.runtime.getURL('options.html'));
	};

	let settings = [
		"whitelist",
		"blacklist",
		"globalStr",
		"size",
		"sizeThreshold",
		"weight",
		"skipColoreds",
		"skipHeadings",
		"advDimming",
		"brightness",
		"contrast",
		"forcePlhdr",
		"forceIInv",
		"forceOpacity",
		"normalInc",
		"normalInc2",
		"ssrules",
		"skipWhites",
		"makeCaps",
		"start3",
		"skipLinks",
		"skipNavSection",
		"skipHeights",
		"underlineLinks",
		"input_border",
		"customCss",
		"customCssText",
		"presetNumber"
	];

	let start = settings =>
	{
		let whitelist = settings.whitelist || [];
		let blacklist = settings.blacklist || [];

		let item = settings;

		if (blacklist.findIndex(o => o.url === hostname) > -1) {
			let idx = whitelist.findIndex(o => o.url === hostname);
			if (idx < 0) {
				BLcheck.checked = true;
				BLchecktemp.checked = false;
			} else {
				BLchecktemp.checked = true;
				BLcheck.checked = false;
			}
		} else {
			let idx = -1 ;
			idx = whitelist.findIndex(o => o.url === '#preset'+ item.presetNumber);

			if (idx <= 0)
				idx = whitelist.findIndex(o => o.url === hostname);

			if (idx > -1) {
				item = whitelist[idx];

				WLcheck.checked = true;
				BLcheck.checked = false;
			}
		}

		strSlider.value          = item.strength || item.globalStr;
		strLabel.innerText       = item.strength || item.globalStr;
		sizeSlider.value         = item.size || 0;
		sizeLabel.innerText      = item.size || 0;
		thresholdSlider.value    = item.threshold || item.sizeThreshold || 0;
		thresholdLabel.innerText = item.threshold || item.sizeThreshold || 0;
		weightSlider.value       = item.weight;
		weightLabel.innerText    = item.weight;
		brt_slider.value         = item.brightness || 50;
		brt_label.innerText      = (parseInt(item.brightness)+50) || 100;
		con_slider.value         = item.contrast || 0;
		con_label.innerText      = (parseInt(item.contrast)+100) || 100;
		presetSel.value          = parseInt(item.presetNumber) || 0;

		skipHeadings.checked     = item.skipHeadings;
		skipColoreds.checked     = item.skipColoreds;
		advDimming.checked       = item.advDimming;
		input_border.checked     = item.input_border;
		forcePlhdr.checked       = item.forcePlhdr;
		forceIInv.checked        = item.forceIInv;
		forceOpacity.checked     = item.forceOpacity;
		skipWhites.checked       = item.skipWhites;
		makeCaps.checked         = item.makeCaps;
		start3.checked           = item.start3;
		skipLinks.checked        = item.skipLinks;
		normalInc.checked        = item.normalInc;
		normalInc2.checked       = item.normalInc2;
		ssrules.checked          = item.ssrules;
		skipNavSection.checked   = item.skipNavSection;
		skipHeights.checked      = item.skipHeights;
		underlineLinks.checked   = item.underlineLinks;
		customCss.checked        = item.customCss;
		customCssText.value      = item.customCssText || '';
		
		if(!advDimming.checked && !forcePlhdr.checked) {
			$('#brt-div').style.display ='none';
			$('#con-div').style.display ='none';
		}
		if (!forcePlhdr.checked) {
			$('#iinv-div').style.display = 'none';
			$('#norm-div').style.display = 'none';
		}
		if (!start3.checked)
			$('#skiplinks-div').style.display = 'none';
		else
			$('#skiplinks-div').style.display = 'block';
		if (!customCss.checked) {
			$('#custom-text-div').style.display = 'none';
		} else {
			$('#custom-text-div').style.display = 'block';
			$('#customCssText').value = customCssText.value;
		}

		let getOptions = () => {
			let wl_item = {
				url:            hostname,
				strength:       strSlider.value,
				size:           sizeSlider.value,
				threshold:      thresholdSlider.value,
				weight:         weightSlider.value,
				brightness:     brt_slider.value,
				contrast:       con_slider.value,
				skipHeadings:   skipHeadings.checked,
				skipColoreds:   skipColoreds.checked,
				advDimming:     advDimming.checked,
				forcePlhdr:     forcePlhdr.checked,
				forceIInv:      forceIInv.checked,
				forceOpacity:   forceOpacity.checked,
				normalInc:      normalInc.checked,
				normalInc2:     normalInc2.checked,
				ssrules:        ssrules.checked,
				skipWhites:     skipWhites.checked,
				makeCaps:       makeCaps.checked,
				start3:         start3.checked,
				skipLinks:      skipLinks.checked,
				skipNavSection: skipNavSection.checked,
				skipHeights:    skipHeights.checked,
				underlineLinks: underlineLinks.checked,
				input_border:   input_border.checked,
				customCss:      customCss.checked,
				customCssText:  customCssText.value,
				presetNumber:	presetSel.value
			}

			return wl_item;
		}

		presetSave.onclick = () => {
			hostname = '#preset'+ presetSel.value;
			whitelist = updateList(getOptions(),true, true, presetSel.value);
			showRefreshBtn();
		};

		presetLoad.onclick = () => {
			let idx = whitelist.findIndex(o => o.url === '#preset'+presetSel.value);
			if (idx > -1) {
			item = whitelist[idx];

			strSlider.value          = item.strength || item.globalStr;
			strLabel.innerText       = item.strength || item.globalStr;
			sizeSlider.value         = item.size || 0;
			sizeLabel.innerText      = item.size || 0;
			thresholdSlider.value    = item.threshold || item.sizeThreshold || 0;
			thresholdLabel.innerText = item.threshold || item.sizeThreshold || 0;
			weightSlider.value       = item.weight;
			weightLabel.innerText    = item.weight;
			brt_slider.value         = item.brightness || 50;
			brt_label.innerText      = (parseInt(item.brightness)+50) || 100;
			con_slider.value         = item.contrast || 0;
			con_label.innerText      = (parseInt(item.contrast)+100) || 100;
			presetSel.value          = parseInt(item.presetNumber);

			skipHeadings.checked     = item.skipHeadings;
			skipColoreds.checked     = item.skipColoreds;
			advDimming.checked       = item.advDimming;
			input_border.checked     = item.input_border;
			forcePlhdr.checked       = item.forcePlhdr;
			forceIInv.checked        = item.forceIInv;
			forceOpacity.checked     = item.forceOpacity;
			skipWhites.checked       = item.skipWhites;
			makeCaps.checked         = item.makeCaps;
			start3.checked           = item.start3;
			skipLinks.checked        = item.skipLinks;
			normalInc.checked        = item.normalInc;
			normalInc2.checked       = item.normalInc2;
			ssrules.checked          = item.ssrules;
			skipNavSection.checked   = item.skipNavSection;
			skipHeights.checked      = item.skipHeights;
			underlineLinks.checked   = item.underlineLinks;
			customCss.checked        = item.customCss;
			customCssText.value      = item.customCssText || '';

			WLcheck.checked = true;	
			WLcheck.click();

			showRefreshBtn();
			return;
			}
		};

		WLcheck.onclick = () => {
			let is_checked = WLcheck.checked;

			whitelist = updateList(getOptions(), true, is_checked);

			if (is_checked) {
				let idx = blacklist.findIndex(o => o.url === hostname);

				if(idx > -1)
					blacklist = updateList({ url: hostname }, false, false);
			}
		};

		BLchecktemp.onclick = () => {
			let is_checked = BLchecktemp.checked;

			blacklist = updateList({ url: hostname }, false, is_checked);

			if (is_checked) {
				BLcheck.checked = false;
				WLcheck.checked = true;
			}
		};

		BLcheck.onclick = () => {
			let is_checked = BLcheck.checked;

			blacklist = updateList({ url: hostname }, false, is_checked);

			if (is_checked) {
				let idx = whitelist.findIndex(o => o.url === hostname);

				if(idx > -1)
					whitelist = updateList(getOptions(), true, false);
			}
		};

		$$('.option').forEach(checkbox => {
			checkbox.onclick = () => {
				if (checkbox.id === 'WL') {
					if (WLcheck.checked) {
						WLcheck.checked = false;
					} else {
						WLcheck.checked = true;
					}
					WLcheck.onclick();
					return;
				}
				if (checkbox.id === 'BL') {
					if (BLcheck.checked) {
						BLcheck.checked = false;
					} else {
						BLcheck.checked = true;
					}
					BLcheck.onclick();
					return;
				}
				if (checkbox.id === 'BLtemp') {
					if (BLchecktemp.checked) {
						BLchecktemp.checked = false;
					} else {
						BLchecktemp.checked = true;
					}
					BLchecktemp.onclick();
					return;
				}
				if (checkbox.id  === 'skiplinks') {
					const skiplinks_div = document.querySelector('#skiplinks-div');

					if (start3.checked)
						skiplinks_div.style.display = 'block';
					else
						skiplinks_div.style.display = 'none';
				}

				if (checkbox.id  === 'custom-div') {
					const customText_div = document.querySelector('#custom-text-div');

					if (customCss.checked) {
						customText_div.style.display = 'block';
						$('#customCssText').value = customCssText.value;

					} else {
						customText_div.style.display = 'none';
					}
				}

				if (checkbox.id  === 'forceRev') {
					let iinv_div = document.querySelector('#iinv-div');
					let norm_div = document.querySelector('#norm-div');
					let brt_div = document.querySelector('#brt-div');
					let con_div = document.querySelector('#con-div');

					if (forcePlhdr.checked) {
						iinv_div.style.display = 'block';
						norm_div.style.display = 'block';
						brt_div.style.display = 'flex';
						con_div.style.display = 'flex';
					} else if (!advDimming.checked && !forcePlhdr.checked) {
						iinv_div.style.display = 'none';
						norm_div.style.display = 'none';
						brt_div.style.display = 'none';
						con_div.style.display = 'none';
					} else if (advDimming.checked) {
						iinv_div.style.display = 'none';
						norm_div.style.display = 'none';
						brt_div.style.display = 'flex';
						con_div.style.display = 'flex';
					}
				}

				if (checkbox.id === 'adv-mode') {
					let brt_div = document.querySelector('#brt-div');
					let con_div = document.querySelector('#con-div');

					if (!advDimming.checked)
						ssrules.checked = false;

					if (advDimming.checked || forcePlhdr.checked) {
						brt_div.style.display = 'flex';
						con_div.style.display = 'flex';
					} else {
						brt_div.style.display = 'none';
						con_div.style.display = 'none';
					}
				}

				whitelist = updateList(getOptions(), true, true);

				if (BLcheck.checked || BLchecktemp.checked)
					blacklist = updateList({ url: hostname }, false, false);
			}
		});

		let updateList = (item, is_wl, add, pno = 0) => {
			let list;
			let list_name;
			let check;

			if (is_wl) {
				list = whitelist;
				list_name = 'whitelist';
				check = WLcheck;
			} else {
				list = blacklist;
				list_name = 'blacklist';
				check = BLcheck;
			}

			let idx = -1;
			idx = list.findIndex(o => o.url === '#preset'+ pno);
			if (idx <= 0)
				idx = list.findIndex(o => o.url === item.url);

			if (add) {
				if (idx > -1)
					list[idx] = item;
				else
					list.push(item);

				check.checked = true;
			}
			else if (idx > -1) {
				list.splice(idx, 1);

				check.checked = false;
			}

			storage.set({ [list_name]: list });

			showRefreshBtn();

			return list;
		};
	}

	storage.get(settings, start);
};

if (typeof chrome.tabs !== 'undefined') {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	init(tabs);
});
}


function showRefreshBtn()
{
	if (url_visible)
		return;

	url_text.style.opacity = 0;
	url_text.style.zIndex = "2";

	refreshBtn.style.opacity = 1;
	refreshBtn.style.zIndex = "3";
	refreshBtn.style.cursor = "pointer";

	refreshBtn.onclick = () => chrome.tabs.reload();

	url_visible = true;
}

// issue: in dev mode web root is /srv/web/resources
//import { map as createMap, tileLayer, marker, Icon, divIcon } from '/assets/lib/leaflet.js';
//import { LitElement, html, until, unsafeHTML } from '/assets/lib/lit.js';
import { LitElement, html, until, unsafeHTML } from '/assets/lib/lit-3.1.0-all.js';
import '/assets/lib/leaflet-1.9.4.js';
//import { map as createMap, tileLayer, marker, Icon, divIcon } from './lib-leaflet.js';
//import { map as createMap, tileLayer, marker, Icon, divIcon } from './lib-leaflet-src.esm.js';

class UnMapLeafletLit extends LitElement {
	static properties = {
		lat: { type: Number, attribute: true },
		lon: { type: Number, attribute: true },
		pin: { type: String, attribute: true, reflect: true }, // "false", "svg-triangle", "svg-round", "div", "png-default"
		pintext: { type: String, attribute: true, reflect: true },
	};

	constructor() {
		super();
		this.imgDir = "/assets/img/leaflet";
		// default values
		this.lat = 48;
		this.lon = 9;
		this.zoom = 3; // no att yet
	}

	createRenderRoot() {
		return this;
	}

	firstUpdated() {
		this.coords = [this.lat, this.lon];
		//console.log('this.coords: ', this.coords)
		const mapEl = this.shadowRoot.querySelector("#map");
		let map = createMap(mapEl);

		map.setView(this.coords, this.zoom);
		setTimeout(() => {
			map.flyTo(this.coords, 11);
		}, 1000);

		// tileLayer
		let urlTemplate = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
		tileLayer(urlTemplate, {
			minZoom: 4,
			maxZoom: 19,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map);

		// marker & icon
		
		if (this.pin && this.pin !== 'false' && this.pin !== 'none') { // if pin attribute available
			let icon = this.createIcon(this.pin, this.pintext)
			if (icon) { // if icon available
				let markerLayer = marker(this.coords, { icon: icon })
				markerLayer.addTo(map)
				if (this.pintext) { // if text available
					markerLayer.bindPopup(this.pintext).openPopup() // Binds a popup to the layer
				}
			}
		}
	}

	render() {
		return html` <div id="map"></div> `;
	}

	createPNGicon() {
		/* not working yet */
		let customIcon = icon({
			iconUrl: `${this.imgDir}/marker-icon.png`,
			iconSize: [25, 41],
			iconAnchor: this.coords,
			popupAnchor: [-3, -76],
			shadowUrl: `${this.imgDir}/marker-shadow.png`,
			shadowSize: [68, 95],
			shadowAnchor: this.coords
		});

		return customIcon;
	}

	createIcon(pinType, pinText) {
		
		let icon

		if (pinType.includes('div') && pinText) { // no div-icon without text
			icon = divIcon({className: 'div-icon'});
		}
		else if (pinType.includes('svg')) {
			icon = this.createSVGIcon(pinType)
		}
		else if (pinType.includes('png')) {
			/* not working yet */
			Icon.Default.imagePath = `${this.imgDir}/`;	// 'png-default'
		} 
		else {
			icon = false
		}

		return icon
	}

	createSVGIcon(iconType) {

		let iconHTML

		if (iconType === 'svg-triangle') {
			iconHTML = `
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg">
				width="24"
				height="40"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				<path d="M0 0 L50 100 L100 0 Z" fill="#7A8BE7"></path>
			</svg>`;
		}

		if (iconType === 'svg-round') {
			iconHTML = `
			<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="24" height="40" viewBox="0 0 842.000000 1280.000000" preserveAspectRatio="xMidYMid meet">
				<metadata>
				Created by potrace 1.15, written by Peter Selinger 2001-2017
				</metadata>
				<g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
				<path d="M3965 12790 c-1194 -72 -2292 -638 -3037 -1567 -464 -578 -768 -1269 -877 -1993 -64 -428 -60 -921 10 -1327 177 -1027 705 -1921 1524 -2580 188 -151 525 -371 687 -449 20 -9 40 -24 43 -33 4 -9 107 -281 230 -606 600 -1585 1092 -2825 1575 -3968 l114 -268 114 3 115 3 847 2435 848 2435 118 68 c1022 586 1747 1543 2023 2667 122 500 149 1061 75 1585 -33 231 -96 499 -170 722 -490 1472 -1747 2554 -3274 2818 -298 51 -674 73 -965 55z"/>
				</g>
				<style xmlns="" id="autoconsent-prehide"/>
			</svg>`;
		}

		const svgIcon = divIcon({
			html: iconHTML,
			className: "",
			iconSize: [24, 40],
			iconAnchor: [12, 40],
		});

		return svgIcon;
	}
}

customElements.define("un-map-leaflet-lit", UnMapLeafletLit);

// issue: in dev mode web root is /srv/web/resources
//import { map as createMap, tileLayer, marker, Icon, divIcon } from '/assets/lib/leaflet.js';
//import { LitElement, html, until, unsafeHTML } from '/assets/lib/lit.js';
//import 'http://127.0.0.1:8000/assets/lib/leaflet/leaflet-1.9.4.js'
import * as L from 'leaflet'

export default class MapLeaflet extends HTMLElement {
	/*
		@Attributes:
		[data-fly-to-animation] // 'true', 'false'
		[data-lat]
		[data-lon]
		[data-pin] // 'false', 'svg-triangle', 'svg-round', 'div', 'png-default'
		[data-pintext]
		[data-theme]
		[data-zoom] // no att yet
	*/
	
	constructor() {
		super();
		this.log = {
			lifecycle: true,
			events: false
		}

		if (this.log.lifecycle) console.log('constructor()')
	}

	connectedCallback() {

		if (this.log.lifecycle) console.log('connectedCallback()')

		const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
		
		this.imgDir = '/assets/img/leaflet'
		/* init public */
		this.dataset.theme ??= this.parentElement.dataset.theme ?? document.documentElement.dataset.theme
		this.dataset.lat ??= 48
		this.dataset.lon ??= 9
		this.dataset.zoom ??= 13 
		this.dataset.flyToAnimation ??= 'true'
		this.dataset.flyToAnimation = (isMobile) ? 'false' : this.dataset.flyToAnimation

		/* init private */
		this.initialZoom = 6
		this.coords = [this.dataset.lat, this.dataset.lon];

		/* html */
		this.innerHTML = /* html */`<div id="map"></div>`
		this.map = this.querySelector("#map") ?? document.createElement('div')
		this.map.id ??= 'map'

		/* leaflet */
		this.map = L.map(this.map)
		const firstZoom = (this.dataset.flyToAnimation === 'true') ? this.initialZoom : this.dataset.zoom
		this.map.setView(this.coords, this.initialZoom, { animate: undefined, duration: 0.25 })
		if (this.dataset.flyToAnimation === 'true') {
			setTimeout(() => {
				this.map.flyTo(this.coords, this.dataset.zoom);
			}, 1000);	
		}

		// tileLayer
		let urlTemplate = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
		L.tileLayer(urlTemplate, {
			minZoom: 4,
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(this.map);

		// marker & icon
		
		if (this.dataset.pin && !['false', 'none'].includes(this.dataset.pin)) { // if pin attribute available
			const icon = this.createIcon(this.dataset.pin, this.dataset.pintext)
			if (icon) { // if icon available
				const marker = L.marker(this.coords, { icon: icon })
				marker.addTo(this.map)
				if (this.dataset.pintext) { // if text available
					marker.bindPopup(this.dataset.pintext).openPopup() // Binds a popup to the layer
				}
			}
		}

		this.map.invalidateSize(true)
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
			icon = L.divIcon({ className: 'div-icon' });
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
			iconHTML = /* html */`
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
			iconHTML = /* html */`
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

customElements.define('map-leaflet', MapLeaflet);

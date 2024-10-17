import Button from '../button/button.js';
import Details from '../details/details.js';

// Create our shared stylesheet:
const sheet = new CSSStyleSheet();
sheet.replaceSync('ce-native { display: contents; }')
document.adoptedStyleSheets.push(sheet)

export default class CeNative extends HTMLElement {
	/*
		@Attributes:
			[data-is] // 'button', 'details'
	*/

	_log = false

	constructor() {
		super()
		if (this._log) console.log('constructor()')
	}

	connectedCallback() {
		if (this._log) console.log('connectedCallback()')
			if (!this.dataset.is && this.children.length === 1) {
				this.dataset.is = this.children[0].tagName.toLowerCase()
			}
			switch (this.dataset.is) {
				case 'button':
					this.element = this.querySelector('button')
					new Button({ element: this.element })
					break;
				case 'details':
					this.element = this.querySelector('details')
					new Details({ element: this.element })
					break;
				default:
					console.error(`this.dataset.is = ${this.dataset.is}`)
			}


	}
}

customElements.define('ce-native', CeNative)
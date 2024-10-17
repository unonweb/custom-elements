import { LitElement, css, html } from 'lit';
import Button from '../button/button';
import DetailsController from '../_controllers/DetailsController';

// shared stylesheet:
const styles = css`
	lit-native { 
		display: contents; 
	}`

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles)
document.adoptedStyleSheets.push(sheet)

export default class LitNative extends LitElement {

	_element

	static properties = {
		log: { type: Boolean },
		is: { type: String, reflect: true }
	}

	constructor() {
		super()
		if (this.log) console.log('constructor()')
	}

	createRenderRoot() {
		return this
	}

	connectedCallback() {
		super.connectedCallback()
		if (this.log) console.log('connectedCallback()')

		if (!this.is && this.children.length === 1) {
			this.is = this.children[0].tagName.toLowerCase()
		}
		switch (this.is) {
			case 'button':
				this._element = this.querySelector('button')
				new Button({ element: this._element })
				break;
			case 'details':
				
				//new Details(this._element)
				new DetailsController(this, {
					details: this.querySelector('details'),
					summary: this.querySelector('details summary'),
					content: this.querySelector('details .content'),
				})
				break;
			default:
				console.error(`this.is = ${this.is}`)
		}
	}

	/* render() {

	} */
}

customElements.define('lit-native', LitNative)
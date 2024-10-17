import { LitElement } from 'lit';
import StickyControllerAttributes from '../_controllers/StickyController.attributes';
import StickyController from '../_controllers/StickyController';

export default class LitFooter extends LitElement {
	static properties = {
		...StickyControllerAttributes,
	}

	static dictionary = {}

	static translate(key) {
		this._lang ??= (document.documentElement.lang !== '') ? document.documentElement.lang : 'de'
		if (!this.dictionary[key]) {
			return 'undefined'
		}
		return this.dictionary[key][this._lang]
	}

	constructor() {
		super()
	}

	connectedCallback() {
		super.connectedCallback()

		// controllers
		if (this.sticky && this.sticky !== 'false') {
			this._sticky = new StickyController(this, {
				mode: this.sticky
			})
		}
	}
}

window.customElements.define('lit-footer', LitFooter);
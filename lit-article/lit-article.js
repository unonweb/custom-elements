import { LitElement, html, css } from 'lit';
import CollapsibleController from '../_controllers/CollapsibleController';

export default class LitArticle extends LitElement {
	static properties = {
		collapsible: { type: String, },
		collapseState: { type: String, attribute: 'collapse-state' }
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
		if (this.collapsible == 'true') {
			this._collapsible = new CollapsibleController(this, {
				log: true,
				trigger: this.querySelector('[collapse-trigger]'),
				content: this.querySelector('[collapse-content]')
			})
		}		
	}

	createRenderRoot() {
		return this
	}
}

window.customElements.define('lit-article', LitArticle);
import { LitElement, html } from 'lit'
import StickyController from '../_controllers/StickyController'
import ToggleController from '../_controllers/ToggleController'
import ToggleControllerAttributes from '../_controllers/ToggleController.attributes'
import StickyControllerAttributes from '../_controllers/StickyController.attributes'

export default class LitNav extends LitElement {

	_log = false

	static properties = {
		// sticky controller
		...StickyControllerAttributes,
		...ToggleControllerAttributes,
	}

	static dictionary = {
		'primary-nav': {
			de: 'Hauptmenü',
			en: 'Primary Navigation'
		},
	}

	static translate(key) {
		this._lang ??= (document.documentElement.lang !== '') ? document.documentElement.lang : 'de'
		if (!this.dictionary[key]) {
			return 'undefined'
		}
		return this.dictionary[key][this._lang]
	}

	constructor() {
		super()
		if (this._log) console.log(`constructor() ${this.tagName}`)
	}

	connectedCallback() {
		super.connectedCallback()
		if (this._log) console.log(`connectedCallback()`)
		// init public
		this.role ??= 'navigation'
		//this.theme ??= document.documentElement.theme

		// elements
		this._content = this.querySelector(':scope > .content')

		// sticky controller
		if (this.sticky && this.sticky !== 'false') {
			this._sticky = new StickyController(this, {
				mode: this.sticky
			})
		}
		// toggle controller
		if (this.toggle && this.toggle !== 'false') {
			this._toggle = new ToggleController(this, { 
				on: this.toggleOn, 
				off: this.toggleOff, 
				overlay: this.toggleOverlay, 
				anim: this.toggleAnim,
				state: this.toggleState ?? 'off',
				dest:  this.toggleDest,
				label: this.toggleLabel ?? LitNav.translate('primary-nav')
			})
		}
	}

	createRenderRoot() {
		return this
	}

	render() {
		if (this._toggle) return this._toggle.render()
		/* return html`
			${(this._toggle) ? this._toggle.render() : ''}
			${(this._content) ? this._content : ''}` */
	}

	firstUpdated() {
		if (this._content) {
			const anchors = this.querySelectorAll('a') ?? []
			let lang = (document.documentElement.lang !== '') ? document.documentElement.lang : 'de'
			anchors.forEach(a => {
				if (a.href === window.location.href || a.href === `${window.location.href}${lang}/`) {
					a.classList.add('current')
					a.parentElement.classList.add('current')
					a.ariaCurrent = 'page'
				}
			})
		}
	}
}
window.customElements.define('lit-nav', LitNav);
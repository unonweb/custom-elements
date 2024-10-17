import { LitElement, html } from 'lit';

export default class ScrollTo extends LitElement {

	static properties = {
		destID: { type: String, attribute: 'dest-id' } // <id>, top
	}

	static dictionary = {
		'scroll-back': {
			de: 'Zurück scrollen',
			en: 'Scroll Back'
		}
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
	}

	connectedCallback() {
		super.connectedCallback()
		this.destID ??= 'top'
		this.lang = document.documentElement._lang
		this.lang = (this.lang === '') ? 'de' : this.lang

		// get elements
		this._anchor = this.querySelector(':scope > a')
	}

	createRenderRoot() {
		return this
	}

	render() {
		if (this._anchor) {
			return this._anchor
		}
		else {
			return html`
				<a
					href="#${this.destID}" 
					class="scroll-to"
					aria-label="${ScrollTo.translate(`scroll-back`)}"
					@click=${this._scrollToDest}>&#10148;
				</a>`
		}
	}

	firstUpdated() {
		this._anchor ??= this.querySelector(':scope > a')
		this._anchor.href ??= `#${this.destID}`
		this._anchor.className ??= 'scroll-to'
		this._anchor.ariaLabel ??= ScrollTo.translate('scroll-back')
		this._anchor.addEventListener('click', this._scrollToDest)
	}

	_scrollToDest = (evt) => {
		// @click
		// this.destID
		evt.preventDefault()
		if (this.destID === 'top') {
			window.scrollTo({ top: 0, behavior: 'smooth' }) // crolls to a particular set of coordinates inside a given element. 	
		}
		else {
			this._destElement ??= document.getElementById(this.destID)
			this._destElement.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
		}
	}
}

window.customElements.define('scroll-to', ScrollTo)
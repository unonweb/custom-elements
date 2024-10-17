import DropDown from '../drop-down/drop-down'
import Sticky from '../_classes/Sticky'
import CeBase from '../_classes/CeBase'

export default class CeNav extends CeBase {
	/*
		@Attributes:
			[data-sticky]	// smart, true
	*/

	//static observedAttributes = ['data-theme']

	static dictionary = {
		'primary': {
			de: 'Hauptmenü',
			en: 'Primary Navigation'
		},
	}

	_log = false
	_anchors

	constructor() {
		super()
	}

	connectedCallback() {
		super.connectedCallback()

		this.role ??= 'navigation'
		this.ariaLabel ??= CeNav.translate('primary')

		this._getElements()
		this._configElements()
		if (this.dataset.sticky) {
			new Sticky(this)
		}
	}

	attributeChangedCallback(attribute, oldValue, newValue) {
		super.attributeChangedCallback(attribute, oldValue, newValue)
	}

	_getElements() {
		//this._content = this.querySelector(':scope > .content')
		this._anchors = this.querySelectorAll('a')
	}

	_configElements() {
		if (this._anchors) {
			this._anchors.forEach(a => {
				if (a.href === window.location.href || a.href === `${window.location.href}${this._lang}/`) {
					a.classList.add('current')
					a.parentElement.classList.add('current')
					a.ariaCurrent = 'page'
				}
			})
		}
	}
}

window.customElements.define('ce-nav', CeNav)
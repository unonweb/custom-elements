import CeBase from '../_classes/CeBase.js'
import DropDown from '../drop-down/drop-down.js'
import Button from '../button/button.js'

class LangSwitch extends CeBase {
	
	_log = false

	static _exHTML = /* html */`
		<drop-down>
			<button aria-label="menu button" aria-haspopup="menu" aria-expanded="false" aria-controls="dropdown-menu">Choose Language <span class="icon">&#9660;</span></button>
			<ul class="content" role="menu">
				<li><button value="de">Deutsch</button></li>
				<li><button value="en">English</button></li>
			</ul>
		</drop-down>`

	static dictionary = {
		'switch-lang': {
			de: 'Sprache wechseln',
			en: 'Switch Language'
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
		// supported languages
		this._supported = ['de', 'en']
		let langStr = this._supported.reduce((accumulator, current) => `${accumulator}|${current}`) // 'de|en|es'
		this._supportedLangRegex = new RegExp(`/(${langStr})/`, 'g')
	}

	connectedCallback() {
		super.connectedCallback()

		// elements
		this._getElements()
		this._configElements()
		

		// event listeners
		this.querySelectorAll('li > button').forEach(el => el.addEventListener('click', this._getNewLang))
	}

	_getElements() {
		this._content = this.querySelector(':scope .content')
		this._button = this.querySelector(':scope button')
	}

	_configElements() {
		
	}

	render() {
		return html`
			${this._toggle.render()}
			${(this._content) ? this._content : ''}`
	}

	_getNewLang = (evt) => {
		switch (evt.target.textContent) {
			case 'Deutsch':
			case 'De':
			case 'de':
				window.localStorage.setItem('userLang', 'de')
				this._switchLang('de')
				break
			case 'English':
			case 'En':
			case 'en':
				window.localStorage.setItem('userLang', 'en')
				this._switchLang('en')
				break
		}
	}

	_switchLang(destLang) {
		//let prefLang = window.localStorage.getItem('userLang') ?? _getBrowserLang() // get prefered language either by user setting or by browser config
		//console.log('prefLang: ', prefLang)
		// wit 'g' flag 
		// - returns all matches no capturing groups
		let hrefNew
		const isHome = location.href === `${location.origin}/`
		const isLocalized = location.href.match(this._supportedLangRegex) !== null

		if (isHome) {
			// homepage
			hrefNew = `${location.origin}/${destLang}` // --> localized homepage
		}
		else if (isLocalized) {
			// localized subpage
			const currLang = location.href.match(this._supportedLangRegex)[0] // '/de/'
			if (this._log) console.log('localization: ', currLang)
			// extract lang from url
			if (destLang === currLang) return
			else {
				hrefNew = location.href.replace(currLang, `/${destLang}/`) // --> localized subpage
			}
		}
		else {
			// non-localized subpage
			hrefNew = location.href.replace(location.origin, `${location.origin}/${destLang}`) // --> localized subpage
		}

		location.href = hrefNew // redirect
	}
}

window.customElements.define('lang-switch', LangSwitch);
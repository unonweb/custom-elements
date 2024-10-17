export default class CeBase extends HTMLElement {

	static observedAttributes = ['data-theme']

	static ceURL = 'http://127.0.0.1:8000/custom-elements/prod'

	static translate(key) {
		let lang = (document.documentElement.lang !== '') ? document.documentElement.lang : 'de'
		if (!this.dictionary[key]) {
			return 'undefined'
		}
		return this.dictionary[key][lang]
	}

	static _setDomain() {
		if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
			return 'localhost'
		}
		else if (location.hostname.includes('unonweb')) {
			return 'unonweb'
		}
		else {
			return 'production'
		}
	}

	static domain = this._setDomain()

	_lang = (document.documentElement.lang !== '') ? document.documentElement.lang : 'de'
	_log = false
	_tagName
	_stylePath


	constructor() {
		super()
		//if (this._log) console.log('constructor()', this._tagName)
		
		this.dataset.theme ??= document.documentElement.dataset.theme ?? document.documentElement.theme
		this._tagName = this.tagName.toLowerCase()
		
		// check style sheet
		let styleFile = `${this._tagName}.css`
		let stylePath = `${CeBase.ceURL}/${this._tagName}/${styleFile}`
		let isStyleLoaded = this._isStyleLoaded({ filename: styleFile })
		if (isStyleLoaded === false) {
			console.warn('Style sheet was not loaded', stylePath)
			if (CeBase.domain === 'localhost') {
				this._loadStyle(stylePath)
			}
		}
	}

	connectedCallback() {
		if (this._log) console.log('connectedCallback()', this._tagName)
	}

	attributeChangedCallback(attribute, oldValue, newValue) {
		if (this._log) console.log('attributeChangedCallback()', this._tagName)

		if (oldValue === null) return // prevent to be called on initialization
		if (oldValue === newValue) return

		if (CeBase.domain === 'localhost') {
			if (attribute === 'data-theme') {
				let themeFile = `${this._tagName}.${newValue}.css`
				let themePath = `${CeBase.ceURL}/${this._tagName}/themes/${themeFile}`
				let isLoaded = this._isStyleLoaded({ filename: themeFile })
				if (isLoaded === false) {
					this._loadStyle(themePath)
				}
			}
		}
	}

	_isStyleLoaded({ path, filename }) {
		let isLoaded = false
		document.getElementsByTagName('head')[0].querySelectorAll('link').forEach(link => {
			if (path && link.href === path) {
				isLoaded = true
			}
			if (filename && link.href.includes(filename)) {
				isLoaded = true
			}
		})
		return isLoaded
	}

	_loadStyle(path) {
		let link = document.createElement('link')
		link.rel = 'stylesheet'
		link.type = 'text/css'
		link.href = path
		document.getElementsByTagName('head')[0].append(link)
	}
}
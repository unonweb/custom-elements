export default class Button {
	/*
		@Attributes:
			[data-html] 	// static, triplebar, icon, svg
			[data-insert] 	// afterbegin, beforeend, replace
			[data-state] 	// on, off
			[data-icon] 	// &#10132;
			[data-svg] 		// playpause
	*/

	_log = false

	static html = {
		triplebar: /* html */`
			<div class="bar one"></div>
			<div class="bar two"></div>
			<div class="bar three"></div>`
	}

	static svg = {
		play: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>',
		playcircle: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
		pause: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>',
		pausecircle: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
		stop: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-640v320-320Zm-80 400v-480h480v480H240Zm80-80h320v-320H320v320Z"/></svg>',
		playpause: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-312v-336l240 168-240 168Zm320-8v-320h80v320h-80Zm160 0v-320h80v320h-80Z"/></svg>',
		globebubble: /* html */`<svg xmlns="http://www.w3.org/2000/svg" data-name="1" viewBox="0 0 128 128"><path d="M64 22a43 43 0 1 0 43 43 43 43 0 0 0-43-43Zm31.46 66a48.19 48.19 0 0 0-9-4.1A70.48 70.48 0 0 0 88.9 67h14a38.75 38.75 0 0 1-7.44 21ZM25.05 67H39.1a70.48 70.48 0 0 0 2.43 16.91 48.19 48.19 0 0 0-9 4.1A38.75 38.75 0 0 1 25.05 67Zm7.49-25a48.19 48.19 0 0 0 9 4.1A70.48 70.48 0 0 0 39.1 63h-14a38.75 38.75 0 0 1 7.44-21ZM66 49.62a71.52 71.52 0 0 0 16.55-2.34A65.13 65.13 0 0 1 84.9 63H66Zm0-4V26.19c6.3 1.18 11.89 7.81 15.33 17.28A67.1 67.1 0 0 1 66 45.62Zm-4-19.43v19.43a67.1 67.1 0 0 1-15.33-2.15C50.11 34 55.7 27.37 62 26.19Zm0 23.43V63H43.1a65.13 65.13 0 0 1 2.35-15.72A71.52 71.52 0 0 0 62 49.62ZM43.1 67H62v13.38a71.52 71.52 0 0 0-16.55 2.34A65.13 65.13 0 0 1 43.1 67ZM62 84.38v19.43c-6.3-1.18-11.89-7.81-15.33-17.28A67.1 67.1 0 0 1 62 84.38Zm4 19.43V84.38a67.1 67.1 0 0 1 15.33 2.15C77.89 96 72.3 102.63 66 103.81Zm0-23.43V67h18.9a65.13 65.13 0 0 1-2.35 15.72A71.52 71.52 0 0 0 66 80.38ZM88.9 63a70.48 70.48 0 0 0-2.43-16.91 48.19 48.19 0 0 0 9-4.1A38.75 38.75 0 0 1 103 63Zm4-24.15a44.18 44.18 0 0 1-7.64 3.43 39.39 39.39 0 0 0-8.12-14 39.06 39.06 0 0 1 15.77 10.57ZM50.85 28.29a39.39 39.39 0 0 0-8.12 14 44.18 44.18 0 0 1-7.64-3.43 39.06 39.06 0 0 1 15.76-10.57ZM35.09 91.15a44.18 44.18 0 0 1 7.64-3.43 39.39 39.39 0 0 0 8.12 14 39.06 39.06 0 0 1-15.76-10.57Zm42.06 10.56a39.39 39.39 0 0 0 8.12-14 44.18 44.18 0 0 1 7.64 3.43 39.06 39.06 0 0 1-15.76 10.57Z"/><path d="M64 0A64 64 0 0 0 8.26 95.43l-8.19 30A2 2 0 0 0 2 128a1.79 1.79 0 0 0 .51-.07l30.39-8A64 64 0 1 0 64 0Zm0 124a60 60 0 0 1-29.83-8 2 2 0 0 0-1-.26 2.22 2.22 0 0 0-.51.06l-27.82 7.38 7.49-27.5a2 2 0 0 0-.2-1.53A60 60 0 1 1 64 124Z"/></svg>`,
		cardcarousel: /* html */`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792"><path d="M782 1078q-1 3-12.5-.5t-31.5-11.5l-20-9q-44-20-87-49-7-5-41-31.5t-38-28.5q-67 103-134 181-81 95-105 110-4 2-19.5 4t-18.5 0q6-4 82-92 21-24 85.5-115t78.5-118q17-30 51-98.5t36-77.5q-8-1-110 33-8 2-27.5 7.5t-34.5 9.5-17 5q-2 2-2 10.5t-1 9.5q-5 10-31 15-23 7-47 0-18-4-28-21-4-6-5-23 6-2 24.5-5t29.5-6q58-16 105-32 100-35 102-35 10-2 43-19.5t44-21.5q9-3 21.5-8t14.5-5.5 6 .5q2 12-1 33 0 2-12.5 27t-26.5 53.5-17 33.5q-25 50-77 131l64 28q12 6 74.5 32t67.5 28q4 1 10.5 25.5t4.5 30.5zm-205-486q3 15-4 28-12 23-50 38-30 12-60 12-26-3-49-26-14-15-18-41l1-3q3 3 19.5 5t26.5 0 58-16q36-12 55-14 17 0 21 17zm698 129l63 227-139-42zm-1108 800l694-232v-1032l-694 233v1031zm1241-317l102 31-181-657-100-31-216 536 102 31 45-110 211 65zm-503-962l573 184v-380zm311 1323l158 13-54 160-40-66q-130 83-276 108-58 12-91 12h-84q-79 0-199.5-39t-183.5-85q-8-7-8-16 0-8 5-13.5t13-5.5q4 0 18 7.5t30.5 16.5 20.5 11q73 37 159.5 61.5t157.5 24.5q95 0 167-14.5t157-50.5q15-7 30.5-15.5t34-19 28.5-16.5zm448-1079v1079l-774-246q-14 6-375 127.5t-368 121.5q-13 0-18-13 0-1-1-3v-1078q3-9 4-10 5-6 20-11 106-35 149-50v-384l558 198q2 0 160.5-55t316-108.5 161.5-53.5q20 0 20 21v418z" /></svg>`
	}

	static getSVG(key) {
		if (this.svg[key] === undefined) {
			console.error('svg key undefined: ', key)
			return ''
		}
		else {
			return this.svg[key]
		}
	}

	static dictionary = {
		'play': {
			de: 'Abspielen',
			en: 'Play'
		},
	}

	static translate(key) {
		let lang = (document.documentElement.lang !== '') ? document.documentElement.lang : 'de'
		if (!this.dictionary[key]) {
			return 'undefined'
		}
		return this.dictionary[key][lang]
	}

	constructor({ element, html, insert, state, theme, svg, icon, className }) {
		if (this._log) console.log('constructor(): ', ...arguments)
		
		this.element = element ?? document.createElement('button')

		// standard attributes
		this.element.type ??= 'button'
		if (className) {
			this.element.className = className	
		}
		// data-attributes
		this.element._hydrated = 'true'
		this.element.dataset.html ??= html ?? 'static'
		if (theme) {
			this.element.dataset.theme = theme	
		}
		else {
			this.element.dataset.theme ??= (document.documentElement.dataset.theme) ? document.documentElement.dataset.theme : ''
		}

		if (state) {
			this.element.dataset.state = 'off'	
		}
		if (svg) {
			this.element.dataset.svg = svg
		}
		if (insert) {
			this.element.dataset.insert = insert	
		}		

		this._renderInnerHTML()
		this._configElements()
	}

	_renderInnerHTML() {
		//if (this._log) console.log('render()')
		if (!this.element.dataset.html) return

		// [data-html]
		let innerHTML
		switch (this.element.dataset.html) {
			case 'static':
				return
			case 'triplebar':
				innerHTML = Button.html.triplebar
				break;
			case 'icon':
				innerHTML = /* html */`<span class="icon">${this.element.dataset.icon}</span>`
				break
			case 'svg':
				innerHTML = /* html */`<span class="svg">${Button.getSVG(this.element.dataset.svg)}</span>`
				break
			default:
				console.warn('this.element.dataset.html', this.element.dataset.html)
				break;
		}
		// [data-insert]
		switch (this.element.dataset.insert) {
			case 'afterbegin':
				this.element.insertAdjacentHTML('afterbegin', innerHTML)	
				break;
			case 'beforeend':
				this.element.insertAdjacentHTML('beforeend', innerHTML)
				break
			case 'replace':
				this.element.innerHTML = innerHTML
				break
			default:
				if (this._log) console.log('this.element.dataset.insert: ', this.element.dataset.insert, '"replace" is assumed')
				this.element.innerHTML = innerHTML
				break
		}
	}

	_configElements() {
		let icon = this.element.querySelector('.icon')
		if (icon) {
			icon.ariaHidden = true
		}
	}

	_wrapText() {
		// not used
		if (this.firstChild && this._isTextNode(this.firstChild)) {
			// wrap text in <span>
			this.element.innerHTML = /* html */`<span class="label">${this.element.innerHTML}</span>`
		}
	}

	_isTextNode(node) {
		return node.nodeType === 3;
	}
}

window.addEventListener('body-replaced', hydrate)

function hydrate(evt) {
	console.log(evt.type)
	let buttons = document.querySelectorAll('button')
	//console.log('buttons found: ', buttons)
	for (const button of buttons) {
		new Button({ element: button })
	}
}
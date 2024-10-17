import { html } from 'lit'

export default class TocController {
	/*
		@Attributes:
			[src-id] // id of element containing the content
			[levels] //
			[dropdown] // 'maybe'
	*/

	levels
	srcID
	_srcElement

	static dictionary = {
		'table-of-contents': {
			de: 'Inhaltsverzeichnis',
			en: 'Table Of Contents'
		},
	}

	static translate(key) {
		this._lang ??= (document.documentElement.lang !== '') ? document.documentElement.lang : 'de'
		if (!this.dictionary[key]) {
			return 'undefined'
		}
		return this.dictionary[key][this._lang]
	}

	constructor(host, { levels = 'H1,H2', srcID}) {
		this.host = host
		this.levels = levels
		this.srcID = srcID
		host.addController(this)
	}

	hostConnected() {
		// init host attributes
		this.host.role ??= 'navigation'
		this.host.ariaLabel = TocController.translate('table-of-contents')

		// get elements
		this._srcElement = document.getElementById(this.srcID)
		if (!this._srcElement) throw new Error(`this._srcElement = "${this._srcElement}", this.srcID = "${this.srcID}"`)
	}

	render() {
		return this._createStaticList(this._srcElement, this.levels)
	}

	_createStaticList(article, headingLvls) {
		/*
			Return a <ul> with table of contents
		*/
		if (typeof headingLvls === 'string') {
			headingLvls = headingLvls.replace(' ', '').toUpperCase().split(',') // --> ['H1','H2','H3']	
		}
		
		headingLvls = headingLvls.map(lvl => (/^[0-9]$/.test(lvl)) ? `H${lvl}` : lvl)

		// loop through headings
		const headings = article.querySelectorAll(headingLvls)
		let list = document.createElement('ul')
		list.className = 'content toc'
		let lastLevel = 1

		for (let i = 0; i < headings.length; i++) {
			const heading = headings[i]
			// * make sure all headers have an id
			// * create anchors and list items 
			let id

			// heading
			let lvl = parseInt(heading.tagName[1]) // H1 --> 1 (extract humber from tagName)
			heading.dataset.lvl = lvl
			if (heading.id) {
				id = heading.id
			}
			else {
				id = `h${lvl}-${i}` // lvl1-h1 (tag heading with a a unique id)
				heading.id = id
			}

			// anchor
			const anchor = document.createElement('a')
			anchor.href = `#${id}`
			anchor.textContent = heading.textContent
			anchor.addEventListener('click', evt => this._scrollToHeading(evt, id))

			// li
			const li = document.createElement('li')
			li.append(anchor)
			li.dataset.lvl = lvl

			if (lvl > lastLevel) {
				// More indentation, make a new list per lvl
				for (let i = 0; i < lvl - lastLevel; ++i) {
					const childList = document.createElement('ul')
					list.append(childList)
					list = childList
				}
			}
			else if (lvl < lastLevel) {
				// Less indentation, move back a few levels
				for (let i = 0; i < lastLevel - lvl; ++i) {
					list = list.parentNode;
				}
			}

			list.append(li)
			lastLevel = lvl

			if (i === headings.length - 1) {
				// At the end go back until start lvl
				for (let i = lvl; i === 2; ++i) {
					list = list.parentNode;
				}
			}
		}

		return list
	}

	_scrollToHeading(evt, destID) {
		// @click
		evt.preventDefault()
		const dest = document.getElementById(destID)
		const isInViewport = this._isInViewport(dest)
		const scrolledClass = 'scrolledTo'
		dest.classList.toggle(scrolledClass, false) // toggle = false: token will only be removed, but not added
		dest.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
		// block: Defines vertical alignment. One of start, center, end, or nearest.
		// inline: Defines horizontal alignment. One of start, center, end, or nearest.


		if (isInViewport) {
			// add 'scrolledTo' immediately if no scroll happened
			dest.classList.add(scrolledClass)
		} else {
			// add 'scrolledTo' on scroll end
			document.addEventListener('scrollend', (evt) => {
				dest.classList.add(scrolledClass)
			}, { once: true, passive: true });
		}

		setTimeout(() => {
			dest.classList.remove(scrolledClass)
		}, 4000)
	}

	_isInViewport(element) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
}
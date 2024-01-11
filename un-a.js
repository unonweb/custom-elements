class UnA extends HTMLElement {

	constructor() {
		super()
	}

	static observedAttributes = []

	connectedCallback() {
		//console.log(this, 'connected')
		
		/* attributes */
		this.dataset.theme ??= document.documentElement.dataset.theme
		this.dataset.title ??= ''
		this.dataset.href ??= ''
		this.dataset.label ??= ''
		
		/* html */
		const anchor = document.createElement('a')
		anchor.href = this.dataset.href
		anchor.className = this.className
		anchor.setAttribute('aria-label', this.dataset.label ?? this.innerText)

		if (this.innerText) {
			// text child
			// true for html entities
			anchor.textContent = this.innerText
		}
		else {
			// no text 
			for (const childElement of this.children) {
				anchor.append(childElement)
			}
		}
		
		this.replaceChildren(anchor)

		/* inner html */
		//this.innerHTML = /* html */`<a href="${this.dataset.href}"></a>`
	}

	renderHTML(style) {
		
		let html = ''

		switch (style) {
			case '':
			case 'default':
				html = this.dataset.title
				break		
		}
		
		return html
	}
}

customElements.define('un-a', UnA)
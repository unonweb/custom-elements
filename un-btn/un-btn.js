/* Buttons that only show an icon to represent do not have an accessible name. 
Accessible names provide information for assistive technology, such as screen readers */

/* If you want to visually hide the button's text, an accessible way to do so is to use a combination of CSS properties 
to remove it visually from the screen, but keep it parsable by assistive technology. */

class UnBtn extends HTMLElement {

	/*
		Attributes:
			data-html = 'slotted' 		// renders any html inside (default)
			data-html = 'triplebar' 	// renders an html triplebar
			data-html = 'css' 			// renders an html entity within css

			data-on = 'click'			// set data-state on click 
			data-on = 'hover' 			// set data-state on hover

			data-off = 'any'			// toggle off when click occures anywhere
			data-off = 'self' 			// toggle off only when click occures on the button
	*/

	constructor() {
		super()
		/* init private */
		this.log = []
		//this.log = ['events']
		//this.log = ['events', 'lifecycle']
		if (this.log.includes('lifecycle')) console.log('constructor()', this)
	}

	connectedCallback() {

		if (this.log.includes('lifecycle')) console.log('connectedCallback()', this)

		/* init public */
		this.dataset.theme ??= document.documentElement.dataset.theme
		this.dataset.state ??= 'off'
		this.dataset.html ??= 'slotted'
		this.dataset.on ??= 'click'
		this.dataset.off ??= 'any'

		/* html */
		//--- button
		const button = document.createElement('button')
		button.type = 'button'
		button.name = this.dataset.name ?? ''
		button.value = this.dataset.value ?? ''
		button.title = this.dataset.title ?? ''
		button.ariaLabel = this.dataset.label ?? this.innerText

		if (!button.ariaLabel) console.warn('!button.ariaLabel')

		//--- button.innerHTML
		if (this.dataset.html === 'slotted') {
			if (this.childNodes.length === 0) console.warn('this.childNodes.length === 0')
			if (this.isTextNode(this.firstChild)) {
				// wrap text in <span>
				button.innerHTML = /* html */`<span class="label">${this.innerHTML}</span>`
			} 
			else {
				button.innerHTML = this.innerHTML
			}

		}
		if (this.dataset.html === 'triplebar') {
			button.innerHTML = /* html */`
				<div class="bar one"></div>
				<div class="bar two"></div>
				<div class="bar three"></div>`
		}

		//--- compose html
		this.replaceChildren(button)

		/* elements */
		//this.trigger = this.querySelector('button')

		/* event listeners */
		if (this.dataset.on === 'hover') {
			this.addEventListener('mouseover', this)
			this.addEventListener('mouseleave', this)
		}

		if (this.dataset.on === 'click') {
			document.addEventListener('click', this) // attach to document in order to listen for outside clicks
		}
		
	}

	handleEvent(evt) {
		if (this.log.includes('events')) console.log('handleEvent() ', evt.type)

		switch (evt.type) {
			case 'click':
				this.onclick(evt)
				break;
			case 'mouseover':
				this.onmouseover(evt)
				break;
			case 'mouseleave':
				this.onmouseleave(evt)
				break;
		
		}
	}

	onclick(evt) {
		// document
		if (this.contains(evt.target)) {
			// if the element clicked is within <un-btn>
			if (this.log.includes('events')) console.log(evt.target, ' is within <un-btn>')
			
			evt.stopImmediatePropagation() // prevents other listeners of the same event from being called	
			
			this.dataset.state = (this.dataset.state === 'on') ? 'off' : 'on'
			this.dispatchEvent(
				new CustomEvent('un-btn-clicked', {
					bubbles: true,
				})
			);
		}
		else if (this.dataset.off === 'any') {
			// close click
			if (this.log.includes('events')) console.log('clicked anywhere else')

			this.dispatchEvent(
				new CustomEvent('un-btn-clicked-outside', {
					bubbles: true,
					detail: {
						clicked: evt.target,
					}
				})
			);
		}
	}

	onmouseover(evt) {

		this.dataset.state = 'on'
		this.dispatchEvent(
			new CustomEvent('un-btn-onmouseover', {
				bubbles: true,
			})
		);
	}

	onmouseleave(evt) {
		if (this.log.includes('events')) console.log('evt.type ', evt.type)

		this.dataset.state = 'off'
		this.dispatchEvent(
			new CustomEvent('un-btn-onmouseleave', {
				bubbles: true,
			})
		);
	}

	isTextNode(node) {
		return node.nodeType === 3;
	}
}

customElements.define('un-btn', UnBtn)
/* Buttons that only show an icon to represent do not have an accessible name. 
Accessible names provide information for assistive technology, such as screen readers */

/* If you want to visually hide the button's text, an accessible way to do so is to use a combination of CSS properties 
to remove it visually from the screen, but keep it parsable by assistive technology. */

class UnBtn extends HTMLElement {
	
	constructor() {
		super()
	}

	static observedAttributes = ['data-on']

	connectedCallback() {

		/* init public */
		this.dataset.theme ??= document.documentElement.dataset.theme
		this.dataset.state ??= 'off'
		this.dataset.html ??= 'slotted'
		// * 'slotted' renders any html inside
		// * 'triplebar' renders an html triplebar
		// * 'css' renders an html entity within css
		this.dataset.on ??= 'click'
		// * 'click' set data-state on click 
		// * 'hover' set data-state on hover
		this.dataset.off ??= 'any' 
		// * 'any' toggle off when click occures anywhere
		// * 'self' toggle off only when click occures on the button

		/* init private */
		this.log = 0

		/* html */
		switch (this.dataset.html) {
			case 'slotted':
				this.innerHTML = /* html */`
				<button 
					type="button" 
					name="${this.dataset.name ?? ''}" 
					value="${this.dataset.value ?? ''}" 
					title="${this.dataset.title ?? ''}"
					aria-label="${this.dataset.label ?? this.innerText}">${this.innerHTML}
				</button>`
				break;
			case 'triplebar':
				// or insert triplebar html
				this.innerHTML = /* html */`
				<button 
					type="button" 
					name="${this.dataset.name ?? ''}" 
					value="${this.dataset.value ?? ''}" 
					title="${this.dataset.title ?? ''}"
					aria-label="${this.dataset.label ?? this.innerText}">
					<div class="bar one"></div>
					<div class="bar two"></div>
					<div class="bar three"></div>
				</button>`
		}

		/* elements */
		this.trigger = this.querySelector('button')

		/* event listeners */
		this.organizeEventListeners(this.dataset.on, 'add')

	}

	attributeChangedCallback(att, prev, curr) {
		// previous and current are only set at the same time 
		// if the attribute change is caused by $0.dataset.on='click'

		if (this.log > 0) console.log(`attributeChangedCallback() ${att} changed from ${prev} to ${curr}`)

		if (prev === null) {
			return // prevent to be called on initialization
		}
		if (curr === null) {
			console.warn('use js to change attributes')
		}
		if (curr !== prev) {
			switch (att) {
				case 'data-on':
					// 'click' --> 'hover' 
					this.organizeEventListeners(prev, 'remove') // important to call first
					this.organizeEventListeners(curr, 'add')
					break;
			}
		}
	}

	organizeEventListeners(on = '', operation = 'add') {
		const method = (operation === 'add') ? 'addEventListener' : 'removeEventListener'
		if (this.log > 0) console.log('organizeEventListeners() ', operation, on)

		switch (on) {
			case 'click':
				document[method]('click', this) // attach to document in order to listen for outside clicks
				break
			case 'hover':
				this.trigger[method]('mouseover', this) //
				this.trigger[method]('mouseleave', this) //
				break
		}
	}

	handleEvent(evt) {
		//console.log('handleEvent(evt) ', evt.type)
		this['on' + evt.type](evt)
		// calls onclick(evt)
		// calls onmouseover(evt)
	}

	onclick(evt) {
		// document
		if (this.contains(evt.target)) {
			// if the element clicked is within <un-btn>
			if (this.log > 0) console.log(evt.target, ' is within <un-btn>')
			this.dataset.state = (this.dataset.state === 'on') ? 'off' : 'on'
			this.dispatchEvent(
				new CustomEvent('un-btn-clicked', {
					bubbles: true,
				})
			);
		}
		else if (this.dataset.off === 'any') {
			// close click
			//console.log('clicked anywhere else')
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
		if (this.log > 0) console.log('evt.type ', evt.type)
		this.dataset.state = 'on'
		this.dispatchEvent(
			new CustomEvent('un-btn-onmouseover', {
				bubbles: true,
			})
		);
	}

	onmouseleave(evt) {
		if (this.log > 0) console.log('evt.type ', evt.type)
		this.dataset.state = 'off'
		this.dispatchEvent(
			new CustomEvent('un-btn-onmouseleave', {
				bubbles: true,
			})
		);
	} 
}

customElements.define('un-btn', UnBtn)
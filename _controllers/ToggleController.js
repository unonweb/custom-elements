import { html } from 'lit'

export default class ToggleController {

	on // click, hover
	off // 'self'
	overlay // 'true'
	anim // 'slide-rl', 'unfold', 'softdrop'
	dest // <selector>
	icon // 'triplebar', '&#9660;'
	text // 'Click Me'
	condition // 'sm', 'md', 'lg', 'xl'
	log = true
	label

	_updatesCounter = 0
	_dest
	_state
	_log = false

	/* set _state(value) {
		switch (value) {
			case 'on':
				//this._state = 'on'
				this.host.setAttribute('toggle-state', 'on')
				if (this._button) {
					this._button.setAttribute('aria-expanded', 'true')
					this._button.dataset.state = 'on'	
				}
				//this._dest.setAttribute('toggle-state', 'on')
				break
			case 'off':
				//this._state = 'off'
				this.host.setAttribute('toggle-state', 'off')
				if (this._button) {
					this._button.setAttribute('aria-expanded', 'false')
					this._button.dataset.state = 'off'
				}
				if (this._otherToggleStateElements) {
					this._otherToggleStateElements.forEach(el => el.setAttribute('toggle-state', 'off'))	
				}
				//this._dest.setAttribute('toggle-state', 'off')
				break
		}
	} */

	/* get _state() {
		return this._state
	} */

	constructor(host, { on = 'click', off = 'self', anim = 'softdrop', overlay = 'true', state = 'off', dest = '.content', icon = 'triplebar', text = '', label = 'menu button', log = false, condition }) {
		if (this._log) console.log(`constructor() ${host.tagName}`)
		this.host = host
		this.on = on
		this.off = off
		this.anim = anim
		this.overlay = overlay
		this.dest = dest
		this.icon = icon
		this.text = text
		this.condition = condition
		//this.log = log
		this.label = label
		this._state = state
		//this.host.setAttribute('toggle-overlay', overlay)
		host.addController(this)
	}

	hostConnected() {
		if (this._log) console.log(`hostConnected() ${this.host.tagName}`)
		// get elements
		this._button = this.host.querySelector(':scope > button')
		if (typeof this.dest === 'string') {
			this._dest = this.host.querySelector(this.dest)
		}
		if (typeof this.dest === 'object') {
			this._dest = this.dest
		}
		this._otherToggleStateElements = this.host.querySelectorAll('[toggle-state]')

		// init
		this._condition = this._setCondition()
		this._setState(this._state)

		// animations
		if (this.anim === 'slide-rl') {
			let delay = 1
			let listItems = this.host.querySelectorAll('li')
			listItems.forEach(li => {
				li.style.setProperty('--delay', delay)
				delay++
			})
		}

		if (this.anim === 'unfold') {
			let delay = -100
			let listItems = this.host.querySelectorAll('li')
			listItems.forEach(li => {
				li.style.setProperty('--delay', `${delay}ms`)
				delay += 100
			})
		}
	}

	render() {
		if (this._log) console.log(`render() ${this.host.tagName}`)
		if (this._button) {
			return this._button
		}
		else {
			if (this.icon === 'triplebar') {
				return html`
					<button class="toggle" data-state="${this._state}" data-html="triplebar">
						<div class="bar one"></div>
						<div class="bar two"></div>
						<div class="bar three"></div>
					</button>`
			}
			else {
				return html`
					<button class="toggle" data-state="${this._state}">${this.text}<span class="icon">${this.icon}</span></button>`
			}
		}
	}

	hostUpdated() {
		if (this._log) console.log(`hostUpdated() ${this.host.tagName}`)
		this._updatesCounter++

		this._button ??= this.host.querySelector(':scope > button')
		this._dest ??= this.host.querySelector(':scope > .content')
		//this._otherElementsToClose ??= this.host.querySelectorAll('[state], [data-state]')

		if (this._dest) {
			this._dest.role ??= 'menu'
			if (this._dest.id === '') {
				this._dest.id = `toggle-${Math.trunc(Math.random() * 10000)}`
			}
			this._dest.classList.add('toggle-dest')
			console.log(this.host.tagName, 'this.overlay', this.overlay)
			this._dest.classList.toggle('toggle-overlay', this.overlay === 'true')
			// If set to true, then token will only be added, but not removed
			// If set to false, then token will only be removed, but not added
			this._button.setAttribute('aria-controls', this._dest.id)
		}
		
		if (this._button) {
			// attributes
			this._button.ariaLabel ??= this.label
			this._button.classList.add('toggle')
			this._button.dataset.state ??= this._state
			this._button.ariaHasPopup ??= 'menu' //  indicates the availability and type of interactive popup element that can be triggered by the element on which the attribute is set.
			this._button.ariaExpanded ??= 'false'

			// first update
			if (this._updatesCounter === 1) {
				// event listeners
				if (this.on === 'click' && this.off === 'self') {
					this._button.addEventListener('click', this._onclickButton)
				}
				// event listeners
				if (this.on === 'click' && this.off === 'any') {
					document.addEventListener('click', this._onclickDocument)
				}
				if (this.on === 'hover') {
					this._button.addEventListener('mouseover', this._setState('on'))
					this._button.addEventListener('mouseleave', this._setState('off'))
				}
			}
		}
	}

	hostDisconnected() {
		if (this._log) console.log(`hostDisconnected() ${this.host.tagName}`)
		if (this._button) {
			this._button.removeEventListener('mouseover', this._switchOn)
			this._button.removeEventListener('mouseleave', this._switchOff)
		}
		document.removeEventListener('click', this._onclickDocument)
	}

	_setCondition() {
		switch (this.condition) {
			case 'sm':
				return '640px'
			case 'md':
				return '768px'
			case 'lg':
				return '1024px'
			case 'xl':
				return '1280px'
		}
	}

	_onclickButton = (evt) => {
		if (evt.target === this._button) {
			evt.stopImmediatePropagation()
			//this._toggleState()
			switch (this._state) {
				case 'on':
					//this._switchOff()
					this._setState('off')
					break
				default:
					//this._switchOn()
					this._setState('on')
					break
			}
		}
	}

	_onclickDocument = (evt) => {
		if (this._button.contains(evt.target)) {
			evt.stopImmediatePropagation()
			this._switchOn()
			//this._state = 'on'
			this._setState('on')
		}
		else {
			this._switchOff()
			//this._state = 'off'
			this._setState('off')
		}
	}

	_switchOn = () => {
		this._state = 'on'
		this.host.setAttribute('toggle-state', 'on')
		//this._dest.setAttribute('toggle-state', 'on')
		this._button.setAttribute('aria-expanded', 'true')
		this._button.dataset.state = 'on'
	}

	_switchOff = () => {
		this._state = 'off'
		this.host.setAttribute('toggle-state', 'off')
		this._button.setAttribute('aria-expanded', 'false')
		this._button.dataset.state = 'off'
		//this._dest.setAttribute('toggle-state', 'off')
		this._otherToggleStateElements.forEach(el => el.setAttribute('toggle-state', 'off'))
	}

	_setState(value) {
		switch (value) {
			case 'on':
				this._state = 'on'
				this.host.setAttribute('toggle-state', 'on')
				if (this._button) {
					this._button.setAttribute('aria-expanded', 'true')
					this._button.dataset.state = 'on'
					this._button.classList.remove('toggle-off')
					this._button.classList.add('toggle-on')
				}
				if (this._dest) {
					this._dest.classList.remove('toggle-off')
					this._dest.classList.add('toggle-on')
				}
				break
			case 'off':
				this._state = 'off'
				this.host.setAttribute('toggle-state', 'off')
				if (this._button) {
					this._button.setAttribute('aria-expanded', 'false')
					this._button.dataset.state = 'off'
					this._button.classList.remove('toggle-on')
					this._button.classList.add('toggle-off')
				}
				if (this._otherToggleStateElements) {
					this._otherToggleStateElements.forEach(el => el.setAttribute('toggle-state', 'off'))	
				}
				if (this._dest) {
					this._dest.classList.remove('toggle-on')
					this._dest.classList.add('toggle-off')
				}
				break
		}
	}

	_toggleState() {
		switch (this._state) {
			case 'on':
				this._state = 'off'
				break
			case 'off':
				this._state = 'off'
				break
			default:
				console.warn(`this._state: ${this._state}`)
				break;
		}
	}
}
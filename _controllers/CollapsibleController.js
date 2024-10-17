export default class CollapsibleController {

	_waapi = null // Store the animation object (so we can cancel it if needed)
	_isClosing = false // Store if the element is closing
	_isExpanding = false // Store if the element is expanding
	_state

	constructor(host, { trigger, content, log = false, duration = 400, easing = 'ease-out', init = 'open' }) {

		this.trigger = trigger
		this.content = content
		this.log = log
		this.duration = duration
		this.easing = easing
		this.host = host

		this._state = init

		host.addController(this)
	}

	hostConnected() {
		if (this.log) console.log('hostConnected()')
		
		// event listeners
		if (this.trigger) {
			this.trigger.addEventListener('click', (evt) => this._onClick(evt))
		}

		if (this.content) {
			if (this.content.id === '') {
				this.content.id = `collapse-${Math.trunc(Math.random() * 10000)}`
			}
			this.trigger.setAttribute('aria-controls', this.content.id)
		}
	}

	_onClick(evt) {
		evt.preventDefault()
		this.host.style.overflow = 'hidden' // avoid content overflowing
		if (this._isClosing || this._state === 'closed') {
			this._open()
		} 
		else if (this._isExpanding || this._state === 'open') {
			this._shrinkContent()
		}
	}

	_open() {
		this.host.style.height = `${this.host.offsetHeight}px` // Apply a fixed height on the element
		this._state = 'open'
		window.requestAnimationFrame(() => this._expand()) // Wait for the next frame to call the expand function
	}

	_shrinkContent() {
		this._isClosing = true
		const startHeight = `${this.content.offsetHeight}px` // Store the current height of the element
		const endHeight = `0px`
		if (this._waapi) { 
			this._waapi.cancel()
		}

		this._waapi = this.content.animate({
			height: [startHeight, endHeight]
		}, {
			duration: this.duration,
			easing: this.easing
		});

		this._waapi.onfinish = () => {
			if (this.log) console.log(`_shrinkContent() finished`)
			this._waapi = null // Clear the stored animation
			this._isClosing = false // Reset isClosing & isExpanding
			this._isExpanding = false
			this.trigger.ariaExpanded = 'false'
			this.host.style.overflow = ''
			this.content.setAttribute('collapsed', 'true')
			this.content.style.height = endHeight
		}
		this._waapi.oncancel = () => this._isClosing = false
	}

	_expandContent() {
		this._isExpanding = true
		const startHeight = `${this.host.offsetHeight}px`; // Get the current fixed height of the element
		const endHeight = `${this.trigger.offsetHeight + this.content.offsetHeight}px`; // Calculate the open height of the element (summary height + content height)

		if (this._waapi) { // Wait for the next frame to call the expand function
			this._waapi.cancel() // Cancel the current animation
		}

		this._waapi = this.host.animate({ // Start a WAAPI animation
			height: [startHeight, endHeight] // Set the keyframes from the startHeight to endHeight
		}, {
			duration: this.duration,
			easing: this.easing,
		});
		this._waapi.onfinish = () => {
			if (this.log) console.log(`_expand() finished`)
			this._waapi = null // Clear the stored animation
			this._isClosing = false // Reset isClosing & isExpanding
			this._isExpanding = false
			this.trigger.ariaExpanded = 'true'
			this.host.style.overflow = ''
			this.host.collapseState = 'open'
			//this.host.style.height = endHeight
		}
		this._waapi.oncancel = () => this._isExpanding = false
	}

	_shrink() {
		this._isClosing = true
		const startHeight = `${this.host.offsetHeight}px` // Store the current height of the element
		const endHeight = `${this.trigger.offsetHeight}px`; // Calculate the height of the summary
		if (this._waapi) { // If there is already an animation running
			this._waapi.cancel() // Cancel the current animation
		}

		this._waapi = this.host.animate({ // Start a WAAPI animation
			height: [startHeight, endHeight] // Set the keyframes from the startHeight to endHeight
		}, {
			duration: this.duration,
			easing: this.easing
		});

		this._waapi.onfinish = () => {
			if (this.log) console.log(`_shrink() finished`)
			this._waapi = null // Clear the stored animation
			this._isClosing = false // Reset isClosing & isExpanding
			this._isExpanding = false
			this.trigger.ariaExpanded = 'false'
			this.host.style.overflow = ''
			this.host.collapseState = 'closed'
			//this.host.style.height = endHeight
		}
		this._waapi.oncancel = () => this._isClosing = false
	}

	_expand() {
		this._isExpanding = true
		const startHeight = `${this.host.offsetHeight}px`; // Get the current fixed height of the element
		const endHeight = `${this.trigger.offsetHeight + this.content.offsetHeight}px`; // Calculate the open height of the element (summary height + content height)

		if (this._waapi) { // Wait for the next frame to call the expand function
			this._waapi.cancel() // Cancel the current animation
		}

		this._waapi = this.host.animate({ // Start a WAAPI animation
			height: [startHeight, endHeight] // Set the keyframes from the startHeight to endHeight
		}, {
			duration: this.duration,
			easing: this.easing,
		});
		this._waapi.onfinish = () => {
			if (this.log) console.log(`_expand() finished`)
			this._waapi = null // Clear the stored animation
			this._isClosing = false // Reset isClosing & isExpanding
			this._isExpanding = false
			this.trigger.ariaExpanded = 'true'
			this.host.style.overflow = ''
			this.host.collapseState = 'open'
			//this.host.style.height = endHeight
		}
		this._waapi.oncancel = () => this._isExpanding = false
	}

	_onAnimationFinish(open) {
		if (this.log) console.log(`_onAnimationFinish(open): ${open}`)
		switch (open) {
			case true:
				this.trigger.ariaExpanded = 'true'
				this.host.collapseState = 'open'
				break
			case false:
				this.trigger.ariaExpanded = 'false'
				this.host.collapseState = 'closed'
				break
			default:
				break;
		}
		
		this._waapi = null // Clear the stored animation
		this._isClosing = false // Reset isClosing & isExpanding
		this._isExpanding = false
		this.host.style.height = this.host.style.overflow = ''; // Remove the overflow hidden and the fixed height
	}
}
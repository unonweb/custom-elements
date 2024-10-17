export default class DetailsController {

	_waapi = null // Store the animation object (so we can cancel it if needed)
	_isClosing = false // Store if the element is closing
	_isExpanding = false // Store if the element is expanding

	constructor(host, { details, summary, content }) {

		this.details = details
		this.summary = summary
		this.content = content

		this.host = host;
		host.addController(this)
	}

	hostConnected() {
		if (this.log) console.log('hostConnected()')
		
		// checks
		if (this.summary.tagName !== 'SUMMARY') console.error(`this.summary.tagName: ${this.summary.tagName}`)
		if (this.details.tagName !== 'DETAILS') console.error(`this.details.tagName: ${this.details.tagName}`)
		if (!this.content) console.error(`this.content: ${this.content}`)
		
			// event listeners
		if (this.summary) {
			this.summary.addEventListener('click', (evt) => this._onClick(evt))
		}
	}

	_onClick(evt) {
		evt.preventDefault()
		this.details.style.overflow = 'hidden' // Add an overflow on the <details> to avoid content overflowing
		// Check if the element is being closed or is already closed
		if (this._isClosing || !this.details.open) {
			this._open()
			// Check if the element is being openned or is already open
		} else if (this._isExpanding || this.details.open) {
			this._shrink()
		}
	}

	_open() {
		this.details.style.height = `${this.details.offsetHeight}px` // Apply a fixed height on the element
		this.details.open = true // Force the [open] attribute on the details element
		window.requestAnimationFrame(() => this._expand()) // Wait for the next frame to call the expand function
	}

	_shrink() {
		this._isClosing = true
		const startHeight = `${this.details.offsetHeight}px` // Store the current height of the element
		const endHeight = `${this.summary.offsetHeight}px`; // Calculate the height of the summary
		if (this._waapi) { // If there is already an animation running
			this._waapi.cancel() // Cancel the current animation
		}

		this._waapi = this.details.animate({ // Start a WAAPI animation
			height: [startHeight, endHeight] // Set the keyframes from the startHeight to endHeight
		}, {
			duration: 400,
			easing: 'ease-out'
		});

		this._waapi.onfinish = () => this._onAnimationFinish(false) // When the animation is complete, call onAnimationFinish()
		this._waapi.oncancel = () => this._isClosing = false // If the animation is cancelled, isClosing variable is set to false
	}

	_expand() {
		this._isExpanding = true; // Set the element as "being expanding"
		const startHeight = `${this.details.offsetHeight}px`; // Get the current fixed height of the element
		const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`; // Calculate the open height of the element (summary height + content height)

		if (this._waapi) { // Wait for the next frame to call the expand function
			this._waapi.cancel() // Cancel the current animation
		}

		this._waapi = this.details.animate({ // Start a WAAPI animation
			height: [startHeight, endHeight] // Set the keyframes from the startHeight to endHeight
		}, {
			duration: 400,
			easing: 'ease-out'
		});
		this._waapi.onfinish = () => this._onAnimationFinish(true); // When the animation is complete, call onAnimationFinish()
		this._waapi.oncancel = () => this._isExpanding = false; // If the animation is cancelled, isExpanding variable is set to false
	}

	_onAnimationFinish(open) {
		this.details.open = open // Set the open attribute based on the parameter
		this._waapi = null // Clear the stored animation
		this._isClosing = false // Reset isClosing & isExpanding
		this._isExpanding = false
		this.details.style.height = this.details.style.overflow = ''; // Remove the overflow hidden and the fixed height
	}
}
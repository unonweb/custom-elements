export default class StickyController {
	/*
		@Attributes:
			[sticky] // 'true', 'false', 'smart'
	*/
	host
	_prevScrollYPos = 0
	_throttleWait = false
	_throttleTimout = 250
	_rootMargin = '-10px 0px 0px 0px'
	//rootMargin: `-${rootMarginTop.endsWith('px') ? rootMarginTop : '1px'} 0px 0px 0px`
	//const rootMarginTop = window.getComputedStyle(this.parentElement).rowGap // respects a possible row-gap on a parent that's a flex container

	constructor(host, { mode = 'true' }) {
		this.host = host
		this.mode = mode
		host.addController(this)
	}

	hostConnected() {
		if (this.mode === 'true' || this.mode === 'smart') {
			// add IntersectionObserver
			const isStuckObserver = new IntersectionObserver(this._isStuckCallback, {
				threshold: [1],
				root: null, // watch for intersection relative to the top-level of the document's viewport
				rootMargin: this._rootMargin,
			});

			isStuckObserver.observe(this.host)

		}

		/* if (this.mode === 'smart') {
			// this is now implemented at the html element
			document.addEventListener('scroll', this._onscroll)
		} */
	}

	hostDisconnected() {
		document.removeEventListener('scroll', this._onscroll)
	}

	_isScrollingDown() {
		let currScrollYPos = window.scrollY

		if (currScrollYPos > this._prevScrollYPos) {
			this._prevScrollYPos = currScrollYPos
			return true
		}
		else {
			this._prevScrollYPos = currScrollYPos
			return false;
		}
	}

	_isStuckCallback = (entries) => {
		// observer callback
		// each entry represents one threshold which was crossed
		console.log('_observerCallback()')
		entries[0].target.classList.toggle('stuck', entries[0].intersectionRatio < 1) /* degree of intersection between the target element and its root */
	}

	_onscroll = () => {
		if (this._throttleWait === true) {
			return
		}
		else {
			this._throttleWait = true // pause the function
			setTimeout(() => {
				// throttle
				if (this._isScrollingDown()) {
					this.host.classList.add('scroll-down');
					this.host.classList.remove('scroll-up')
				} else {
					this.host.classList.add('scroll-up');
					this.host.classList.remove('scroll-down')
				}
				this._throttleWait = false // resume the function
			}, this._throttleTimout)
		}
	}
}
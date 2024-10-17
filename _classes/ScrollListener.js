export default class ScrollListener {

	_prevScrollYPos = 0
	_throttleWait = false
	_throttleTimout = 250
	_rootMargin = '-10px 0px 0px 0px'
	
	constructor(host) {
		this.host = host
		// event listener
		document.addEventListener('scroll', this._onscroll)
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

	_onscroll = () => {
		if (this._throttleWait === true) {
			return
		}
		else {
			this._throttleWait = true // pause the function
			setTimeout(() => {
				// throttle
				if (this._isScrollingDown()) {
					//this.host.classList.add('scroll-down');
					//this.host.classList.remove('scroll-up')
					this.host.setAttribute('scrolling-down', '')
					this.host.removeAttribute('scrolling-up', '')
				} else {
					this.host.setAttribute('scrolling-up', '')
					this.host.removeAttribute('scrolling-down', '')
				}
				this._throttleWait = false // resume the function
			}, this._throttleTimout)
		}
	}
}
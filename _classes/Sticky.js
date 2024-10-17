export default class Sticky {
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

	constructor(host) {
		this.host = host
		
		// add IntersectionObserver
		const isStuckObserver = new IntersectionObserver(this._isStuckCallback, {
			threshold: [1],
			root: null, // watch for intersection relative to the top-level of the document's viewport
			rootMargin: this._rootMargin,
		});

		isStuckObserver.observe(this.host)
	}

	_isStuckCallback = (entries) => {
		// observer callback
		// each entry represents one threshold which was crossed
		console.log('_observerCallback()')
		entries[0].target.classList.toggle('stuck', entries[0].intersectionRatio < 1) /* degree of intersection between the target element and its root */
	}
}
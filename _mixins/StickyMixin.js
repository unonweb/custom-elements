export default function StickyMixin(superClass) {
	return class Sticky extends superClass {
		/*
			@Attributes:
				[sticky] // 'true', 'false', 'smart'
		*/

		static properties = {
			// public
			sticky: { type: String, reflect: true },
		}

		_previousScrollPosition = 0
		_throttleWait = false

		constructor() {
			super()
		}

		connectedCallback() {
			super.connectedCallback()

			// [sticky]
			if (this.sticky === 'true' || this.sticky === 'smart') {
				//const rootMarginTop = window.getComputedStyle(this.parentElement).rowGap // respects a possible row-gap on a parent that's a flex container
				// add IntersectionObserver
				const observer = new IntersectionObserver(([entry]) => {
					entry.target.classList.toggle('stuck', entry.intersectionRatio < 1) /* degree of intersection between the target element and its root */
				}, {
					threshold: [1],
					root: null, // watch for intersection relative to the top-level of the document's viewport
					//rootMargin: `-${rootMarginTop.endsWith('px') ? rootMarginTop : '1px'} 0px 0px 0px`
					rootMargin: '-1px 0px 0px 0px',
				});

				observer.observe(this);

			}

			if (this.sticky === 'smart') {
				document.addEventListener('scroll', evt => {
					if (this._throttleWait === true) {
						return
					}
					else {
						this._throttleWait = true // pause the function

						setTimeout(() => {
							// throttle
							if (this._isScrollingDown()) {
								this.classList.add('scroll-down');
								this.classList.remove('scroll-up')
							} else {
								this.classList.add('scroll-up');
								this.classList.remove('scroll-down')
							}
							this._throttleWait = false;
						}, 250);
					}
				});
			}
		}

		_isScrollingDown() {
			let currentScrolledPosition = window.scrollY
			let scrollingDown;
	
			if (currentScrolledPosition > this._previousScrollPosition) {
				scrollingDown = true;
			} else {
				scrollingDown = false;
			}
			this._previousScrollPosition = currentScrolledPosition;
			return scrollingDown;
		};
	}
}
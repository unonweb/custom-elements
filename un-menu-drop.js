class UnMenuDrop extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {

		/* init public */
		this.dataset.theme ??= this.parentElement.dataset.theme ?? document.documentElement.dataset.theme
		this.dataset.justify ??= 'right'
		this.dataset.overlay ??= 'true'
		this.dataset.state ??= 'off'
		this.dataset.anim ??= '' // 'topdown'
		// this.dataset.smartstuck = undefined

		/* init private */
		this.log = 1
		this.previousScrollPosition = 0;
		this.throttleWait

		/* html */
		this.trigger = this.querySelector('[slot="drop-trigger"]')
		this.content = this.querySelector('[slot="drop-content"]')
		this.trigger.classList.add('trigger')
		this.content.classList.add('content')

		/* this.innerHTML = `
			${this.trigger.outerHTML}
			<div class="content">
				${this.content.map(item => item.outerHTML).join(' ')}
			</div>
		` */

		/* position === 'sticky' */
		if (['true', 'smart'].includes(this.dataset.sticky)) {
			const rowGap = window.getComputedStyle(this.parentElement).rowGap // respects a possible row-gap on a parent that's a flex container
			// add IntersectionObserver
			const observer = new IntersectionObserver(([entry]) => {
				entry.target.classList.toggle('stuck', entry.intersectionRatio < 1) /* degree of intersection between the target element and its root */
			}, { 
				threshold: [0, 1], 
				root: null, // watch for intersection relative to the top-level of the document's viewport
				rootMargin: `-${rowGap ?? '1px'} 0px 0px 0px`
			});

			observer.observe(this);
		}

		/* event listeners */
		this.anchors = this.querySelectorAll('a')
		document.addEventListener('DOMContentLoaded', this)

		if ('smartstuck' in this.dataset) {
			document.addEventListener('scroll', this);
		}

		this.addEventListener('un-btn-clicked', this)
		this.addEventListener('un-btn-clicked-outside', this)

		/* log */
		if (this.log > 0) console.log('connectedCallback():', this.tagName)
	}

	handleEvent(evt) {
		switch (evt.type) {

			case 'scroll':
				if (this.throttleWait === true) {
					return
				}

				this.throttleWait = true // set the wait variable to true to pause the function

				setTimeout(() => {
					this.onscroll()
					this.throttleWait = false;
				}, 250);
				break;

			case 'DOMContentLoaded':
				this.addClassToCurrentLocation(this.anchors, 'current-location')
				break;

			case 'un-btn-clicked':
				this.dataset.state = (this.dataset.state === 'on') ? 'off' : 'on'
				break;

			case 'un-btn-clicked-outside':
				if (!this.contains(evt.detail.clicked)) {
					evt.srcElement.dataset.state = 'off'
					this.dataset.state = 'off'
				}
				break
		}
	}

	isScrollingDown() {
		let currentScrolledPosition = window.scrollY
		let scrollingDown;

		if (currentScrolledPosition > this.previousScrollPosition) {
			scrollingDown = true;
		} else {
			scrollingDown = false;
		}
		this.previousScrollPosition = currentScrolledPosition;
		return scrollingDown;
	};

	onscroll() {
		if (this.isScrollingDown()) {
			this.classList.add('scroll-down');
			this.classList.remove('scroll-up')
		} else {
			this.classList.add('scroll-up');
			this.classList.remove('scroll-down')
		}
	}

	throttle(callback, time) {
		if (this.throttleWait) return // if the variable is true, don't run the function

		this.throttleWait = true // set the wait variable to true to pause the function

		// use setTimeout to run the function within the specified time!
		setTimeout(() => {
			callback();
			// set throttleWait to false once the timer is up to restart the throttle function
			this.throttleWait = false;
		}, time);
	}

	addClassToCurrentLocation(anchors = [], cls = 'current-location') {
		return function () {
			anchors.forEach(anchor => {
				if (anchor.href === window.location.href) {
					anchor.classList.add(cls)
				}
			})
		}
	}

}
window.customElements.define('un-menu-drop', UnMenuDrop);
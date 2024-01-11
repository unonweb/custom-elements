class UnNav extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {

		/* attributes */
		this.setAttribute('role', 'navigation')
		
		/* init public */
		this.dataset.theme ??= this.parentElement.dataset.theme ?? document.documentElement.dataset.theme
		this.dataset.justify ??= 'center'
		this.dataset.sticky ??= 'true' // 'smart'
		// this.dataset.smartstuck = undefined
		this.dataset.dropdown ??= 'breakpoint' // 'true', 'false', 'breakpoint'
		this.dataset.breakpoint ??= '1024px' // 'auto'
		this.dataset.state ??= (this.dataset.dropdown === 'true') ? 'on' : ''
		this.dataset.broken ??= 'false'
		this.dataset.overlay ??= 'true'
		this.dataset.anim ??= 'topdown'

		/* html */
		const slottedTrigger = this.querySelector('[slot="trigger"]')
		if (slottedTrigger) {
			if (slottedTrigger.tagName !== 'UN-BTN') console.warn('slotted button must be an instance of un-btn')
			// make sure that slotted un-btn fits requirements:
			slottedTrigger.dataset.off = 'self' 
			slottedTrigger.classList.add('trigger')
		}
		const contentChildren = Array.from(this.children).filter(el => el !== slottedTrigger)

		this.innerHTML = /* html */`
			${slottedTrigger?.outerHTML ?? /* html */`<un-btn class="trigger" slot="trigger" data-html="triplebar" data-theme="${this.dataset.theme}" data-off="self"></un-btn>`}
			<ul class="content">
				${contentChildren.map(el => /* html */`<li>${el.outerHTML}</li>`).join(' ')}
			</ul>`

		/* init private */
		this.trigger = this.querySelector('.trigger')

		if (this.dataset.breakpoint === 'auto') {
			this.listElement = this.querySelector('.content')
			let flexDir = getComputedStyle(this.listElement)['flex-direction']
			let minWidth
			if (flexDir === 'row') {
				minWidth = Array.from(this.listElement.children).reduce((acc, curr) => acc += curr.clientWidth, 0) // only works if flex-direction: row	
			}
			if (flexDir === 'column') {
				// nothhing so far...	
			}

			this.dataset.breakpoint = `${minWidth + minWidth * 0.1}px`
		}
		
		
		this.log = 0
		this.previousScrollPosition = 0;
		this.throttleWait

		/* position === 'sticky' */
		if (['true', 'smart'].includes(this.dataset.sticky)) {
			const rootMarginTop = window.getComputedStyle(this.parentElement).rowGap // respects a possible row-gap on a parent that's a flex container
			// add IntersectionObserver
			const observer = new IntersectionObserver(([entry]) => {
				entry.target.classList.toggle('stuck', entry.intersectionRatio < 1) /* degree of intersection between the target element and its root */
			}, {
				threshold: [0, 1],
				root: null, // watch for intersection relative to the top-level of the document's viewport
				rootMargin: `-${rootMarginTop.endsWith('px') ? rootMarginTop : '1px'} 0px 0px 0px`
			});

			observer.observe(this);
		}

		/* event listeners */
		this.anchors = this.querySelectorAll('a')
		document.addEventListener('DOMContentLoaded', this)

		if (this.dataset.sticky === 'smart') {
			document.addEventListener('scroll', this);
		}

		this.addEventListener('un-btn-clicked', this)
		this.addEventListener('un-btn-clicked-outside', this)

		// dropdown media condition
		if (this.dataset.dropdown === 'breakpoint' && this.dataset.breakpoint.endsWith('px')) {
			const mediaQuery = window.matchMedia(`(max-width: ${this.dataset.breakpoint})`)
			mediaQuery.addEventListener('change', this)
			this.handleMediaChange(mediaQuery)
		}

		/* log */
		if (this.log > 0) console.log('connectedCallback():', this.tagName)
	}

	handleEvent(evt) {
		if (this.log > 0) console.log(`handleEvent(${evt.type}): `, evt)

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

			case 'change':
				if (evt.media) {
					this.handleMediaChange(evt)
				}
				break;

			case 'un-btn-clicked':
				this.dataset.state = (this.dataset.state === 'on') ? 'off' : 'on'
				break;

			case 'un-btn-clicked-outside':
				if (!this.contains(evt.detail.clicked)) {
					evt.srcElement.dataset.state = 'off'
					this.dataset.state = 'off'
				}
				break;
		}
	}

	handleMediaChange(evt) {
		this.dataset.broken = evt.matches
		this.dataset.state = evt.matches ? 'off' : ''
		this.trigger.dataset.state = evt.matches ? 'off' : 'on'
		if (this.log > 0) console.log(`media changed: "${evt.media}`)
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

		// use setTimeout to run the function within the specified time
		setTimeout(() => {
			callback();

			// set throttleWait to false once the timer is up to restart the throttle function
			this.throttleWait = false;
		}, time);
	}

	addClassToCurrentLocation(anchors = [], cls = 'current-location') {
		anchors.forEach(a => {
			if (a.href === window.location.href || a.href === `${window.location.href}${document.querySelector('html').lang}/`) {
				a.classList.add(cls)
				a.parentElement.classList.add(cls)
			}
		})
		/* return function () {
			anchors.forEach(anchor => {
				if (anchor.href === window.location.href) {
					anchor.classList.add(cls)
				}
			})
		} */
	}

}
window.customElements.define('un-nav', UnNav);
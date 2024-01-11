class UnHeaderBanner extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		
		if (this.parentElement.tagName !== 'HEADER') {
			this.setAttribute('role', 'banner')
		}
		
		/* init public */
		this.dataset.theme ??= document.documentElement.dataset.theme
		this.dataset.transfx ??= 'slide';
		this.dataset.filter ??= 'none';
		this.dataset.transtime ??= 10000;

		// internal properties
		this.slideReverse = false;
		this.shownImgIndex = 0;
		this.log = 1;

		this.imgElements = this.querySelectorAll('img.background');

		if (this.imgElements.length === 0) {
			console.error('this.imgElements.length === 0');

		} else if (this.imgElements.length === 1) {
			this.imgElements[this.shownImgIndex].style.setProperty('transition', 'unset'); // get rid of any transitions during the initial load
			this.imgElements[this.shownImgIndex].classList.add('show'); // showcase first img
			this.imgElements[this.shownImgIndex].style.removeProperty('transition');

		} else if (this.imgElements.length > 1) {
			// if there are multiple images

			this.imgElements.forEach((el) =>
				el.style.setProperty('transition', 'unset')
			); // this hack is necessary to get rid of any transitions during the initial load
			this.imgElements[this.shownImgIndex].classList.add('show'); // showcase first img

			setTimeout(() => {
				if (this.log > 0) console.log('starting setInterval... ');
				this.imgElements.forEach((el) =>
					el.style.removeProperty('transition')
				);
				setInterval(this.slideImgIndex.bind(this), this.transtime);
			}, 3000);
		}
	}

	get transtime() {
		return Number(this.dataset.transtime);
	}

	get transfx() {
		return this.dataset.transfx;
	}

	slideImgIndex() {
		//console.log('slideImgIndex()')
		let currIndex = this.shownImgIndex;
		let newIndex;

		// set slide direction
		if (currIndex === this.imgElements.length - 1) {
			this.slideReverse = true;
		}
		if (currIndex === 0) {
			this.slideReverse = false;
		}

		if (this.slideReverse) {
			newIndex = currIndex - 1;
		} else {
			newIndex = currIndex + 1;
		}

		this.imgElements[currIndex].classList.remove('show'); //
		this.imgElements[newIndex].classList.add('show'); //

		// finally change the index
		this.shownImgIndex = newIndex; // update index
	}
}

customElements.define('un-header-banner', UnHeaderBanner);

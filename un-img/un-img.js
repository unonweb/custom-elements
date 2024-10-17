class UnImg extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// DEFAULT VALUES
		//this.dataset.theme ??= '';
		//this.dataset.shape ??= null
		//this.dataset.filter ??= null
		//this.dataset.hover ??= null
		//this.dataset.mask ??= null
		//this.dataset.zoom ??= ''
		if (this.dataset.hover && this.dataset.hover.includes('magnify')) {
			this.dataset.magnify = '1' // choose magnifier
		}
		
		/* elements */
		this.img = this.querySelector('img')

		

		if (this.dataset.magnify === '1') {
			this.addMagnifier1(this.img)
		}
		if (this.dataset.magnify === '2') {
			this.addMagnifier2(this.img)
		}
	}

	addMagnifier1(img, zoomLvl) {
		this.addEventListener('mousemove', moveMagnifier, false)

		const glass = document.createElement('div');
		glass.className = 'magnify-1'
		glass.style.backgroundImage = `url("${img.src}")`
		glass.style.backgroundRepeat = 'no-repeat';
		glass.style.backgroundSize = `${img.offsetWidth * zoomLvl}px auto`; // ${img.offsetHeight * zoomLvl}px
		const correctionY = img.getAttribute('height') / img.offsetHeight
		const correctionX = img.getAttribute('width') / img.offsetWidth
		img.after(glass);

		function moveMagnifier(evt) {
			/*
				- offsetLeft: number of pixels that the upper left corner of the current element is offset to the left within the HTMLElement.offsetParent (un-img)
				- offsetWidth: layout width of an element as an integer (795px)
				- evt.pageX: The X coordinate of the mouse pointer relative to the whole document
				- evt.offsetX: the offset in the X coordinate of the mouse pointer between that event and the padding edge of the target node.
			*/

			let x = evt.pageX - (evt.pageX - evt.offsetX) //this.offsetLeft
			let y = evt.pageY - (evt.pageY - evt.offsetY) // this.offsetTop
			let xperc = ((x / img.offsetWidth) * 100)
			let yperc = ((y / img.offsetHeight) * 100)

			//lets user scroll past right edge of image
			/* if (x > (.01 * img.offsetWidth)) {
				xperc += (.15 * xperc);
			};
	
			//lets user scroll past bottom edge of image
			if (y >= (.01 * img.offsetHeight)) {
				yperc += (.15 * yperc);
			}; */

			glass.style.backgroundPositionX = `${xperc + 0}%`;
			glass.style.backgroundPositionY = `${yperc + correctionY}%`;

			glass.style.left = `${x - (glass.offsetWidth / 2)}px`; // this must be half of magnifier glass width
			glass.style.top = `${y - (glass.offsetHeight / 2)}px`; // this must be half of magnifier glass width

		}
	}

	addMagnifier2(img) {
		this.addEventListener('mousemove', zoom);
		this.style.backgroundImage = `url("${img.src}")`
		
		function zoom(evt) {
			var zoomer = evt.currentTarget;
			let offsetX = (evt.offsetX) ? evt.offsetX : evt.touches[0]?.pageX
			let offsetY = (evt.offsetY) ? evt.offsetY : evt.touches[0]?.pageY
			let x = offsetX / zoomer.offsetWidth * 100
			let y = offsetY / zoomer.offsetHeight * 100
			zoomer.style.backgroundPosition = `${x}% ${y}%`;
		}
	}
}

window.customElements.define('un-img', UnImg);
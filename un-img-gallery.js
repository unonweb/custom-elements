class UnImgGallery extends HTMLElement {
	// images are put side by side
	// * listens to CustomEvent 'image-selected'

	constructor() {
		super()
	}

	get lastImgIndex() {
		return this.imgs.length - 1
	}

	set selectedIndex(newIndex = '') {
		
		if (typeof newIndex !== 'number') {
			newIndex = Number(newIndex)
		}

		let oldIndex = this.selectedIndex // in fact gets this._selectedImgIndex
		
		// checks
		if (newIndex > this.imgs.length - 1) return // return if beyond last item
		if (newIndex < 0) return // return if beyond first item

		// finally change the index
		if (typeof newIndex !== 'undefined') {
			this._selectedIndex = newIndex // update index
		}

		this.updateClasses(oldIndex, newIndex)
	}

	get selectedIndex() {
		return Number(this._selectedIndex)
	}

	connectedCallback() {
		
		/* init public properties */
		this.dataset.theme ??= document.documentElement.dataset.theme
		this.dataset.justify ??= 'center'
		this.dataset.shape ??= 'oval'
		this.dataset.filter ??= 'none'
		this.dataset.hover ??= 'outline shadow'
		this.dataset.onclick ??= 'modal'
		this.dataset.modal ??= 'lightbox'

		/* init internal [pre-html] */
		this.log = 1

		/* html */
		if (this.dataset.modal === 'lightbox') {
			const html = /* html */`<un-img-lightbox>${this.innerHTML}</un-img-lightbox>`
			this.insertAdjacentHTML('beforeend', html)
			this.modal = this.querySelector('un-img-lightbox')
		}

		/* init internal [post-html] */
		this.imgs = this.querySelectorAll('img')
		this.imgs.forEach((img, index) => {
			img.dataset.index = index // attach an individual img index
			img.addEventListener('click', evt => this.selectedIndex = evt.target.dataset.index)
			if (this.dataset.onclick === 'modal') {
				img.addEventListener('click', evt => this.openModal(evt)) // add event listeners
			}
		})
		this.selectedIndex = 0 // triggers this.updateClasses()
		
		/* event listeners */
		this.addEventListener('image-selected', this)
	}

	handleEvent(evt) {
		if (evt.type === 'image-selected') {
			if (this.log > 0) console.log('[evt] image-selected: ', evt.detail)
			this.selectedIndex = evt.detail.index
		}
	}

	updateClasses(oldIndex, newIndex) {
		// then update classes
		if (Number.isInteger(oldIndex)) this.imgs[oldIndex].classList.remove('current') //
		if (Number.isInteger(newIndex)) this.imgs[newIndex].classList.add('current') //
	}

	openModal(evt) {
		this.modal.dataset.state = 'open' // set modal state = open
		this.modal.dataset.index = evt.target.dataset.index
		this.modal.selectedIndex = this.selectedIndex
		//this.modal.selectedIndex = Number(evt.target.dataset.index) // pass index of selected img to modal
	}

}

customElements.define('un-img-gallery', UnImgGallery)
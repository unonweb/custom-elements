class UnImgLightbox extends HTMLElement {
	// * fires CustomEvent 'image-selected'

	// IMP:
	// - implement layzy loading

	constructor() {
		super()
	}

	get lastImgIndex() {
		return this.imgs.length - 1
	}

	set selectedIndex(newIndex = '') {
		// sets this._selectedIndex

		if (typeof newIndex !== 'number') {
			newIndex = Number(newIndex)
		}

		if (this.log === 1) console.log('selectedImgIndex new: ', newIndex)
		if (this.log === 1) console.log('selectedImgIndex old: ', this.selectedImgIndex)

		// called by arrows, bullets
		let oldIndex = this.selectedIndex // returns this._selectedImgIndex as a number
		
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
		return Number(this._selectedIndex) // return a number
	}

	/* attributeChangedCallback(att, prev, curr) {
		// previous and current are only set at the same time 
		// if the attribute change is caused by $0.dataset.on='click'

		console.log(`attributeChangedCallback() ${att} changed from ${prev} to ${curr}`)

		if (prev === null) {
			return // prevent to be called on initialization
		}
		if (curr === null) {
			console.warn('use js to change attributes')
		}
		if (curr !== prev) {
			if (att === 'data-index') {
				if (typeof curr !== 'number') {
					curr = Number(curr)
				}
				// checks
				if (curr > this.imgs.length - 1) return // return if beyond last item
				if (curr < 0) return // return if beyond first item

				// finally change the index
				if (typeof curr !== 'undefined') {
					this.selectedIndex = curr // update index
				}

				this.updateClasses(prev, curr)
			}
		}
	} */

	connectedCallback() {

		/* init public properties */
		this.dataset.theme ??= this.parentElement.dataset.theme ?? document.documentElement.dataset.theme
		this.dataset.state ??= 'closed'
		this.dataset.bullets ??= true
		this.dataset.transfx ??= 'flash'
		this.dataset.slidetime ??= 5000

		/* init internal [pre-html] */
		this.log = 0
		this.bulletsCreated = false
		
		/* html */
		const html = /* html */`
			<div class="modal">
				<div class="showcase">
					<button title="close" aria-label="close" class="close"></button>
					<button title="left" aria-label="left" class="arrows left"></button>
					${this.innerHTML}
					<button title="right" aria-label="right" class="arrows right"></button>
				</div>
			</div>`
		
		this.innerHTML = html

		/* init internal [post-html] */
		this.imgs = this.querySelectorAll('img')
		this.btnClose = this.querySelector('button.close')
		this.btnClose.addEventListener('click', () => this.close())
		this.querySelector('button.left').addEventListener('click', () => this.selectedIndex = this.selectedIndex - 1)
		this.querySelector('button.right').addEventListener('click', () => this.selectedIndex = this.selectedIndex + 1)

	}

	/* _renderBullets() {
		// bullets are created in the second call of render()
		if (!this.shadowRoot.host.hasAttribute('bullets')) return // only create bullets when attribute is present
		if (this.shadowRoot.host.getAttribute('bullets') === "0") return
		if (this.shadowRoot.host.getAttribute('bullets') === "false") return
		if (!this.imgs) return ""
		
		this.bulletsCreated = true
		// bullets are related to image index by their id
		return html`
			<div class="bullets">
				${this.imgs.map((item, index) => {
					let cls = ''
					cls = (index === this.selectedImgIndex) ? 'bullet-current' : '' // initially add current class to bullet that corresponds with showcasedImg
					return html`
						<div 
							class="bullet ${cls}"
							id="bullet-${index}"
							data-index=${index}
							@click=${evt => this.selectedImgIndex = Number(evt.target.dataset.index)}>
						</div>
					`
				})}
			</div>
		`
	} */

	close() {
		this.dataset.state = 'closed'
		const event = new CustomEvent('image-selected', {
			bubbles: true,
			composed: true,
			detail: { index: this.selectedIndex }
		})
		this.dispatchEvent(event)

		this.selectedIndex = null // reset selected index
	}

	/* handleEvent(evt) {
		if (evt.type === 'click' && evt.target === this.btnClose) {
			this.dataset.state = 'closed'
			const event = new CustomEvent('image-selected', {
				bubbles: true,
				composed: true,
				detail: { selectedImgIndex: this.selectedIndex }
			})
			this.dispatchEvent(event)

			this.selectedIndex = null // reset selected index
		}
	} */

	updateClasses(oldIndex, newIndex) {
		if (this.log > 0) console.log(oldIndex, newIndex, this.imgs)
		// receives numbers
		if (Number.isInteger(oldIndex)) {
			this.imgs[oldIndex].classList.remove('current')
		} 
		if (Number.isInteger(newIndex)) {
			this.imgs[newIndex].classList.add('current')
		}

		if (this.bulletsCreated) {
			if (Number.isInteger(oldIndex)) this.shadowRoot.querySelector(`#bullet-${oldIndex}`).classList.remove('bullet-current')
			if (Number.isInteger(newIndex)) this.shadowRoot.querySelector(`#bullet-${newIndex}`).classList.add('bullet-current')
		}
	}
}

customElements.define('un-img-lightbox', UnImgLightbox)
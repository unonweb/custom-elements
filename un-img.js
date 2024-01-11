class UnImg extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// DEFAULT VALUES
		this.dataset.theme ??= '';
		this.dataset.shape ??= 'rounded'
		this.dataset.filter ??= null
		this.dataset.hover ??= 'outline'
		this.dataset.mask ??= null
		this.dataset.zoom ??= ''

		/* elements */
		this.img = this.querySelector('img')

		if (this.dataset.zoom === 'zoom') {
			const zoom = document.createElement('div')
			zoom.className = 'zoom'
			zoom.addEventListener('onmousemove', this.zoom)
			zoom.style.backgroundImage = `url("${this.img.src}")`
			this.append(zoom)
		}
	}

	zoom(evt) {
		const zoomer = evt.currentTarget;
		evt.offsetX ? offsetX = evt.offsetX : offsetX = evt.touches[0].pageX
		evt.offsetY ? offsetY = evt.offsetY : offsetX = evt.touches[0].pageX
		x = offsetX / zoomer.offsetWidth * 100
		y = offsetY / zoomer.offsetHeight * 100
		zoomer.style.backgroundPosition = x + '% ' + y + '%';
	}



	handleEvent(evt) {
		switch (evt.type) {
			case 'mousemove':
				this.moveLens(evt)
				break;

		}
	}


}

window.customElements.define('un-img', UnImg);
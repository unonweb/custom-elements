class UnRT extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		
		/* init public */
		this.dataset.theme ??= document.documentElement.dataset.theme
		this.dataset.textAlign ??= 'justify'
		this.dataset.bgMask ??= ''
		
		this.style.setProperty('--random-0-25', this.getRandomInt(0, 25))
		this.style.setProperty('--random-0-50', this.getRandomInt(0, 50))

		if (this.dataset.bgMask === 'polygon') {

			const bg = document.createElement('div')
			bg.className = 'bg-polygon'
			this.append(bg)

			this.style.setProperty('--xTopLeft', `${this.getRandomInt(0, 14)}%`) // margin
			this.style.setProperty('--yTopLeft', `${this.getRandomInt(0, 14)}%`) // margin

			this.style.setProperty('--xT1', `${this.getRandomInt(20, 40)}%`)
			this.style.setProperty('--yT1', `${this.getRandomInt(0, 10)}%`) // margin
			this.style.setProperty('--xT2', `${this.getRandomInt(60, 80)}%`)
			this.style.setProperty('--yT2', `${this.getRandomInt(0, 10)}%`) // margin

			this.style.setProperty('--xTopRight', `${this.getRandomInt(86, 100)}%`) // margin
			this.style.setProperty('--yTopRight', `${this.getRandomInt(0, 14)}%`) // margin

			this.style.setProperty('--xR1', `${this.getRandomInt(88, 100)}%`) // margin
			this.style.setProperty('--yR1', `${this.getRandomInt(20, 40)}%`)
			this.style.setProperty('--xR2', `${this.getRandomInt(88, 100)}%`) // margin
			this.style.setProperty('--yR2', `${this.getRandomInt(60, 80)}%`)

			this.style.setProperty('--xBottomRight', `${this.getRandomInt(86, 100)}%`) // margin
			this.style.setProperty('--yBottomRight', `${this.getRandomInt(86, 100)}%`) // margin

			this.style.setProperty('--xB1', `${this.getRandomInt(60, 80)}%`)
			this.style.setProperty('--yB1', `${this.getRandomInt(86, 100)}%`) // margin
			this.style.setProperty('--xB2', `${this.getRandomInt(20, 40)}%`)
			this.style.setProperty('--yB2', `${this.getRandomInt(86, 100)}%`) // margin

			this.style.setProperty('--xBottomLeft', `${this.getRandomInt(0, 14)}%`) // margin
			this.style.setProperty('--yBottomLeft', `${this.getRandomInt(86, 100)}%`) // margin

			this.style.setProperty('--xL1', `${this.getRandomInt(0, 12)}%`) // margin
			this.style.setProperty('--yL1', `${this.getRandomInt(60, 80)}%`)
			this.style.setProperty('--xL2', `${this.getRandomInt(0, 12)}%`) // margin
			this.style.setProperty('--yL2', `${this.getRandomInt(20, 40)}%`)
		}
	}

	getRandomInt(min, max) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
	}
}

window.customElements.define('un-rt', UnRT)
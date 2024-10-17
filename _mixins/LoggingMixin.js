export default function LoggingMixin(superClass) {
	return class Logging extends superClass {

		static properties = {
			log: { 
				converter: (value) => value.split(',')
			},
		}

		constructor() {
			super();
			this.log ??= [] // ['events', 'lifecycle']
			if (this.log.includes('lifecycle')) {
				console.log(`${this.tagName.toLowerCase()} constructor()`)
			}
		}

		connectedCallback() {
			if (this.log.includes('lifecycle')) {
				console.log(`${this.tagName.toLowerCase()} connected()`)
			}
			if (super.connectedCallback) {
				super.connectedCallback()
			}
		}

		updated(changedProperties) {
			if (this.log.includes('lifecycle')) {
				console.log(`${this.tagName.toLowerCase()} updated()`)
			}
			
			if (super.updated) {
				super.updated(changedProperties)
			}
		}

		firstUpdated() {
			if (this.log.includes('lifecycle')) {
				console.log(`${this.tagName.toLowerCase()} firstUpdated()`)
			}
			if (super.firstUpdated) super.firstUpdated()
		}

		render() {
			if (this.log.includes('lifecycle')) {
				console.log(`${this.tagName.toLowerCase()} render()`)
			}
			if (super.render) {
				super.render()
			}
		}
	}
}
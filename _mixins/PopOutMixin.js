import { LitElement, html } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js';

export default function PopOutMixin(superClass) {
	return class PopOut extends superClass {

		static properties = {
			popout: { type: String, reflect: true }, // 
			//state: { type: String, reflect: true }, // open, closed
			popOn: { type: String, reflect: true, attribute: 'pop-on' },
			popOff: { type: String, reflect: true, attribute: 'pop-off' },
			popState: { type: String, reflect: true, attribute: 'pop-state' },
		}

		constructor() {
			super()
		}

		connectedCallback() {
			super.connectedCallback();

			// get elements
			this._initialButton = this.querySelector(':scope > button')
			this._initialContent = this.querySelector(':scope > .content')
			this._otherElementsToClose = this.querySelectorAll('[state], [data-state]')

			if (this.popOn) {
				this.popOff ??= 'self'
			}
		}

		render() {
			return html`
				${!this._initialButton ? html`
				<button data-html="triplebar">
					<div class="bar one"></div>
					<div class="bar two"></div>
					<div class="bar three"></div>
				</button>` : this._initialButton}`
		}

		firstUpdated() {
			this._button ??= this.querySelector(':scope > button')
			this._content ??= this.querySelector(':scope > .content')
			this._otherElementsToClose ??= this.querySelectorAll('[state], [data-state]')

			this._content.role = 'menu'
			if (!this._content.id) {
				this._content.id = Math.trunc(Math.random() * 10000)
			}
			this._button.setAttribute('aria-controls', this._content.id)
			this._button.ariaLabel = 'menu button'
			this._button.ariaHasPopup = 'menu' //  indicates the availability and type of interactive popup element that can be triggered by the element on which the attribute is set.
			this._button.ariaExpanded = 'false'

			// event listeners
			if (this.popOn === 'click' && this.popOff === 'self') {
				this._button.addEventListener('click', evt => {
					if (this.popState === 'open') {
						this.popState = 'closed'
						this._button.setAttribute('aria-expanded', 'false')
						//this._otherElementsToClose.forEach(el => el.dataset.state = 'off')
					}
					else {
						this.popState = 'open'
						this._button.setAttribute('aria-expanded', 'true')
					}
				})
			}

			/* if (this.popOn === 'click') {
				document.addEventListener('click', evt => this.onclick(evt)) // attach to document in order to listen for outside clicks
			} */

			if (this.popOn === 'hover') {
				this._button.addEventListener('mouseover', evt => {
					this.popState = 'open'
				})
				this._button.addEventListener('mouseleave', evt => {
					this.popState = 'closed'
				})
			}
		}
	}
}
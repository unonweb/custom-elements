import { LitElement, html } from 'lit';
import ToggleController from '../_controllers/ToggleController';
import ToggleControllerAttributes from '../_controllers/ToggleController.attributes';

export default class LitToggle extends LitElement {

	static properties = {
		log: { type: Boolean },
		...ToggleControllerAttributes,
	}

	constructor() {
		super()
	}

	connectedCallback() {
		super.connectedCallback()

		this._content = this.querySelector(':scope > .content')
		this._content ??= this.querySelector(':scope > ul')
		this._content.classList.add('content')

		this._toggle = new ToggleController(this, {
			on: this.toggleOn, 
			off: this.toggleOff, 
			overlay: this.toggleOverlay, 
			anim: this.toggleAnim,
			state: this.toggleState,
			dest: this.toggleDest ?? this._content,
			icon: this.toggleIcon,
			text: this.toggleText,
			log: this.log
		})
	}

	createRenderRoot() {
		return this
	}

	render() {
		return html`
			${(this._toggle) ? this._toggle.render() : ''}
			${(this._content) ? this._content : ''}`
	}
}

window.customElements.define('lit-toggle', LitToggle);
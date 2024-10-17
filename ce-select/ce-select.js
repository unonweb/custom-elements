export default class UnSelect extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		this.dataset.theme ??= document.documentElement.dataset.theme
	}
}
window.customElements.define('ce-select', UnSelect);
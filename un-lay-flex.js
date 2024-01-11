class UnLayFlex extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {

		// init public
		this.dataset.theme ??= '';
		this.dataset.justify ??= 'space-between';
		this.dataset.gap ??= '5%';
		this.style.setProperty('--data-gap', this.dataset.gap);
	}
}
window.customElements.define('un-lay-flex', UnLayFlex);
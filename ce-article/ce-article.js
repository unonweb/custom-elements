import CeBase from '../_classes/CeBase.js';

class CeArticle extends CeBase {
	/*
		@Attributes:
			[data-collapse]		// <selector>
	*/
	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback()

		this.role = 'article'
		// event listeners	
		if (this.dataset.collapse) {
			this.dataset.collapseInit ??= 'expanded' // init with collapsed will cause FOUC!
			let triggers = this.querySelectorAll(this.dataset.collapse)
			triggers.forEach(el => {
				el.dataset.state = this.dataset.collapseInit
				el.classList.add('collapse-trigger')
				el.addEventListener('click', this._onClickTrigger)
			})
		}
	}

	_onClickTrigger = (evt) => {
		let next = evt.target.nextElementSibling
		let addClass
		let removeClass
		
		if (evt.target.dataset.state === 'collapsed') {
			evt.target.dataset.state = 'expanded'
			addClass = 'expanded'
			removeClass = 'collapsed'
		}
		else {
			evt.target.dataset.state = 'collapsed'
			removeClass = 'expanded'
			addClass = 'collapsed'
		}

		while (next && next.tagName !== evt.target.tagName) {
			next.classList.add(addClass)
			next.classList.remove(removeClass)
			next = next.nextElementSibling
		}
	}
}

window.customElements.define('ce-article', CeArticle);
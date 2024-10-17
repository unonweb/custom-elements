import { LitElement } from 'lit';

export default class BaseClass extends LitElement {
	
	constructor() {
		super()
		this._lang ??= (document.documentElement.lang !== '') ? document.documentElement.lang : 'de'
	}

	
}
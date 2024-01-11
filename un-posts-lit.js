//import { LitElement, html, until } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
//import { LitElement, html, until } from 'lit';
//import { LitElement, html, until, unsafeHTML } from '/assets/bundle.js';
//import { LitElement, html, until, unsafeHTML } from '/assets/lib/lit.js';
import { LitElement, html, until, unsafeHTML } from '/assets/lib/lit-3.1.0-all.js';

class UnPostsLit extends LitElement {

	static properties = {
		// public
		tags: { type: String, attribute: 'tags', reflect: true },
		dateStyle: { type: String, attribute: 'date-style', reflect: true },
		postParts: { type: String, attribute: 'post-parts', reflect: true },
		uiParts: { type: String, attribute: 'ui-parts', reflect: true },
		// internal
		sortCriteria: { type: String, state: true },
		sortDirection: { type: String, state: true },
	}

	constructor() {
		super()

		/* init private */
		this.log = 0
		this.filter = {
			tags: []
		}

		/* init public */
		this.theme = this.getAttribute('date-theme')
		this.uiParts ??= ''
		this.postParts ??= ''

		this.sortCriteria = 'date'
		this.sortDirection = 'descending'

		this.prevDateStr = ''
		this.dateOptions = this.setDateOptions(this.getAttribute('date-style'))

		this.asyncReady = this.initAsync(this.getAttribute('src'), this.getAttribute('tags'))

		// event listeners
		this.addEventListener('click', (evt) => {
			if (evt.target.classList.contains('meta')) {
				evt.target.nextElementSibling.classList.toggle('hide')
			}
		})
	}

	createRenderRoot() {
		return this;
	}

	willUpdate(changedProperties) {
		// changedProperties: Map with keys that are the names of changed properties and values that are the corresponding previous values.
		if (changedProperties.has('dateStyle')) {
			this.dateOptions = this.setDateOptions(this.dateStyle)
		}
	}

	render() {
		if (this.log > 0) console.log('render()')
		return html`
				${until(this.asyncReady.then(() => {
			// render posts
			return this.renderPosts()
		}), this.renderLoading())}
				${until(this.asyncReady.then(() => {
			// render controls
			return this.renderCtrls()
		}), this.renderLoading())}
			`
	}

	renderPosts() {
		// this.posts
		// this.dataset.dateStyle

		this.postsFiltered = this.applyFilter(this.posts, this.filter.tags) // filter posts
		this.applySortOrder(this.postsFiltered)

		this.prevDateStr = '' // reset date string (if not changing the sort direction will not work perfectly)
		return html`
			<section class="posts" aria-label="posts">
				${this.postsFiltered.map(post => {
					return html`
						<article class="post" id="${post.id}">
							<header class="meta">
								${this.renderPostsMeta(post)}
							</header>
							<section class="content">
								${unsafeHTML(post.html)}
							</section>
						</article>
					`
				})}
			</section>
		`
	}

	renderLoading() {
		return html`<span>Loading...</span>`
	}

	renderCtrls() {
		if (this.uiParts.length > 0) {
			return html`
				<aside class="ctrls">
					${this.uiParts.split(' ').map(part => {
						switch (part) {
							case 'tags':
								return this.renderCtrlTags()
							case 'sortorder':
								return this.renderCtrlSortOrder()
							case 'toc':
								return this.renderToc()
						}
					})}
				</aside>
				${this.uiParts.includes('backToTopButton') ? this.renderScrollToTop() : ''}
				`
		}
		else {
			return ''
		}
	}

	renderCtrlTags() {
		if (this?.distinctTags?.length > 0) {
			return html`
					<fieldset class="categories" data-theme="default">
						<legend>${this.lang === 'de' ? 'Ausgewählte Kategorien' : this.lang === 'en' ? 'Selected Categories' : ''}</legend>
						${this.distinctTags.map(cat => {
				// loop through categories
				return html`
									<div class="un-input">
										<input 
											type="checkbox" 
											value="${cat}"
											id="check-${cat}"
											?checked=${this.filter.categories.includes(cat)}
											@change="${evt => this.updateTags(evt.target)}"
											data-theme="default" 
											data-entity="&#10005;">
										<label for="check-${cat}">${cat}</label>
									</div>
								`
			})
				}
					</fieldset>
				`
		}
		else {
			return ''
		}
	}

	renderCtrlSortOrder() {
		//${ this.lang === 'de' ? 'Aufsteigend' : this.lang === 'en' ? 'Ascending' : '' }
		//${ this.lang === 'de' ? 'Absteigend' : this.lang === 'en' ? 'Descending' : '' }	
		return html`
				<fieldset class="sortorder" data-theme="default" data-dir="row">
					<legend>
						${this.lang === 'de' ? 'Sortierung' : this.lang === 'en' ? 'Sort Order' : ''}
					</legend>
					<div class="sortcriteria">
						<div class="un-input">
							<input 
								type="radio" 
								name="sortcriteria" 
								value="date" 
								id="radio-date"
								?checked=${this.sortCriteria === 'date'}
								@change="${evt => this.sortCriteria = evt.target.value}"
								data-theme="default">
							<label for="radio-date">${this.lang === 'de' ? 'Datum' : this.lang === 'en' ? 'Date' : ''}</label>
						</div>
					</div>
					
					<div class="sortdirection">
						<div class="un-input">
							<input 
								type="radio" 
								name="sortdirection" 
								value="ascending" 
								id="radio-ascending"
								tabindex="-1"
								?checked=${this.sortDirection === 'ascending'}
								@change="${evt => this.sortDirection = evt.target.value}"
								data-theme="${this.theme}">
							<label 
								for="radio-ascending"
								tabindex="1"
								aria-label=${this.lang === 'de' ? 'Aufsteigende Sortierung' : this.lang === 'en' ? 'Sort Ascending' : ''}>${this.insertSVG('triangleUp')}
							</label>
						</div>
						<div class="un-input">
							<input 
								type="radio" 
								name="sortdirection" 
								value="descending"
								id="radio-descending"
								tabindex="-1"
								?checked=${this.sortDirection === 'descending'}
								@change="${evt => this.sortDirection = evt.target.value}"
								data-theme="${this.theme}">
							<label 
								for="radio-descending"
								tabindex="1"
								aria-label=${this.lang === 'de' ? 'Absteigende Sortierung' : this.lang === 'en' ? 'Sort Descending' : ''}>${this.insertSVG('triangleDown')}
							</label>
						</div>
					</div>
				</fieldset>
			`
	}

	/* renderCtrlSortOrderCategory() {
		return html`
			<div class="un-input">
				<input 
					type="radio" 
					name="sortcriteria" 
					value="category"
					id="radio-category"
					?checked=${this.sortCriteria === 'category'}
					@change="${evt => this.sortCriteria = evt.target.value}"
					data-theme="default">
				<label for="radio-category">${ this.lang === 'de' ? 'Kategorie' : this.lang === 'en' ? 'Category' : '' }</label>
				</div>
			`
	} */

	renderToc() {
		return html`
			<nav aria-label="table of contents">
				<ul class="toc">
					${this.postsFiltered.map(post => {
			//<a class="toc-item" href="#${post.id}">${post.title}</a>
			return html`
						<li>
							<a 
								class="toc-item" 
								@click=${evt => this.scrollToPost(evt)}
								data-dest="${post.id}"
								href="#${post.id}">${post.title}
							</a>			
						</li>
						`
		})}
				</ul>
			</nav>
			`
	}

	renderScrollToTop() {
		return html`
				<a 
					href="#top" 
					aria-label=${this.lang === 'de' ? 'Nach oben scrollen' : this.lang === 'en' ? 'Scroll to top' : ''} 
					@click=${evt => this.scrollToTop(evt)} 
					id="scrollToTop">&#10148;
				</a>
			`
	}

	scrollToPost(evt) {
		evt.preventDefault()
		document.getElementById(evt.target.dataset.dest).scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' })
		//document.getElementById(evt.target.dataset.dest).scrollTo({ top: 0, left: 0, behavior: 'smooth' })
	}

	scrollToTop(evt) {
		evt.preventDefault()
		//document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		document.querySelector('header').scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' })
	}

	renderPostsMeta(post) {
		// this.prevDateStr
		return this.postParts.split(' ').map((part, index) => {
			switch (part) {
				case 'title':
					return html`<h1 class="meta-title">${post.title}</h1>`
				case 'date':
					const dateStr = new Date(post.date).toLocaleString(post.locale, this.dateOptions)
					let str = (dateStr !== this.prevDateStr) ? html`<time class="meta-date">${dateStr}</time>` : ''
					this.prevDateStr = dateStr
					return str
				case 'tags':
					return html`<span class="meta-tags">${post.tags.map(tag => tag.name)}</span></span>`
			}
		})
	}

	async initAsync(src, tags) {
		const res = await fetch(`${location.origin}${src}`)
		const allPosts = await res.json()
		//this.posts = allPosts.filter(post => post.categories.some(cat => categories.split(' ').includes(cat.id)))
		this.posts = allPosts.filter(post => post.tags.some(tag => tags.includes(tag.id)))

		const allTags = []
		const uniqueTags = new Set()
		for (const post of this.posts) {
			const tagNames = []
			for (const tag of post.tags) {
				tagNames.push(tag.name)
				uniqueTags.add(tag.name) // <-- ATT: identify category by name
			}
			allTags.push(tagNames)
		}

		const commonTags = this.getCommonItems(allTags)

		for (const tag of commonTags) {
			uniqueTags.delete(tag)
		}

		this.distinctTags = Array.from(uniqueTags)

		this.filter.categories = this.distinctTags
		if (this.log > 0) console.log('commonTags: ', commonTags)
		if (this.log > 0) console.log('uniqueTags: ', uniqueTags)
		if (this.log > 0) console.log('distinctTags: ', this.distinctTags)
	}

	setDateOptions(dateStyle) {
		// date options
		if (dateStyle === 'year') {
			return { year: 'numeric' }
		}
		else {
			return { dateStyle: dateStyle }
		}
	}

	updateTags(checkbox) {
		switch (checkbox.checked) {
			case true:
				this.filter.tags.push(checkbox.value)
				break;
			case false:
				this.filter.tags = this.filter.tags.filter(tag => tag !== checkbox.value)
				break;
		}

		this.requestUpdate()
		if (this.log > 0) console.log('this.filter.tags: ', this.filter.tags)
	}

	applySortOrder(posts) {
		if (this.sortCriteria === 'date' && this.sortDirection === 'descending') {
			posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) // sort by post date in descending order
		}
		else if (this.sortCriteria === 'date' && this.sortDirection === 'ascending') {
			posts.sort((a, b) => Date.parse(b.date) + Date.parse(a.date)) // sort by post date in descending order
		}
	}

	applyFilter(posts, tags) {
		// filter by category
		// this.uiParts
		// this.distinctCategories
		if (this?.uiParts?.includes('tags') && this.distinctTags.length > 0) {
			posts = posts.filter(post => post.tags.some(tag => tags.includes(tag.name))) // check by name
		}
		return posts
	}

	getCommonItems(arr) {

		let itemCount = [] // an array to hold the count of each elements in the input elements
		let commonItemsArray = [] // an array to hold the common elements in all the array

		// iterates through each elements in the array to find the common elements
		for (let i = 0; i < arr.length; i++) {
			// parent array loop 
			for (let j = 0; j < arr[i].length; j++) {
				// child array loop 
				// check whether we have already find the current element
				if (itemCount[arr[i][j]]) {
					itemCount[arr[i][j]]++ // we have already seen this element, so increment count by one
				} else {
					itemCount[arr[i][j]] = 1 // this is a new element so set the count to 1
				}

				// check the updated count of the current element in the look up table, if the 
				// count is same as the number of input arrays, then its a common element
				if (itemCount[arr[i][j]] == arr.length) {
					// this is a common element, push it to the array
					commonItemsArray.push(arr[i][j])
				}
			}
		}

		//  console.log(commonElementArray)
		return commonItemsArray
	}

	insertSVG(name) {

		switch (name) {
			case 'triangleUp':
				return html`<svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-225.72 -100.94)"><path d="m278.46 105.25c-0.56731-1.1219-1.6096-1.8119-2.7353-1.8119-1.126 0-2.1678 0.69007-2.7353 1.8119l-44.333 87.694c-0.57072 1.1297-0.57587 2.5264-0.0106 3.6605 0.56556 1.1356 1.6113 1.8336 2.7459 1.8336h88.667c1.1329 0 2.1812-0.69994 2.7462-1.8336 0.56389-1.1337 0.56047-2.5306-0.0108-3.6605z"/></g></svg>`
			case 'triangleDown':
				return html`<svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-225.72 -100.94)"><path d="m278.46 196.63c-0.56731 1.1219-1.6096 1.8119-2.7353 1.8119-1.126 0-2.1678-0.69007-2.7353-1.8119l-44.333-87.694c-0.57072-1.1297-0.57587-2.5264-0.0106-3.6605 0.56556-1.1356 1.6113-1.8336 2.7459-1.8336h88.667c1.1329 0 2.1812 0.69994 2.7462 1.8336 0.56389 1.1337 0.56047 2.5306-0.0108 3.6605z"/></g></svg>`
		}
	}

}

window.customElements.define('un-posts-lit', UnPostsLit)
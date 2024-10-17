import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Task } from '@lit/task';

export default class LitPosts extends LitElement {

	static properties = {
		// public
		type: { type: String, reflect: true }, // post type id
		tags: { type: String, reflect: true },
		ui: { type: String, reflect: true },
		collapsible: { type: Boolean, reflect: true },
		prefilter: { type: String }, // exclude-past | only-past
		// internal
		sortCriteria: { type: String, state: true },
		sortDirection: { type: String, state: true },
	}

	static dictionary = {
		'tags': {
			de: 'Tags:',
			en: 'Filter by tags'
		},
		'sort-order': {
			de: 'Sortierung',
			en: 'Sort Order'
		},
		'date': {
			de: 'Datum',
			en: 'Date'
		},
		'sort-ascending': {
			de: 'Aufsteigende Sortierung',
			en: 'Sort Ascending'
		},
		'sort-descending': {
			de: 'Absteigende Sortierung',
			en: 'Sort Descending'
		},
		'scroll-top': {
			de: 'Nach oben scrollen',
			en: 'Scroll to top'
		},
	}

	static translate(key) {
		this._lang ??= (document.documentElement.lang !== '') ? document.documentElement.lang : 'de'
		if (!this.dictionary[key]) {
			return 'undefined'
		}
		return this.dictionary[key][this._lang]
	}

	_log = false

	_getDataTask = new Task(this, {
		task: async ([postTypeID, lang]) => {

			const limit = 0
			const depth = 1
			let url
			switch (this._host) {
				case 'production':
					url = `${location.origin}/assets/posts/${lang}/${postTypeID}.json`
					break
				case 'unonweb':
					url = `https://cms.unonweb.de:3000/api/posts-flex?where[type][equals]=${postTypeID}&locale=${lang}&draft=false&depth=${depth}&limit=${limit}`
					break
				case 'localhost':
					url = `https://cms.localhost:3000/api/posts-flex?where[type][equals]=${postTypeID}&locale=${lang}&draft=false&depth=${depth}&limit=${limit}`
					break
			}

			let res = await fetch(url)
			if (!res.ok) throw new Error(res.status)

			let posts = await res.json()

			if (Array.isArray(posts.docs)) {
				posts = posts.docs
			}

			if (this.prefilter === 'exclude-past') {
				posts = posts.filter(post => Date.parse(post.date_start) > Date.now())
			}
			else if (this.prefilter === 'only-past') {
				posts = posts.filter(post => Date.parse(post.date_start) < Date.now())
			}

			// tags
			this._distinctTags = this._getDistinctTags(posts)
			if (this._log) {
				console.log('distinctTags: ', this._distinctTags)
			}
			return posts
		},
		autoRun: true,
		args: () => [this.type, this._lang]
	})

	constructor() {
		super()
		this._lang ??= document.documentElement.lang ?? 'de'
		this._lang = (this._lang === '') ? 'de' : this._lang
		this._host = this._setHost()
	}

	connectedCallback() {
		super.connectedCallback()

		// init private
		this._filter = {
			tags: []
		}
		this._sortCriteria = 'date'
		this._sortDirection = 'descending'
		this._prevDateStr = ''

		// init public
		this.theme = this.getAttribute('data-theme') ?? document.documentElement.dataset.theme ?? document.documentElement.theme
		this.dataset.theme ??= this.theme

		this.ui ??= ''

		// event listeners
		if (this.collapsible) {
			this.addEventListener('click', (evt) => {
				if (this._log) console.log(evt.target)
				if (evt.target.classList.contains('meta')) {
					evt.target.nextElementSibling.classList.toggle('hide')
				}
			})
		}
	}

	createRenderRoot() {
		return this
	}

	/* RENDER */

	render() {
		if (this._log) console.log('render()')
		return this._getDataTask.render({
			pending: this._renderPending,
			complete: (posts) => this._renderComplete(posts),
			error: (error) => this._renderError(error),
		})
	}

	_renderPending() {
		return html`<loading-spinner></loading-spinner>`
	}

	_renderComplete(posts) {
		this.postsFiltered = this._applyFilter(posts, this._filter.tags) // filter posts
		this._applySortOrder(this.postsFiltered) // sorts posts in place
		this._prevDateStr = '' // reset date string (if not changing the sort direction will not work perfectly)

		return html`
			${this._renderCompleteAside()}
			<div class="posts" aria-label="posts" id="posts-${this.type}">
				${this.postsFiltered.map(post => html`${unsafeHTML(post.html.main)}`)}
			</div>`
	}

	_renderError(error) {
		return html`<p>Oops, something went wrong: ${error}</p>`
	}

	_renderCompleteAside() {
		if (this.ui.length === 0) return ''

		return html`
			<aside class="ctrls">
				${this.ui.includes('sortorder') ? this._renderAsideSortOrder() : ''}
					${this.ui.includes('tags') ? this._renderAsideTags() : ''}
					${this.ui.includes('toc') ? this._renderAsideToc() : ''}
				</aside>
			${this.ui.includes('backToTopButton') ? this._renderScrollToTop() : ''}`
	}

	_renderAsideTags() {
		if (this?._distinctTags?.length === 0) return ''

		return html`
			<fieldset class="tags" data-theme="default">
				<legend>${LitPosts.translate('tags')}</legend>
					${this._distinctTags.map(tag => {
					// loop through tags
					return html`
						<div class="un-input">
							<input 
								type="checkbox" 
								value="${tag}"
								id="check-${tag}"
								?checked=${this._filter.tags.includes(tag)}
								@change="${evt => this._updateFilterTags(evt.target)}"
								data-theme="default" 
								data-entity="&#10005;">
							<label for="check-${tag}">${tag}</label>
						</div>`
				})}
			</fieldset>`
	}

	_renderAsideSortOrder() {
		//${this.lang === 'de' ? 'Aufsteigend' : this.lang === 'en' ? 'Ascending' : ''}
		//${this.lang === 'de' ? 'Absteigend' : this.lang === 'en' ? 'Descending' : ''}	
		return html`
			<fieldset class="sortorder" data-theme="default" data-dir="row">
					<legend>
						${LitPosts.translate('sort-order')}
					</legend>
					<div class="sortcriteria">
						<div class="un-input">
							<input 
								type="radio" 
								name="sortcriteria" 
								value="date" 
								id="radio-date"
								?checked=${this._sortCriteria === 'date'}
								@change="${evt => this._sortCriteria = evt.target.value}"
								data-theme="default">
							<label for="radio-date">${LitPosts.translate('date')}</label>
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
								?checked=${this._sortDirection === 'ascending'}
								@change="${evt => this._sortDirection = evt.target.value}"
								data-theme="${this.theme}">
							<label 
								for="radio-ascending"
								tabindex="1"
								aria-label=${LitPosts.translate('sort-ascending')}>${this._insertSVG('triangleUp')}
							</label>
						</div>
						<div class="un-input">
							<input 
								type="radio" 
								name="sortdirection" 
								value="descending"
								id="radio-descending"
								tabindex="-1"
								?checked=${this._sortDirection === 'descending'}
								@change="${evt => this._sortDirection = evt.target.value}"
								data-theme="${this.theme}">
							<label 
								for="radio-descending"
								tabindex="1"
								aria-label=${LitPosts.translate('sort-descending')}>${this._insertSVG('triangleDown')}
							</label>
						</div>
					</div>
				</fieldset>`
	}

	renderCtrlSortOrderCategory() {
		return html`
			<div class="un-input" >
				<input
					type="radio"
					name="sortcriteria"
					value="category"
					id="radio-category"
					?checked=${this._sortCriteria === 'category'}
					@change="${evt => this._sortCriteria = evt.target.value}"
					data-theme="default" >
				<label for="radio-category">${this.lang === 'de' ? 'Kategorie' : this.lang === 'en' ? 'Category' : ''}</label>
			</div >`
	}

	_renderAsideToc() {
		return html`
		<nav aria-label="table of contents" class="toc">
			<ul>
				${this.postsFiltered.map(post => {
					return html`
						<li>
							<a 
								class="toc-item" 
								@click=${evt => this._scrollToPost(evt)}
								data-dest="${post.id}"
								href="#${post.id}">${post.title}
							</a>			
						</li>`
				})}
			</ul>
		</nav>`
	}

	_renderScrollToTop() {
		return html`
			<a 
				href="#top"
				aria-label=${LitPosts.translate('scroll-top')}
				@click=${evt => this._scrollToTop(evt)}
				id="scrollToTop">&#10148;
			</a>`
	}

	/* EVENTS */

	_scrollToPost(evt) {
		// @click

		evt.preventDefault()
		const postHeader = document.getElementById(evt.target.dataset.dest).querySelector('header')
		const isInViewport = this._isInViewport(postHeader)
		postHeader.classList.toggle('scrolledTo', false) // toggle = false: token will only be removed, but not added
		postHeader.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
		if (isInViewport) {
			// add 'scrolledTo' immediately if no scroll happened
			postHeader.classList.add('scrolledTo')
		} else {
			// add 'scrolledTo' on scroll end
			document.addEventListener('scrollend', (evt) => {
				postHeader.classList.add('scrolledTo')
				if (this._log) console.log('add class "scrolledTo"')
			}, { once: true, passive: true });
		}

		setTimeout(() => {
			postHeader.classList.remove('scrolledTo')
		}, 5000)
		//postHeader.classList.add('clicked')
	}

	_scrollToTop(evt) {
		// @click
		evt.preventDefault()
		document.querySelector('header').scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
		// block: Defines vertical alignment: start, center, end, or nearest. Defaults to start.
		// inline: Defines horizontal alignment: start, center, end, or nearest.Defaults to nearest.
	}

	_updateFilterTags(checkbox) {
		// @change

		switch (checkbox.checked) {
			case true:
				this._filter.tags.push(checkbox.value)
				break;
			case false:
				this._filter.tags = this._filter.tags.filter(tag => tag !== checkbox.value)
				break;
		}

		this.requestUpdate()
		if (this._log) console.log('this._filter.tags: ', this._filter.tags)
	}

	_applyFilter(posts, filterTags) {
		/*
			Task:
				Return array of posts which have 
					a) at least one of the given tags on them
					b) no tags at all
			Requires:
				- this.ui
				- this.distinctTags
		*/

		if (this._distinctTags.length === 0) return posts
		if (this._filter.tags.length === 0) return posts
		if (!this?.ui?.includes('tags')) return posts

		return posts.filter(post => post.tags.some(tag => filterTags.includes(tag.name))) // check by name
	}

	_applySortOrder(posts) {
		// * called by renderPosts()
		// * sorts the posts in place

		if (this._sortCriteria === 'date' && this._sortDirection === 'descending') {
			posts.sort((a, b) => Date.parse(b.date_start) - Date.parse(a.date_start)) // sort by post date in descending order
		}
		else if (this._sortCriteria === 'date' && this._sortDirection === 'ascending') {
			posts.sort((a, b) => Date.parse(a.date_start) - Date.parse(b.date_start)) // sort by post date in ascending order
		}
	}

	/* HELPERS */

	_getDistinctTags(posts) {
		/*
			Task:
				Return an array of distinctive tags
			Requires:
				- tag object on each post
			Mechanism:
				1. Get all unique tags
				2. Get all common tags
				3. Delete all common tags from unique tags --> Distinctive tags (a tag that is on one item but not on another item)
		*/
		const allTags = []
		const uniqueTags = new Set()
		for (const post of posts) {
			const tagNames = []
			post.tags ??= []
			for (const tag of post.tags) {
				tagNames.push(tag.name)
				uniqueTags.add(tag.name) // <-- ATT: identify category by name
			}
			allTags.push(tagNames)
		}

		const commonTags = this._getCommonItems(allTags)

		for (const tag of commonTags) {
			uniqueTags.delete(tag)
		}

		return Array.from(uniqueTags)
	}

	_getCommonItems(arr) {
		/*	
			Task:
				Get common item of array
			Returns:
				Array of common items
		*/

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

		return commonItemsArray
	}

	_insertSVG(name) {

		switch (name) {
			case 'triangleUp':
				return html`<svg version = "1.1" viewBox = "0 0 100 100" xmlns = "http://www.w3.org/2000/svg" > <g transform="translate(-225.72 -100.94)"><path d="m278.46 105.25c-0.56731-1.1219-1.6096-1.8119-2.7353-1.8119-1.126 0-2.1678 0.69007-2.7353 1.8119l-44.333 87.694c-0.57072 1.1297-0.57587 2.5264-0.0106 3.6605 0.56556 1.1356 1.6113 1.8336 2.7459 1.8336h88.667c1.1329 0 2.1812-0.69994 2.7462-1.8336 0.56389-1.1337 0.56047-2.5306-0.0108-3.6605z" /></g></svg>`
			case 'triangleDown':
				return html`<svg version = "1.1" viewBox = "0 0 100 100" xmlns = "http://www.w3.org/2000/svg" > <g transform="translate(-225.72 -100.94)"><path d="m278.46 196.63c-0.56731 1.1219-1.6096 1.8119-2.7353 1.8119-1.126 0-2.1678-0.69007-2.7353-1.8119l-44.333-87.694c-0.57072-1.1297-0.57587-2.5264-0.0106-3.6605 0.56556-1.1356 1.6113-1.8336 2.7459-1.8336h88.667c1.1329 0 2.1812 0.69994 2.7462 1.8336 0.56389 1.1337 0.56047 2.5306-0.0108 3.6605z" /></g></svg>`
		}
	}

	_isInViewport(element) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	_setHost() {
		if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
			return 'localhost'
		}
		else if (location.hostname.includes('unonweb')) {
			return 'unonweb'
		}
		else {
			return 'production'
		}
	}
}

window.customElements.define('lit-posts', LitPosts)
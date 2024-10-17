class Article {
	constructor(article) {
		this.details = article
	}

	
}

document.querySelectorAll('article').forEach(el => {
	new Article(el)
})
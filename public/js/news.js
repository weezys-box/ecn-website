fetch("/news")
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		const newsList = document.getElementById("news-list");
		const newInfo = document.getElementById("news-info");
		if (data.length > 0) {
			newInfo.innerHTML = `<h1>Latest media releases</h1>`;
		} else {
			newInfo.innerHTML = `<h1>Sorry, there are no news at the moment</h1>`;
		}
		data.forEach((news) => {
			const newsElement = document.createElement("div");

			newsElement.innerHTML = `
			<div class='news-view-text'>
            <div class='container'>
            <div class='bucket'>
               <a href='news/${news.id}'>${news.title}</a>
               <p>${news.content}</p>
			   <p>${news.date_created}</p></div>
            </div>
			</div>`;
			newsList.appendChild(newsElement);
		});
	});

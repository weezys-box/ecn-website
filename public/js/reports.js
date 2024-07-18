fetch("/reports")
	.then((response) => response.json())
	.then((data) => {
		const reportList = document.getElementById("report-list");
		console.log(reportList);
		data.forEach((report) => {
			const reportElement = document.createElement("div");
			reportElement.innerHTML = `
			<div class ='report-view'>
			<img style="background-size: contain;
  background-repeat: no-repeat;
  background-position: center;" src = '${report.file_url}'>
			
			<div class='report-view-text'>
			   <h2>${report.title}</h2>
                <p>${report.description}</p>
			
				<a>Download Report<i style='margin-left: 10px;' class="fas fa-download"></i></a>
			</div>
			</div>

           
            
          `;
			reportList.appendChild(reportElement);
			console.log(123);
		});
	});

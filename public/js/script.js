document.addEventListener("DOMContentLoaded", function () {
	const navItem = document.querySelector(".nav-item");
	const nav_itemSmall = document.querySelector(".nav-item-small");
	const dropdownMenu = document.querySelector(".dropdown");
	const dropdownMenuSmall = document.querySelector(".dropdown-small");
	const navPublicationMenu = document.querySelector("#publications");
	const navPublicationMenuDp = document.querySelector(
		"#dropdown-menu-publications"
	);

	const reports = document.getElementById("report-list-home");
	let hideTimeOut;
	let hideTimeOutTwo;

	navItem.addEventListener("mouseenter", function () {
		clearTimeout(hideTimeOut);
		navPublicationMenuDp.style.display = "none";
		dropdownMenuSmall.style.display = "none";
		dropdownMenu.style.display = "flex";
	});

	navItem.addEventListener("mouseleave", function () {
		hideTimeOut = setTimeout(() => {
			dropdownMenu.style.display = "none";
		}, 300);
	});

	// Prevent the menu from disappearing when hovering over the dropdown itself
	nav_itemSmall.addEventListener("mouseenter", function () {
		clearTimeout(hideTimeOut);
		dropdownMenu.style.display = "none";
		navPublicationMenuDp.style.display = "none";
		dropdownMenuSmall.style.display = "block";
		console.log(123);
	});

	nav_itemSmall.addEventListener("mouseleave", function () {
		hideTimeOut = setTimeout(() => {
			dropdownMenuSmall.style.display = "none";
		}, 300);
	});

	// this is the new code

	navPublicationMenu.addEventListener("mouseenter", function () {
		clearTimeout(hideTimeOut);
		dropdownMenu.style.display = "none";
		dropdownMenuSmall.style.display = "none";
		navPublicationMenuDp.style.display = "block";
	});

	navPublicationMenu.addEventListener("mouseleave", function () {
		hideTimeOut = setTimeout(() => {
			navPublicationMenuDp.style.display = "none";
		}, 300);
	});

	// it ends here

	// this is where the code for menu expanded starts
	const parentMenu = document.getElementById("inner-dropdown-menus");
	const dropdownMenuExpanded = document.getElementById("inner-dropdowns");

	// parentMenu.addEventListener("click", function (event) {
	// 	event.stopPropagation();
	// 	dropdownMenuExpanded.classList.toggle("expanded");
	// 	console.log(dropdownMenuExpanded);
	// });

	// dropdownMenu.addEventListener("mouseleave", function () {
	// 	dropdownMenuExpanded.classList.remove("expanded");
	// });

	// document.addEventListener("click", function (event) {
	// 	if (
	// 		!parentMenu.contains(event.target) &&
	// 		!dropdownMenuExpanded.contains(event.target)
	// 	) {
	// 		dropdownMenuExpanded.classList.remove("expanded");
	// 	}
	// });

	parentMenu.addEventListener("click", function (event) {
		// event.preventDefault(); // Prevent the default link behavior
		dropdownMenuExpanded.classList.toggle("expanded");
		console.log(parentMenu, dropdownMenuExpanded);
	});

	dropdownMenuExpanded.addEventListener("mouseleave", function () {
		dropdownMenuExpanded.classList.remove("expanded");
	});

	// reports

	fetch("/reports")
		.then((response) => response.json())
		.then((data) => {
			const reportList = document.getElementById("report-list");
			console.log(reportList);
			data.forEach((report) => {
				const reportElement = document.createElement("div");
				reportElement.innerHTML = `
			<div style='width: 150px; margin: 40px 0' class ='report-view'>
			<img style="background-size: contain; width: 100%;
  background-repeat: no-repeat;
  background-position: center;" src = '${report.file_url}'>
			
			<div class='report-view-text'>
			   <h2 style='font-size: 11px; font-weight: bold'>${report.title}</h2>
                <p style='font-size: 11px'>${report.description}</p>
			
				<a style='font-size: 11px'>Download Report<i style='margin-left: 10px; ' class="fas fa-download"></i></a>
			</div>
			</div>

           
            
          `;
				reports.appendChild(reportElement);
				console.log(123);
			});
		});
});

const formSearch = document.getElementById("form");
let input = document.getElementById("input-pub");

$(document).ready(function () {
	// Handle click to open the dropdown
	$(".dropdown-toggle").click(function (event) {
		event.preventDefault();
		// Hide other open dropdowns
		$(".dropdown").not($(this).next(".dropdown")).slideUp(300);
		// Toggle the clicked dropdown
		$(this).next(".dropdown").stop(true, true).slideToggle(300);
	});

	// Handle click to open the submenu
	$(".submenu-toggle").click(function (event) {
		event.preventDefault();
		// Hide other open submenus
		$(".submenu").not($(this).next(".submenu")).slideUp(300);
		// Toggle the clicked submenu
		$(this).next(".submenu").stop(true, true).slideToggle(300);
	});

	// Handle mouse leave to close the dropdown
	$(".dropdown, .submenu").mouseleave(function () {
		$(this).slideUp(300);
	});

	// Optional: Close dropdown when clicking outside of it
	$(document).click(function (event) {
		if (!$(event.target).closest(".dropdown-toggle, .submenu-toggle").length) {
			$(".dropdown, .submenu").slideUp(300);
		}
	});

	$(".card .activator").on("click", function () {
		$(this).closest(".card").find(".card-reveal").slideToggle("slow");
	});

	$(".card-reveal .card-title").on("click", function () {
		$(this).closest(".card-reveal").slideToggle("slow");
	});

	// Waypoints to detect when the element is in view
	var waypoint = new Waypoint({
		element: $(".counter"),
		handler: function (direction) {
			// Trigger the counter up when the element is in view
			$(".counter").each(function () {
				var $this = $(this),
					countTo = $this.attr("data-count");

				$({ countNum: $this.text() }).animate(
					{
						countNum: countTo,
					},
					{
						duration: 5000, // Duration of the counting animation in milliseconds
						easing: "swing",
						step: function () {
							$this.text(Math.floor(this.countNum));
						},
						complete: function () {
							$this.text(this.countNum);
						},
					}
				);
			});

			// Destroy the waypoint after it has been triggered
			this.destroy();
		},
		offset: "bottom-in-view",
	});

	// hidden-text js
});

document.addEventListener("DOMContentLoaded", function () {
	const hiddenText = document.querySelector(".hidden-text");

	const handleScroll = () => {
		const rect = hiddenText.getBoundingClientRect();
		const windowHeight =
			window.innerHeight || document.documentElement.clientHeight;

		if (rect.top <= windowHeight && rect.bottom >= 0) {
			hiddenText.classList.add("visible", "animate__fadeInUp");
			window.removeEventListener("scroll", handleScroll);
		}
	};

	window.addEventListener("scroll", handleScroll);
	handleScroll(); // Initial check in case the element is already visible
});

function showSearch() {
	console.log("show search");
	let searchPub = document.getElementById("search-publications");
	const pubInput = document.getElementById("publications-input");
	searchPub.style.display = "block";

	const deleteIcn = document.getElementById("delete-icon");

	deleteIcn.style.display = "block";
	pubInput.style.display = "block";

	deleteIcn.addEventListener("click", () => {
		searchPub.style.display = "none";
		deleteIcn.style.display = "none";
		pubInput.style.display = "none";
	});
}

deleteIcn.addEventListener("click", () => {
	console.log(123);
});

formSearch.addEventListener("submit", (e) => {
	e.preventDefault();
	input = input.value.trim();

	try {
		fetch("/search", {
			// Replace '/api/endpoint' with your actual API endpoint
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ input }), // Send the input value as a JSON payload
		});
	} catch (error) {
		console.error("Error sending input value:", error);
	}
});

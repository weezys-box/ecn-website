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
});

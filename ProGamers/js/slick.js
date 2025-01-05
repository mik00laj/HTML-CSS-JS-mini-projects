$('.team-carousel-slick').slick(
	// obiekt
	{
		mobileFirst: true,
		arrows: false,
		autoplay: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 767,
				settings: { slidesToShow: 2 },
			},

			{
				breakpoint: 991,
				settings: { slidesToShow: 3 },
			},
		],
	}
)

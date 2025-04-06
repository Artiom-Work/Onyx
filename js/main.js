'use strict';

//for block chats

const swiper = new Swiper('.swiper', {
	direction: 'horizontal',
	slidesPerView: "auto",
	centeredSlides: true,
	loop: true,

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});
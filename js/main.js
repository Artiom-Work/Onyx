'use strict';
const blockUserSelectChat = document.querySelector('.user-field__button-select-wrapper');
console.log(blockUserSelectChat);
//for block chats

const swiper = new Swiper('.swiper', {
	direction: 'horizontal',
	slidesPerView: "auto",
	centeredSlides: true,
	loop: true,
	grabCursor: true,

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

// for select chat button in block user-field 

blockUserSelectChat.addEventListener('click', function (e) {
	blockUserSelectChat.querySelector('.decor-triangle').classList.toggle('decor-triangle--rotate');
});
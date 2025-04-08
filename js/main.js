'use strict';
const blockUserSelectChat = document.querySelector('.user-field__button-select-wrapper');
const userSelectChatButton = document.querySelector('.user-field__select');
let clickSelectCounter = 0;



//for block chats

const swiper = new Swiper('.swiper', {
	direction: 'vertical',
	slidesPerView: 1,
	spaceBetween: 38,
	centeredSlides: false,
	loop: true,
	grabCursor: true,

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	breakpoints: {
		0: {
			direction: 'vertical'
		},
		1024: {
			direction: 'horizontal',
			slidesPerView: 2
		}
	}
});

// for select chat button in block user-field 

userSelectChatButton.addEventListener('focus', function (e) {
	if (e) {
		blockUserSelectChat.querySelector('.decor-triangle').classList.add('decor-triangle--rotate');
	}
});
userSelectChatButton.addEventListener('blur', function (e) {
	if (e) {
		blockUserSelectChat.querySelector('.decor-triangle').classList.remove('decor-triangle--rotate');
		clickSelectCounter = 0;
	}
});
blockUserSelectChat.addEventListener('click', function (e) {
	clickSelectCounter = clickSelectCounter + 1;
	if (clickSelectCounter > 1) {
		blockUserSelectChat.querySelector('.decor-triangle').classList.remove('decor-triangle--rotate');
		clickSelectCounter = 0;
	} else {
		blockUserSelectChat.querySelector('.decor-triangle').classList.add('decor-triangle--rotate');
	}
});
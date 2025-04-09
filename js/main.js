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

document.addEventListener('DOMContentLoaded', function () {
	const select = document.querySelector('.user-field__select')
	const buttonTextSpan = document.querySelector('.user-field__button-text')

	select.addEventListener('change', function () {
		const selectedOption = this.options[this.selectedIndex]
		buttonTextSpan.textContent = selectedOption.textContent
	})
})

//============
// Версия с анимацией плавной печати для сообщений бота
const chatForm = document.getElementById('user-field');
const messageInput = document.getElementById('message');
const userChatSelect = document.getElementById('user-chat-selection');
const messageList = document.querySelector('.chat-body__message-list');
const initialBotMessageText = "Добрый день. Чем я могу вам помочь ?";

const BOT_MESSAGES_KEY = 'botMessages';
const ALL_MESSAGES_KEY = 'messages';

chatForm.addEventListener('submit', handleFormSubmit);
window.addEventListener('load', initializeChat);

// ============================================================================
// =========================  Functions  =======================================
// ============================================================================

function createBotMessage(messageText, index) {
	return `
		<li class="chat-body__message-item chat-message chat-message--bot" data-message-index="${index}">
			<div class="chat-message__controls">
				<button class="chat-message__controls-button" type="button" title="Копировать сообщение">
					<svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
						<use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
					</svg>
					<span class="visually-hidden">Копировать сообщение</span>
				</button>
				<button class="chat-message__controls-button repeat-message-button" type="button" title="Повторить сообщение">
					<svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
						<use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
					</svg>
					<span class="visually-hidden">Повторить сообщение</span>
				</button>
			</div>
			<article class="chat-message__wrapper">
				<img class="chat-message__image chat-message__image--bot" src="./images/icons/head.svg" alt="Икнока волшебника" width="39" height="44" loading="lazy">
				<div class="chat-message__text">
					<p class="bot-message-text"></p>
				</div>
			</article>
		</li>
	`;
}

function createUserMessage(messageText, index) {
	return `
		<li class="chat-body__message-item chat-message chat-message--user" data-message-index="${index}">
			<div class="chat-message__controls">
				<button class="chat-message__controls-button" type="button" title="Копировать сообщение">
					<svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
						<use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
					</svg>
					<span class="visually-hidden">Копировать сообщение</span>
				</button>
				<button class="chat-message__controls-button repeat-message-button" type="button" title="Повторить сообщение">
					<svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
						<use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
					</svg>
					<span class="visually-hidden">Повторить сообщение</span>
				</button>
			</div>
			<article class="chat-message__wrapper">
				<img class="chat-message__image" src="./images/icons/user.svg" alt="Икнока пользователя" width="32" height="32" loading="lazy">
				<div class="chat-message__text">
					<p>${messageText}</p>
				</div>
			</article>
		</li>
	`;
}

function addMessageToList(messageHTML) {
	messageList.insertAdjacentHTML('beforeend', messageHTML);
}

function getSelectData() {
	return {
		name: userChatSelect.name,
		value: userChatSelect.value,
		text: userChatSelect.options[userChatSelect.selectedIndex].text
	};
}

function saveMessageToLocalStorage(messageData) {
	let messages = JSON.parse(localStorage.getItem(ALL_MESSAGES_KEY)) || [];
	messages.push(messageData);
	localStorage.setItem(ALL_MESSAGES_KEY, JSON.stringify(messages));
}

function getMessagesFromLocalStorage() {
	return JSON.parse(localStorage.getItem(ALL_MESSAGES_KEY)) || [];
}

function displayAllMessages() {
	messageList.innerHTML = '';
	let allMessages = getMessagesFromLocalStorage();

	allMessages.forEach((messageData, index) => {
		let messageHTML = '';
		if (messageData.type === 'bot') {
			messageHTML = createBotMessage(messageData.message, index);
			addMessageToList(messageHTML);
			animateBotMessage(messageList.lastElementChild, messageData.message);
		} else {
			messageHTML = createUserMessage(messageData.message, index);
			addMessageToList(messageHTML);
		}
	});
}

function createAndDisplayFirstBotMessage() {
	let allMessages = getMessagesFromLocalStorage();
	if (allMessages.length === 0) {
		const botMessageData = {
			type: 'bot',
			message: initialBotMessageText
		};
		saveMessageToLocalStorage(botMessageData);
		const messageHTML = createBotMessage(initialBotMessageText, 0);
		addMessageToList(messageHTML);
		animateBotMessage(messageList.lastElementChild, initialBotMessageText);
	}
}

function handleFormSubmit(event) {
	event.preventDefault();

	const messageText = messageInput.value;

	if (messageText.trim() !== "") {

		// Сохраняем сообщение пользователя
		const userMessageData = {
			type: 'user',
			message: messageText,
		};
		saveMessageToLocalStorage(userMessageData);

		let messageHTML = createUserMessage(messageText, 0);
		addMessageToList(messageHTML);

		const selectData = getSelectData();

		// Создаем и сохраняем ответ бота
		const botResponseText = `Извините, не могу ответить на ваш вопрос с помощью ${selectData.text}, ожидается настройка приложения...`;
		const botMessageData = {
			type: 'bot',
			message: botResponseText
		};
		saveMessageToLocalStorage(botMessageData);

		messageHTML = createBotMessage(botResponseText, 0);
		addMessageToList(messageHTML);

		// Запускаем анимацию печати
		animateBotMessage(messageList.lastElementChild, botResponseText);

		messageInput.value = '';
	} else {
		console.log('Сообщение пустое, ничего не сохраняется.');
	}
}

// ============================================================================
// ==================  Typing animation  ======================================
// ============================================================================

function animateBotMessage(messageElement, messageText) {
	const textElement = messageElement.querySelector('.bot-message-text');
	textElement.textContent = '';
	let i = 0;
	const intervalId = setInterval(() => {
		textElement.textContent += messageText.charAt(i);
		i++;
		if (i > messageText.length - 1) {
			clearInterval(intervalId);
		}
	}, 20);
}

// ============================================================================
// ================== Initialize Chat Function ===============================
// ============================================================================

function initializeChat() {
	displayAllMessages();
	createAndDisplayFirstBotMessage();
}







































// Версия с анимацией плавной печати для сообщений бота
// const chatForm = document.getElementById('user-field');
// const messageInput = document.getElementById('message');
// const userChatSelect = document.getElementById('user-chat-selection');
// const messageList = document.querySelector('.chat-body__message-list');
// const initialBotMessageText = "Добрый день. Чем я могу вам помочь ?";

// const BOT_MESSAGES_KEY = 'botMessages';
// const ALL_MESSAGES_KEY = 'messages';

// chatForm.addEventListener('submit', handleFormSubmit);
// window.addEventListener('load', initializeChat);

// // ============================================================================
// // =========================  Functions  =======================================
// // ============================================================================

// function createBotMessage(messageText, index) {
// 	return `
// 		<li class="chat-body__message-item chat-message chat-message--bot" data-message-index="${index}">
// 			<div class="chat-message__controls">
// 				<button class="chat-message__controls-button" type="button" title="Копировать сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
// 					</svg>
// 					<span class="visually-hidden">Копировать сообщение</span>
// 				</button>
// 				<button class="chat-message__controls-button repeat-message-button" type="button" title="Повторить сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
// 					</svg>
// 					<span class="visually-hidden">Повторить сообщение</span>
// 				</button>
// 			</div>
// 			<article class="chat-message__wrapper">
// 				<img class="chat-message__image chat-message__image--bot" src="./images/icons/head.svg" alt="Икнока волшебника" width="39" height="44" loading="lazy">
// 				<div class="chat-message__text">
// 					<p class="bot-message-text"></p>
// 				</div>
// 			</article>
// 		</li>
// 	`;
// }

// function createUserMessage(messageText, index) {
// 	return `
// 		<li class="chat-body__message-item chat-message chat-message--user" data-message-index="${index}">
// 			<div class="chat-message__controls">
// 				<button class="chat-message__controls-button" type="button" title="Копировать сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
// 					</svg>
// 					<span class="visually-hidden">Копировать сообщение</span>
// 				</button>
// 				<button class="chat-message__controls-button repeat-message-button" type="button" title="Повторить сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
// 					</svg>
// 					<span class="visually-hidden">Повторить сообщение</span>
// 				</button>
// 			</div>
// 			<article class="chat-message__wrapper">
// 				<img class="chat-message__image" src="./images/icons/user.svg" alt="Икнока пользователя" width="32" height="32" loading="lazy">
// 				<div class="chat-message__text">
// 					<p>${messageText}</p>
// 				</div>
// 			</article>
// 		</li>
// 	`;
// }

// function addMessageToList(messageHTML) {
// 	messageList.insertAdjacentHTML('beforeend', messageHTML);
// }

// function getSelectData() {
// 	return {
// 		name: userChatSelect.name,
// 		value: userChatSelect.value,
// 		text: userChatSelect.options[userChatSelect.selectedIndex].text
// 	};
// }

// function saveMessageToLocalStorage(messageData) {
// 	let messages = JSON.parse(localStorage.getItem(ALL_MESSAGES_KEY)) || [];
// 	messages.push(messageData);
// 	localStorage.setItem(ALL_MESSAGES_KEY, JSON.stringify(messages));
// }

// function getMessagesFromLocalStorage() {
// 	return JSON.parse(localStorage.getItem(ALL_MESSAGES_KEY)) || [];
// }

// function displayAllMessages() {
// 	messageList.innerHTML = '';
// 	let allMessages = getMessagesFromLocalStorage();

// 	allMessages.forEach((messageData, index) => {
// 		let messageHTML = '';
// 		if (messageData.type === 'bot') {
// 			messageHTML = createBotMessage(messageData.message, index);
// 			addMessageToList(messageHTML);
// 			animateBotMessage(messageList.lastElementChild, messageData.message);
// 		} else {
// 			messageHTML = createUserMessage(messageData.message, index);
// 			addMessageToList(messageHTML);
// 		}
// 	});
// }

// function createAndDisplayFirstBotMessage() {
// 	let allMessages = getMessagesFromLocalStorage();
// 	if (allMessages.length === 0) {
// 		const botMessageData = {
// 			type: 'bot',
// 			message: initialBotMessageText
// 		};
// 		saveMessageToLocalStorage(botMessageData);
// 		const messageHTML = createBotMessage(initialBotMessageText, 0);
// 		addMessageToList(messageHTML);
// 		animateBotMessage(messageList.lastElementChild, initialBotMessageText);
// 	}
// }

// function handleFormSubmit(event) {
// 	event.preventDefault();

// 	const messageText = messageInput.value;

// 	if (messageText.trim() !== "") {

// 		// Сохраняем сообщение пользователя
// 		const userMessageData = {
// 			type: 'user',
// 			message: messageText,
// 		};
// 		saveMessageToLocalStorage(userMessageData);

// 		let messageHTML = createUserMessage(messageText, 0);
// 		addMessageToList(messageHTML);

// 		const selectData = getSelectData();

// 		// Создаем и сохраняем ответ бота
// 		const botResponseText = `Извините, не могу ответить на ваш вопрос с помощью ${selectData.text}, ожидается настройка приложения...`;
// 		const botMessageData = {
// 			type: 'bot',
// 			message: botResponseText
// 		};
// 		saveMessageToLocalStorage(botMessageData);

// 		messageHTML = createBotMessage(botResponseText, 0);
// 		addMessageToList(messageHTML);

// 		// Запускаем анимацию печати
// 		animateBotMessage(messageList.lastElementChild, botResponseText);

// 		messageInput.value = '';
// 	} else {
// 		console.log('Сообщение пустое, ничего не сохраняется.');
// 	}
// }

// // ============================================================================
// // ==================  Typing animation  ======================================
// // ============================================================================

// function animateBotMessage(messageElement, messageText) {
// 	const textElement = messageElement.querySelector('.bot-message-text');
// 	textElement.textContent = '';
// 	let i = 0;
// 	const intervalId = setInterval(() => {
// 		textElement.textContent += messageText.charAt(i);
// 		i++;
// 		if (i > messageText.length - 1) {
// 			clearInterval(intervalId);
// 		}
// 	}, 20);
// }

// // ============================================================================
// // ================== Initialize Chat Function ===============================
// // ============================================================================

// function initializeChat() {
// 	displayAllMessages();
// 	createAndDisplayFirstBotMessage();
// }








// Версия с ответами бота на сообщения пользователя
// const chatForm = document.getElementById('user-field');
// const messageInput = document.getElementById('message');
// const userChatSelect = document.getElementById('user-chat-selection');
// const messageList = document.querySelector('.chat-body__message-list');
// const initialBotMessageText = "Добрый день. Чем я могу вам помочь ?";

// const BOT_MESSAGES_KEY = 'botMessages';
// const ALL_MESSAGES_KEY = 'messages';

// chatForm.addEventListener('submit', handleFormSubmit);
// window.addEventListener('load', displayAllMessages);

// function createBotMessage(messageText, index) {
// 	return `
// 		<li class="chat-body__message-item chat-message chat-message--bot" data-message-index="${index}">
// 			<div class="chat-message__controls">
// 				<button class="chat-message__controls-button" type="button" title="Копировать сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
// 					</svg>
// 					<span class="visually-hidden">Копировать сообщение</span>
// 				</button>
// 				<button class="chat-message__controls-button" type="button" title="Повторить сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
// 					</svg>
// 					<span class="visually-hidden">Повторить сообщение</span>
// 				</button>
// 			</div>
// 			<article class="chat-message__wrapper">
// 				<img class="chat-message__image chat-message__image--bot" src="./images/icons/head.svg" alt="Икнока волшебника" width="39" height="44" loading="lazy">
// 				<div class="chat-message__text">
// 					<p>${messageText}</p>
// 				</div>
// 			</article>
// 		</li>
// 	`;
// }

// function createUserMessage(messageText, index) {
// 	return `
// 		<li class="chat-body__message-item chat-message chat-message--user" data-message-index="${index}">
// 			<div class="chat-message__controls">
// 				<button class="chat-message__controls-button" type="button" title="Копировать сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
// 					</svg>
// 					<span class="visually-hidden">Копировать сообщение</span>
// 				</button>
// 				<button class="chat-message__controls-button" type="button" title="Повторить сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
// 					</svg>
// 					<span class="visually-hidden">Повторить сообщение</span>
// 				</button>
// 			</div>
// 			<article class="chat-message__wrapper">
// 				<img class="chat-message__image" src="./images/icons/user.svg" alt="Икнока пользователя" width="32" height="32" loading="lazy">
// 				<div class="chat-message__text">
// 					<p>${messageText}</p>
// 				</div>
// 			</article>
// 		</li>
// 	`;
// }

// function addMessageToList(messageHTML) {
// 	messageList.insertAdjacentHTML('beforeend', messageHTML);
// }

// function saveBotMessageToLocalStorage(messageText) {
// 	let messages = JSON.parse(localStorage.getItem(BOT_MESSAGES_KEY)) || [];
// 	messages.push(messageText);
// 	localStorage.setItem(BOT_MESSAGES_KEY, JSON.stringify(messages));
// 	return messages.length - 1;
// }

// function getSelectData() {
// 	return {
// 		name: userChatSelect.name,
// 		value: userChatSelect.value,
// 		text: userChatSelect.options[userChatSelect.selectedIndex].text
// 	};
// }

// function saveMessageToLocalStorage(messageData) {
// 	let messages = JSON.parse(localStorage.getItem(ALL_MESSAGES_KEY)) || [];
// 	messages.push(messageData);
// 	localStorage.setItem(ALL_MESSAGES_KEY, JSON.stringify(messages));
// }

// function getMessagesFromLocalStorage() {
// 	return JSON.parse(localStorage.getItem(ALL_MESSAGES_KEY)) || [];
// }

// function displayAllMessages() {
// 	let messages = getMessagesFromLocalStorage();
// 	messageList.innerHTML = '';

// 	// Отображаем сообщения из localStorage
// 	messages.forEach((messageData, index) => {
// 		let messageHTML = '';
// 		if (messageData.type === 'bot') {
// 			messageHTML = createBotMessage(messageData.message, index);
// 		} else {
// 			messageHTML = createUserMessage(messageData.message, index);
// 		}
// 		addMessageToList(messageHTML);
// 	});

// 	// Если нет сообщений пользователя, отображаем первое сообщение бота
// 	if (messages.length === 0) {
// 		createAndDisplayFirstBotMessage();
// 	}
// }

// function createAndDisplayFirstBotMessage() {
// 	let messages = JSON.parse(localStorage.getItem(BOT_MESSAGES_KEY)) || [];
// 	if (messages.length === 0) {
// 		const messageIndex = saveBotMessageToLocalStorage(initialBotMessageText);
// 		const messageHTML = createBotMessage(initialBotMessageText, messageIndex);
// 		addMessageToList(messageHTML);
// 	}
// }

// function handleFormSubmit(event) {
// 	event.preventDefault();

// 	const messageText = messageInput.value;

// 	if (messageText.trim() !== "") {
// 		const selectData = getSelectData();

// 		// Сохраняем сообщение пользователя
// 		const messageData = {
// 			type: 'user',
// 			message: messageText,
// 			select: selectData
// 		};
// 		saveMessageToLocalStorage(messageData);
// 		const messageIndex = getMessagesFromLocalStorage().length - 1;
// 		const messageHTML = createUserMessage(messageText, messageIndex);
// 		addMessageToList(messageHTML);

// 		// Создаем и сохраняем ответ бота
// 		const botResponseText = `Извините, не могу ответить на ваш вопрос с помощью ${selectData.text}, ожидается настройка приложения...`;
// 		const botMessageData = {
// 			type: 'bot',
// 			message: botResponseText
// 		};
// 		saveMessageToLocalStorage(botMessageData);
// 		const botMessageIndex = getMessagesFromLocalStorage().length - 1;
// 		const botMessageHTML = createBotMessage(botResponseText, botMessageIndex);
// 		addMessageToList(botMessageHTML);

// 		messageInput.value = '';
// 	} else {
// 		console.log('Сообщение пустое, ничего не сохраняется.');
// 	}
// }
















// ============Первое сообщение бота + отображение сообщения пользователя
// const chatForm = document.getElementById('user-field');
// const messageInput = document.getElementById('message');
// const userChatSelect = document.getElementById('user-chat-selection');
// const messageList = document.querySelector('.chat-body__message-list');
// const initialBotMessageText = "Добрый день. Чем я могу вам помочь ?";
// const BOT_MESSAGES_KEY = 'botMessages';
// const ALL_MESSAGES_KEY = 'messages';

// chatForm.addEventListener('submit', handleFormSubmit);
// window.addEventListener('load', createAndDisplayFirstBotMessage);

// // Функция для создания сообщения бота
// function createBotMessage(messageText, index) {
// 	return `
// 		<li class="chat-body__message-item chat-message chat-message--bot" data-message-index="${index}">
// 			<div class="chat-message__controls">
// 				<button class="chat-message__controls-button" type="button" title="Копировать сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
// 					</svg>
// 					<span class="visually-hidden">Копировать сообщение</span>
// 				</button>
// 				<button class="chat-message__controls-button" type="button" title="Повторить сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
// 					</svg>
// 					<span class="visually-hidden">Повторить сообщение</span>
// 				</button>
// 			</div>
// 			<article class="chat-message__wrapper">
// 				<img class="chat-message__image chat-message__image--bot" src="./images/icons/head.svg" alt="Икнока волшебника" width="39" height="44" loading="lazy">
// 				<div class="chat-message__text">
// 					<p>${messageText}</p>
// 				</div>
// 			</article>
// 		</li>
// 	`;
// }

// // Функция для создания сообщения пользователя
// function createUserMessage(messageText, index) {
// 	return `
// 		<li class="chat-body__message-item chat-message chat-message--user" data-message-index="${index}">
// 			<div class="chat-message__controls">
// 				<button class="chat-message__controls-button" type="button" title="Копировать сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
// 					</svg>
// 					<span class="visually-hidden">Копировать сообщение</span>
// 				</button>
// 				<button class="chat-message__controls-button" type="button" title="Повторить сообщение">
// 					<svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
// 						<use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
// 					</svg>
// 					<span class="visually-hidden">Повторить сообщение</span>
// 				</button>
// 			</div>
// 			<article class="chat-message__wrapper">
// 				<img class="chat-message__image" src="./images/icons/user.svg" alt="Икнока пользователя" width="32" height="32" loading="lazy">
// 				<div class="chat-message__text">
// 					<p>${messageText}</p>
// 				</div>
// 			</article>
// 		</li>
// 	`;
// }

// // Функция для добавления сообщения в список на странице
// function addMessageToList(messageHTML) {
// 	messageList.insertAdjacentHTML('beforeend', messageHTML);
// }

// // Функция для сохранения сообщений в localStorage
// function saveBotMessageToLocalStorage(messageText) {
// 	let messages = JSON.parse(localStorage.getItem(BOT_MESSAGES_KEY)) || [];
// 	messages.push(messageText);
// 	localStorage.setItem(BOT_MESSAGES_KEY, JSON.stringify(messages));
// 	return messages.length - 1; // Возвращаем индекс нового сообщения
// }

// // Функция для создания и отображения первого сообщения бота при загрузке страницы
// function createAndDisplayFirstBotMessage() {
// 	let messages = JSON.parse(localStorage.getItem(BOT_MESSAGES_KEY)) || [];
// 	if (messages.length === 0) {
// 		// Сохраняем сообщение в localStorage
// 		const messageIndex = saveBotMessageToLocalStorage(initialBotMessageText);

// 		// Создаем сообщение и добавляем его на страницу
// 		const messageHTML = createBotMessage(initialBotMessageText, messageIndex);
// 		addMessageToList(messageHTML);
// 	} else {
// 		// Если сообщения уже есть, можно загрузить только первое
// 		const firstMessage = messages[0];
// 		const messageHTML = createBotMessage(firstMessage, 0);
// 		addMessageToList(messageHTML);
// 	}
// }

// // Функция для получения данных из select
// function getSelectData() {
// 	return {
// 		name: userChatSelect.name, // Атрибут name
// 		value: userChatSelect.value, // Выбранное значение
// 		text: userChatSelect.options[userChatSelect.selectedIndex].text // Выбранный текст
// 	};
// }

// // Функция для сохранения сообщений в localStorage
// function saveMessageToLocalStorage(messageData) {
// 	let messages = getMessagesFromLocalStorage();
// 	messages.push(messageData);
// 	localStorage.setItem(ALL_MESSAGES_KEY, JSON.stringify(messages));
// }

// // Функция для получения сообщений из localStorage
// function getMessagesFromLocalStorage() {
// 	return JSON.parse(localStorage.getItem(ALL_MESSAGES_KEY)) || [];
// }

// // Функция для отображения сообщений из localStorage
// function displayMessagesFromLocalStorage() {
// 	const messages = getMessagesFromLocalStorage();
// 	messages.forEach((messageData, index) => {
// 		let messageHTML;
// 		if (messageData.type === 'bot') {
// 			messageHTML = createBotMessage(messageData.message, index);
// 		} else {
// 			messageHTML = createUserMessage(messageData.message, messageData.select, index);
// 		}
// 		addMessageToList(messageHTML);
// 	});
// }

// // Функция для обработки отправки формы
// function handleFormSubmit(event) {
// 	event.preventDefault();

// 	const messageText = messageInput.value;

// 	if (messageText.trim() !== "") {
// 		const selectData = getSelectData();

// 		// Формируем объект с данными сообщения и select
// 		const messageData = {
// 			type: 'user',
// 			message: messageText,
// 			select: selectData
// 		};

// 		saveMessageToLocalStorage(messageData);
// 		const messages = getMessagesFromLocalStorage();
// 		const messageIndex = messages.length - 1;
// 		const messageHTML = createUserMessage(messageText, selectData, messageIndex);
// 		addMessageToList(messageHTML);
// 		messageInput.value = '';
// 	} else {
// 		console.log('Сообщение пустое, ничего не сохраняется.');
// 	}
// }

// // Загружаем сообщения из localStorage при загрузке страницы
// displayMessagesFromLocalStorage();




// ============Добавление сообщений + названия чата в селекте в локал стор
// const chatForm = document.getElementById('user-field');
// const messageInput = document.getElementById('message');
// const userChatSelect = document.getElementById('user-chat-selection');

// chatForm.addEventListener('submit', handleFormSubmit);

// // Функция для получения данных из select
// function getSelectData() {
// 	return {
// 		name: userChatSelect.name, // Атрибут name
// 		value: userChatSelect.value, // Выбранное значение
// 		text: userChatSelect.options[userChatSelect.selectedIndex].text // Выбранный текст
// 	};
// }

// // Функция для сохранения сообщений в localStorage
// function saveMessageToLocalStorage(messageData) {
// 	let messages = getMessagesFromLocalStorage();
// 	messages.push(messageData);
// 	localStorage.setItem('messages', JSON.stringify(messages));
// }

// // Функция для обработки отправки формы
// function handleFormSubmit(event) {
// 	event.preventDefault();

// 	const messageText = messageInput.value;

// 	if (messageText.trim() !== "") {
// 		const selectData = getSelectData();

// 		// Формируем объект с данными сообщения и select
// 		const messageData = {
// 			message: messageText,
// 			select: selectData
// 		};

// 		saveMessageToLocalStorage(messageData);
// 		messageInput.value = ''; // Очищаем поле после сохранения
// 	} else {
// 		console.log('Сообщение пустое, ничего не сохраняется.');
// 	}
// }

// // Функция для получения сообщений из localStorage
// function getMessagesFromLocalStorage() {
// 	return JSON.parse(localStorage.getItem('messages')) || [];
// }

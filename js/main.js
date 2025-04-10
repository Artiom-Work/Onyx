'use strict';
// ==================== Global variables ====================
const blockUserSelectChat = document.querySelector('.user-field__button-select-wrapper');
const userSelectChatButton = document.querySelector('.user-field__select');
const chatForm = document.getElementById('user-field');
const messageInput = document.getElementById('message');
const userChatSelect = document.getElementById('user-chat-selection');
const messageList = document.querySelector('.chat-body__message-list');
const initialBotMessageText = "Добрый день. Чем я могу вам помочь?";
const ALL_MESSAGES_KEY = 'messages';
let clickSelectCounter = 0;
// ==================== EventListeners ====================
userSelectChatButton.addEventListener('focus', handleSelectFocus);
userSelectChatButton.addEventListener('blur', handleSelectBlur);
blockUserSelectChat.addEventListener('click', handleSelectClick);
chatForm.addEventListener('submit', handleFormSubmit);
window.addEventListener('load', initializeChat);
messageList.addEventListener('click', handleMessageListClick);
messageInput.addEventListener('keydown', handleMessageInputKeydown);

document.addEventListener('DOMContentLoaded', function () {
	const select = document.querySelector('.user-field__select');
	const buttonTextSpan = document.querySelector('.user-field__button-text');
	select.addEventListener('change', function () {
		buttonTextSpan.textContent = this.options[this.selectedIndex].textContent;
	});
});
// ==================== Swiper ====================
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
// ==================== Functions for working with select ====================
function handleSelectFocus(e) {
	if (e) {
		blockUserSelectChat.querySelector('.decor-triangle').classList.add('decor-triangle--rotate');
	}
}

function handleSelectBlur(e) {
	if (e) {
		blockUserSelectChat.querySelector('.decor-triangle').classList.remove('decor-triangle--rotate');
		clickSelectCounter = 0;
	}
}

function handleSelectClick(e) {
	clickSelectCounter = clickSelectCounter + 1;
	if (clickSelectCounter > 1) {
		blockUserSelectChat.querySelector('.decor-triangle').classList.remove('decor-triangle--rotate');
		clickSelectCounter = 0;
	} else {
		blockUserSelectChat.querySelector('.decor-triangle').classList.add('decor-triangle--rotate');
	}
}
// =================== Functions for working with messages ====================
function getSelectData() {
	return {
		name: userChatSelect.name,
		value: userChatSelect.value,
		text: userChatSelect.options[userChatSelect.selectedIndex].text
	};
}

function createBotMessage(messageText, index) {
	return `
        <li class="chat-body__message-item chat-message chat-message--bot" data-message-index="${index}">
            <h3 class="visually-hidden">Сообщение с ответом ONYXbot чата</h3>
            <div class="chat-message__controls">
                <button class="chat-message__controls-button" type="button" title="Копировать сообщение">
                    <svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
                        <use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
                    </svg>
                </button>
                <button class="chat-message__controls-button repeat-message-button" type="button" title="Повторить сообщение">
                    <svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
                        <use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
                    </svg>
                </button>
            </div>
            <article class="chat-message__wrapper">
                <h4 class="visually-hidden">Текст сообщения с товетом ONYXbot чата</h4>
                <img class="chat-message__image chat-message__image--bot" src="./images/icons/head.svg" alt="Бот" width="39" height="44">
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
            <h4 class="visually-hidden">Вопроса пользователя к ONYXbot чату</h4>
            <div class="chat-message__controls">
                <button class="chat-message__controls-button" type="button" title="Копировать сообщение">
                    <svg class="chat-message__controls-icon" viewBox="0 0 32 32" width="20" height="20">
                        <use xlink:href="./images/icons/sprite-icons.svg#copy"></use>
                    </svg>
                </button>
                <button class="chat-message__controls-button repeat-message-button" type="button" title="Повторить сообщение">
                    <svg class="chat-message__controls-icon" viewBox="0 0 24 24" width="20" height="20">
                        <use xlink:href="./images/icons/sprite-icons.svg#refresh-message"></use>
                    </svg>
                </button>
            </div>
            <article class="chat-message__wrapper">
                <h4 class="visually-hidden">Текст вопроса пользователя к ONYXbot чату</h4>
                <img class="chat-message__image" src="./images/icons/user.svg" alt="Пользователь" width="32" height="32">
                <div class="chat-message__text">
                    <p>${messageText}</p>
                </div>
            </article>
        </li>
    `;
}

function addMessageToList(messageHTML) {
	messageList.insertAdjacentHTML('beforeend', messageHTML);
	const newMessage = messageList.lastElementChild;

	if (newMessage.classList.contains('chat-message--user')) {
		setTimeout(() => {
			newMessage.classList.add('visible');
		}, 10);
	}

	return newMessage;
}

function saveMessageToLocalStorage(messageData, selectData = null) {
	const messages = JSON.parse(localStorage.getItem(ALL_MESSAGES_KEY)) || [];

	if (messageData.type === 'user' && selectData) {
		messageData.selectedOption = selectData;
	}

	messages.push(messageData);
	localStorage.setItem(ALL_MESSAGES_KEY, JSON.stringify(messages));
}

function getMessagesFromLocalStorage() {
	return JSON.parse(localStorage.getItem(ALL_MESSAGES_KEY)) || [];
}

function handleFormSubmit(event) {
	event.preventDefault();
	const messageText = messageInput.value.trim();

	if (!messageText) return;

	const allMessages = getMessagesFromLocalStorage();
	const selectData = getSelectData();

	const userMessageData = { type: 'user', message: messageText };
	saveMessageToLocalStorage(userMessageData, selectData);

	messageInput.classList.add('message-fade-out');
	const userMessageHTML = createUserMessage(messageText, allMessages.length);
	addMessageToList(userMessageHTML);

	setTimeout(() => {
		const botResponseText = `Извините, не могу ответить на ваш вопрос с помощью ${selectData.text}, ожидается настройка приложения...`;
		const botMessageData = { type: 'bot', message: botResponseText };
		saveMessageToLocalStorage(botMessageData);

		const botMessageHTML = createBotMessage(botResponseText, allMessages.length + 1);
		const botMessageElement = addMessageToList(botMessageHTML);

		const textElement = botMessageElement.querySelector('.bot-message-text');
		textElement.textContent = '';
		animateBotMessage(textElement, botResponseText);

		messageInput.value = '';
		messageInput.classList.remove('message-fade-out');

		scrollToBottom();
	}, 500);
}

function animateBotMessage(textElement, messageText) {
	let i = 0;
	const intervalId = setInterval(() => {
		if (i < messageText.length) {
			textElement.textContent += messageText.charAt(i);
			i++;
		} else {
			clearInterval(intervalId);
		}
	}, 20);
}

function displayAllMessages() {
	messageList.innerHTML = '';
	const allMessages = getMessagesFromLocalStorage();

	allMessages.forEach((messageData, index) => {
		const messageHTML = messageData.type === 'bot'
			? createBotMessage(messageData.message, index)
			: createUserMessage(messageData.message, index);

		const messageElement = addMessageToList(messageHTML);

		if (messageData.type === 'bot') {
			const textElement = messageElement.querySelector('.bot-message-text');
			textElement.textContent = messageData.message;
		}
	});

	scrollToBottom();
}

function initializeChat() {
	localStorage.clear();
	displayAllMessages();

	const allMessages = getMessagesFromLocalStorage();
	if (allMessages.length === 0) {
		const botMessageData = { type: 'bot', message: initialBotMessageText };
		saveMessageToLocalStorage(botMessageData);

		const botMessageHTML = createBotMessage(initialBotMessageText, 0);
		const botMessageElement = addMessageToList(botMessageHTML);

		const textElement = botMessageElement.querySelector('.bot-message-text');
		textElement.textContent = '';
		animateBotMessage(textElement, initialBotMessageText);
	}
}

function scrollToBottom() {
	messageList.scrollTop = messageList.scrollHeight;
}

function handleMessageListClick(event) {
	const repeatButton = event.target.closest('.repeat-message-button');
	if (repeatButton) {
		const messageItem = repeatButton.closest('.chat-body__message-item');
		const messageIndex = parseInt(messageItem.dataset.messageIndex);
		const allMessages = getMessagesFromLocalStorage();
		const messageToRepeat = allMessages[messageIndex];

		if (!messageToRepeat) return;

		if (messageToRepeat.type === 'user') {
			messageInput.value = messageToRepeat.message;

			if (messageToRepeat.selectedOption) {
				const options = userChatSelect.options;
				for (let i = 0; i < options.length; i++) {
					if (options[i].value === messageToRepeat.selectedOption.value) {
						userChatSelect.selectedIndex = i;
						document.querySelector('.user-field__button-text').textContent =
							messageToRepeat.selectedOption.text;
						break;
					}
				}
			}

			chatForm.dispatchEvent(new Event('submit'));
		} else {
			const botResponseText = messageToRepeat.message;
			const newIndex = allMessages.length;

			const botMessageHTML = createBotMessage(botResponseText, newIndex);
			const botMessageElement = addMessageToList(botMessageHTML);

			const textElement = botMessageElement.querySelector('.bot-message-text');
			textElement.textContent = '';
			animateBotMessage(textElement, botResponseText);

			scrollToBottom();

			const botMessageData = {
				type: 'bot',
				message: botResponseText
			};
			saveMessageToLocalStorage(botMessageData);
		}
	}

	const copyButton = event.target.closest('.chat-message__controls-button:not(.repeat-message-button)');
	if (copyButton) {
		const messageItem = copyButton.closest('.chat-body__message-item');
		const messageText = messageItem.querySelector('.chat-message__text p').textContent;

		navigator.clipboard.writeText(messageText)
			.then(() => {
				copyButton.classList.add('copied-effect');
				setTimeout(() => copyButton.classList.remove('copied-effect'), 300);
			})
			.catch(err => {
				console.error('Ошибка копирования:', err);
				const textarea = document.createElement('textarea');
				textarea.value = messageText;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
			});
	}
}

function handleMessageInputKeydown(event) {
	if (event.key === 'Enter') {
		if (!event.shiftKey) {
			event.preventDefault();

			if (messageInput.value.trim() !== '') {
				chatForm.dispatchEvent(new Event('submit'));
			}
		}
	}
}












//================ Для разработчиков =================


// ЧАТ-ИНТЕРФЕЙС: ОСНОВНАЯ ЛОГИКА
//
// Принцип работы:
// 1. Инициализация:
//  - Создается слайдер чатов (Swiper)
//  - Загружается история сообщений из localStorage
//  - Если история пуста - бот отправляет приветствие
//
// 2. Взаимодействие:
//  - Select с анимацией вращения треугольника
//  - Отправка сообщений по Enter/кнопке
//  - Автосохранение в localStorage
//  - Имитация ответа бота с анимацией печати
//
// 3. Особенности:
//  - Все сообщения хранятся ТОЛЬКО ДО ПЕРЕЗАГРУЗКИ
//  (т.к. initializeChat очищает localStorage)
//
// Рекомендации по доработке:
// 1. Для сохранения истории между сессиями:
//  - Убрать localStorage.clear() в initializeChat()
//  - Реализовать очистку по дате/времени
//
// 2. Для реальной интеграции с AI:
//  - Заменить заглушку в handleFormSubmit()
//  - Добавить обработку ошибок API


//------------------==== Функции ===--------------------------
// handleSelectFocus(e)
// Обрабатывает фокус на элементе выбора чата. Добавляет класс для поворота треугольного декоратора.

// handleSelectBlur(e)
// Обрабатывает потерю фокуса элемента выбора чата. Убирает класс поворота и сбрасывает счетчик кликов.

// handleSelectClick(e)
// Управляет кликами по блоку выбора чата. Переключает состояние треугольного декоратора.

// getSelectData()
// Возвращает объект с данными выбранного чата: имя, значение и текст опции.

// createBotMessage(messageText, index)
// Генерирует HTML-шаблон сообщения от бота с указанным текстом и индексом.

// createUserMessage(messageText, index)
// Создает HTML-шаблон сообщения пользователя с текстом и индексом.

// addMessageToList(messageHTML)
// Добавляет сообщение в список чата и возвращает созданный элемент.

// saveMessageToLocalStorage(messageData, selectData)
// Сохраняет сообщение в localStorage с возможностью прикрепления данных выбора чата.

// getMessagesFromLocalStorage()
// Извлекает все сообщения из localStorage или возвращает пустой массив.

// handleFormSubmit(event)
// Обрабатывает отправку формы: сохраняет сообщение, показывает его, генерирует ответ бота.

// animateBotMessage(textElement, messageText)
// Анимирует появление текста сообщения бота посимвольно.

// displayAllMessages()
// Отображает все сообщения из localStorage в чате.

// initializeChat()
// Инициализирует чат: очищает хранилище и показывает приветственное сообщение.

// scrollToBottom()
// Прокручивает список сообщений до последнего элемента.

// handleMessageListClick(event)
// Обрабатывает клики в списке сообщений: повтор и копирование.

// handleMessageInputKeydown(event)
// Управляет вводом с клавиатуры: отправка по Enter без Shift.

// Swiper инициализация
// Настраивает слайдер чатов с адаптивным поведением (вертикальный/горизонтальный).


//------------------==== Обработчики событий ===--------------------------

//********** Обработчики элементов интерфейса:***********
// 1.1. userSelectChatButton.addEventListener('focus', handleSelectFocus)


// Срабатывает при фокусировке на select-элементе выбора чата

// Визуально поворачивает треугольник-индикатор (добавляет класс decor-triangle--rotate)

// 1.2. userSelectChatButton.addEventListener('blur', handleSelectBlur)


// Активируется при потере фокуса select-элементом

// Возвращает треугольник-индикатор в исходное состояние

// Сбрасывает счетчик кликов (clickSelectCounter = 0)

// 1.3. blockUserSelectChat.addEventListener('click', handleSelectClick)


// Обрабатывает клики по блоку выбора чата

// Реализует toggle-логику для треугольного индикатора:

// Первый клик - поворот

// Второй клик - возврат в исходное положение

// Сбрасывает счетчик после второго клика


//********** Системные обработчики: ***********


// 2.1. document.addEventListener('DOMContentLoaded', function)


// Инициализирует привязку выбранного значения select к тексту кнопки

// Обновляет текст кнопки при изменении выбора (change событие)

// 2.2. window.addEventListener('load', initializeChat)


// Запускает инициализацию чата после полной загрузки страницы

// Восстанавливает историю сообщений из localStorage

// Показывает приветственное сообщение бота для новых сессий


//********** Обработчики формы чата: ***********


// 3.1. chatForm.addEventListener('submit', handleFormSubmit)


// Перехватывает отправку формы (preventDefault)

// Валидирует введенный текст (не пустая строка)

// Сохраняет сообщение пользователя в localStorage

// Имитирует ответ бота с задержкой 500мс

// Управляет анимациями (исчезновение поля ввода, появление сообщений)

// 3.2. messageInput.addEventListener('keydown', handleMessageInputKeydown)


// Обрабатывает нажатие Enter в поле ввода

// Отправляет сообщение при нажатии Enter (без Shift)

// Блокирует перенос строки при обычном Enter

// Сохраняет возможность переноса при Shift+Enter


//********** Обработчики сообщений: ***********


// 4.1. messageList.addEventListener('click', handleMessageListClick)


// Определяет тип действия по цели клика:

// Кнопка повторения (repeat-message-button):

// Для пользовательских сообщений: подставляет текст в поле ввода

// Для сообщений бота: дублирует сообщение

// Кнопка копирования (иконка копии):

// Копирует текст сообщения в буфер обмена

// Визуальный фидбек (эффект "copied-effect")

// Fallback для старых браузеров (execCommand)

// Особенности обработки событий:

// Все обработчики используют делегирование событий

// Учет состояния через data-атрибуты (data-message-index)

// Поддержка touch-событий через стандартные click-обработчики





//P.S. TELEGRAM -- @ArtiomMezheynikov





























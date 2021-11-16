'use strict';

const socket = io();

//
//-----------PART   elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
//------
//========= PART TEMPLATES ==================
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector(
	'#location-message-template'
).innerHTML;

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
//
//
//-----------PART  OPTIONS
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});
//----------------------------------------------------------------
//-----------NOTE  --AUTOSCROLL--
const autoscroll = () => {
	// New message element
	const $newMessage = $messages.lastElementChild;

	//Height of new message
	const newMessageStyles = getComputedStyle($newMessage);
	const newMessageMargin = parseInt(newMessageStyles.marginBottom);
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

	//visible height
	const visibleHeight = $messages.offsetHeight;

	//Height of messages container
	const containerHeight = $messages.scrollHeight;

	// How far have i scrolled?
	const scrollOffset = $messages.scrollTop + visibleHeight;
	console.log(containerHeight, newMessageHeight, scrollOffset);
	console.log($messages.scrollTop);
	console.log($messages.scrollHeight);
	if (containerHeight - newMessageHeight <= scrollOffset) {
		console.log('|YOOOOOOOOOO_----------');
		console.log($messages.scrollTop);
		console.log($messages.scrollHeight);
		$messages.scrollTop = $messages.scrollHeight;
	}
};
//----------------------------------------------------------------
//-----------NOTE  --MESSAGE--
socket.on('message', message => {
	console.log(message);
	const html = Mustache.render(messageTemplate, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
	autoscroll();
});

//----------------------------------------------------------------
//-----------NOTE  SENDMESSAGE
$messageForm.addEventListener('submit', e => {
	e.preventDefault();
	$messageFormButton.setAttribute('disabled', 'disabled');
	// disable

	const message = e.target.elements.message.value;
	socket.emit('sendMessage', message, error => {
		$messageFormButton.removeAttribute('disabled');
		$messageFormInput.value = '';
		$messageFormInput.focus();
		//enable
		if (error) return console.log(error);
		//
		console.log('Message delivered');
	});
});
//----------------------------------------------------------------
//-----------NOTE  --SENDLOCATION
$sendLocationButton.addEventListener('click', () => {
	if (!navigator.geolocation)
		return alert('Geolocation is not supported by your browser');

	$sendLocationButton.setAttribute('disabled', 'disabled');

	navigator.geolocation.getCurrentPosition(position => {
		socket.emit(
			'sendLocation',
			{
				long: position.coords.longitude,
				lat: position.coords.latitude,
			},
			() => {
				$sendLocationButton.removeAttribute('disabled');
				console.log('Location shared!');
			}
		);
	});
});
//----------------------------------------------------------------
//-----------NOTE  --LOCATIONMESSAGE
socket.on('locationMessage', ({ username, url }) => {
	console.log(url);
	const html = Mustache.render(locationMessageTemplate, {
		username,
		url,
		createdAt: moment(url.createdAt).format('h:mm a'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
	autoscroll();
});
//----------------------------------------------------------------
//-----------NOTE  --ROOMDATA
socket.on('roomData', ({ room, users }) => {
	const html = Mustache.render(sidebarTemplate, {
		room,
		users,
	});
	document.querySelector('#sidebar').innerHTML = html;
});
//----------------------------------------------------------------
//-----------NOTE   --JOIN--
socket.emit('join', { username, room }, error => {
	if (error) {
		alert(error);
		location.href = '/';
	}
});

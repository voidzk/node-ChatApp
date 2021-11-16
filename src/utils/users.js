'use strict';

const users = [];

//
//-----------SECTION  addUser

const addUser = ({ id, username, room }) => {
	//
	//-----------PART  clean the data
	//
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();
	//
	//-----------PART  Validate the data
	if (!username || !room)
		return {
			error: 'Username and room are required',
		};
	//-----------PART  check for existing user
	//
	const existingUser = users.find(user => {
		return user.room === room && user.username === username;
	});
	//-----------PART  Validate username
	if (existingUser)
		return {
			error: 'Username is in use!',
		};
	//-----------PART  Store user
	//
	const user = {
		id,
		username,
		room,
	};
	users.push(user);
	return { user };
};
//---------------------------------------------------------------
//-----------SECTION  removeUser
const removeUser = id => {
	const index = users.findIndex(user => user.id === id);
	if (index !== -1) return users.splice(index, 1)[0];
};

//---------------------------------------------------------------
//-----------SECTION  getUser
//
const getUser = id => {
	return users.find(user => user.id === id);
};
//---------------------------------------------------------------
//-----------SECTION  getUsersInRoom
//
const getUsersInRoom = room => {
	room = room.trim().toLowerCase();
	return users.filter(user => user.room === room);
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
};



module.exports = function(server){

	var fs = require('fs');
	var io = require('socket.io')(server);

	// Emit past comments from JSON to Socket
	var sendComments = function (socket) {
		fs.readFile('_comments.json', 'utf8', function(err, comments) {
			comments = JSON.parse(comments);
			socket.emit('comments', comments);
		});
	};
	// Open Socket
	io.on('connection', function (socket) {
	 socket.broadcast.emit('New client connected!');

	  socket.on('fetchComments', function () {
			sendComments(socket);
		});

		// On new message
		socket.on('newComment', function (comment, callback) {
			fs.readFile('_comments.json', 'utf8', function(err, comments) {
				comments = JSON.parse(comments);
				comments.push(comment);
				fs.writeFile('_comments.json', JSON.stringify(comments, null, 4), function (err) {
					io.emit('comments', comments);
					callback(err);
				});
			});
		});
		// On User Typing
		socket.on('typist', function (author) {
			io.emit('typist', author);
		});

	});
};

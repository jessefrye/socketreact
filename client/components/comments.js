
var $ = require('jquery');
var	 React = require('react');

var CommentBox = React.createClass({
	getInitialState: function () {
		return {
			comments: null,
			typist : null
		};
	},
	componentDidMount: function () {
		var that = this;
		this.socket = io();
		this.socket.on('comments', function (comments) {
			that.setState({ comments: comments });
		});
		this.socket.on('typist', function (author) {
			that.setState({ typist: author });
		});
		this.socket.emit('fetchComments');
	},
	submitComment: function (comment, callback) {
		// remove typing indicator
		this.socket.emit('typist', null);
		// submit message
		this.socket.emit('newComment', comment, function (err) {
			if (err) {
				return console.error('New comment error:', err);
			} else {
					var scrollPosition = $('.message-list > div').height();
					$('.message-list').scrollTop(scrollPosition);
					callback();
			}
		});
	},
	handleTyping : function(author){
		this.socket = io();
		// if the input has letters typed
		if(author){
				this.socket.emit('typist', author);
		} else {
			this.socket.emit('typist', null);
		}
	},
	render: function() {
		return (
			<div className="messages-container">
				<CommentList comments={this.state.comments}/>
				<div className="message-form-container">
					<Typist author={this.state.typist}/>
					<CommentForm submitComment={this.submitComment} handleTyping={this.handleTyping} />
				</div>
			</div>
		);
	}
});

var CommentList = React.createClass({
	render: function () {
		var Comments = (<div>Loading comments...</div>);
		if (this.props.comments) {
			Comments = this.props.comments.map(function (comment, index) {
				return (<Comment key={index} comment={comment} />);
			});
		}
		return (
			<div className="message-list">
				<div className="inner-container">{Comments}</div>
			</div>
		);
	}
});

var Comment = React.createClass({
	render: function () {
		var localAuthor =  window.localStorage.getItem('author');
		var msgClass = 'message';
		if (this.props.comment.author === window.localStorage.getItem('author')) {
			msgClass = 'message author';
		}
		return (
			<div className={ msgClass }>
				<div className="message-block">
					<h5 hidden>{this.props.comment.author}</h5>
					<p>{this.props.comment.text}</p>
				</div>
			</div>
		);
	}
});

var Notification = React.createClass({
	render: function () {
			return (
				<div className="notification-container">
					{this.props.notification && <p>{this.props.notification}</p>}
				</div>
			);
	}
});

var Typist = React.createClass({
	render: function () {
			return (
				<div className="typing">
						{this.props.author && <span className="author">{this.props.author} is typing...</span>}
				</div>
			);
	}
});

var CommentForm = React.createClass({
	getInitialState: function () {
		var localAuthor = window.localStorage.getItem('author');
		return {
			author : localAuthor ? localAuthor : null
		};
	},
	onChange : function(e){
		var textLength = this.refs.text.getDOMNode().value.length;
		var author = this.state.author ? this.state.author : this.refs.author.getDOMNode().value;
		if(textLength){
			this.props.handleTyping(author);
		} else {
			this.props.handleTyping(false);
		}
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var that = this;
		var author = this.state.author ? this.state.author : this.refs.author.getDOMNode().value;
		var text = this.refs.text.getDOMNode().value;
		var comment = { author: author, text: text };
		var submitButton = this.refs.submitButton.getDOMNode();
		submitButton.setAttribute('disabled', 'disabled');

		this.props.submitComment(comment, function (err) {
			that.setState({author : author});
			// save author to localstorage for future visits
			window.localStorage.setItem('author', author);
			that.refs.text.getDOMNode().value = '';
			submitButton.removeAttribute('disabled');
		});
	},
	render: function () {
		return (
			<div>
			<form className="message-form" onSubmit={this.handleSubmit}>
				{this.state.author ? <p>{this.state.author}:</p> : <input type="text" name="author" ref="author" placeholder="Hi! What's your name?" required />}
				<section className="message-submit">
					<div>
						<input type="text" name="text" ref="text" placeholder="Message..." required onChange={this.onChange}  />
					</div>
					<div>
						<button type="submit" ref="submitButton"></button>
					</div>
				</section>
			</form>
			</div>
		);
	}
});

module.exports = CommentBox;

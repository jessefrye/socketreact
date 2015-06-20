
var	 React = require('react'),
		Header = require('./components/header'),
		Footer = require('./components/footer'),
		CommentBox = require('./components/comments'),
		App;

App = React.createClass({

	render: function () {
		return <section className="layout-container">
			<div className="main-column">
				<Header/>
				<CommentBox/>
			</div>
			<div className="info-column">

			</div>
		</section>;
	}
});

React.render(<App/>, document.getElementById('app-container'));

module.exports = App;


// react templates
// https://github.com/wix/react-templates

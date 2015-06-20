
var React = require('react'),
        Header;

Header = React.createClass({
    render: function () {
        return <header className="banner">
            <div className="inner-container">
                <h1>
                    <img src="images/logo-rad.png" alt="Radical"/>
                </h1>
            </div>
        </header>
    }
});

module.exports = Header;

//clientside javascript

// var React = require('react');
var ReactDOM = require('react-dom');
// var Component = require('./Component.jsx');
var routes = require('./routes/routes.jsx');

// var props = window.PROPS;

ReactDOM.render(
	routes, document.getElementById("app")
);
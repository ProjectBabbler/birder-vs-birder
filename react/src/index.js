import { render } from 'react-dom';
require('babel-polyfill');
var routes = require('./routes');
var ContextProvider = require('./ContextProvider');
var React = require('react');

render((
    <ContextProvider>
        {routes}
    </ContextProvider>
), document.getElementById('root'));
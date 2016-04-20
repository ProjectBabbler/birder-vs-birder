import { render } from 'react-dom';
require('babel-polyfill');
var routes = require('./routes');

render(routes, document.getElementById('root'));
import { render } from 'react-dom';
require('babel-polyfill');
require('../styles/CustomStyles.css');

var routes = require('./routes');

render(routes, document.getElementById('root'));
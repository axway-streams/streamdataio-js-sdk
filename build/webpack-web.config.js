const webpackBase = require('./webpack-base.config');

const TARGET = 'web';
const ENTITIES = ['core-js/fn/string', 'eventsource-polyfill', './index.ts'];

module.exports = webpackBase(TARGET, ENTITIES, false);


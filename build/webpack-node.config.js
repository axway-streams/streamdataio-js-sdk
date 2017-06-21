const webpackBase = require('./webpack-base.config');

const TARGET = 'node';
const ENTITIES = ['core-js/fn/string', 'eventsource/lib/eventsource', './index.ts'];

module.exports = webpackBase(TARGET, ENTITIES);
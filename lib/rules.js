'use strict';

var $ = require('bluebird'),
    fs = require('fs');

var searchArray = function (haystack, needle) {
  var i;
  for (i = 0; i < haystack.length; i++) {
    if (haystack[i].indexOf(needle) >= 0) {
      return i;
    }
  }
  return -1;
}

module.exports = function (config) {
  var handlers = [],
      i,
      rules;

  rules = fs.readdirSync(__dirname + '/rules');
  for (i = 0; i < rules.length; i++) {
    rules[i] = __dirname + '/rules/' + rules[i];
  }

  Object.keys(config.rules).forEach(function (rule) {
    var fullRule = config.rules[rule],
	ruleSearch;
    // Only seek out rules that are enabled
    if ((typeof fullRule === 'number' && fullRule !== 0) || (typeof fullRule === 'object' && fullRule[0] !== 0)) {
      ruleSearch = searchArray(rules, rule);
      if (ruleSearch >= 0) {
	handlers.push({
	  'rule': require(rules[ruleSearch]),
	  'severity': typeof fullRule === 'number' ? fullRule : fullRule[0],
	  'options': typeof fullRule === 'object' ? fullRule[1] : {}
	});
      }
      else {
	throw new Error('Rule `' + rule + '` could not be found!');
      }
    }
  });

  return handlers;
}
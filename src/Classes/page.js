'use strict';

var $util = require('../util'),
    PageField = require('./PageField'),
    PageAction = require('./PageAction');

/**
 * Page class.
 * @param {*} properties - Properties for the new page.
 * @class
 */
function Page(properties) {

    var _self = this;

    this.caption = '';
    this.type = '';
    this.sourceID = '';
    this.icon = '';
    /** @type {PageField[]} */
    this.fields = [];
    /** @type {PageAction[]} */
    this.actions = [];
    this.view = '';
    this.deleteAllowed = false;
    this.insertAllowed = false;
    this.tabList = [];
    this.showFilters = false;
    this.runFunctionOnCancel = false;
    this.runDblClickOnNew = false;
    this.skipRecordLoad = false;
    this.allowExternal = false;

    if (typeof properties !== 'undefined') {

        // Extend the page.
        $util.extend(this, properties);

        // Extend the page fields.
        this.fields = [];
        $util.forEach(properties.fields, function(field) {
            _self.fields.push(new PageField(field));
        });

        // Extend the page actions.
        this.actions = [];
        $util.forEach(properties.actions, function(action) {
            _self.actions.push(new PageAction(action));
        });
    }
}

module.exports = Page;

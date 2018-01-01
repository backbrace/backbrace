'use strict';

var $util = require('../util'),
    PageField = require('./pagefield'),
    PageAction = require('./pageaction');

/**
 * Page class.
 * @param {*} properties - Properties for the new page.
 * @class
 */
function Page(properties) {

    var self = this;

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
            self.fields.push(new PageField(field));
        });

        // Extend the page actions.
        this.actions = [];
        $util.forEach(properties.actions, function(action) {
            self.actions.push(new PageAction(action));
        });
    }
}

module.exports = Page;

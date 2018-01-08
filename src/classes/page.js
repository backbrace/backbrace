'use strict';

var $util = require('../util'),
    PageField = require('./pagefield'),
    PageAction = require('./pageaction'),
    PageTab = require('./pagetab');

/**
 * Page class.
 * @class
 * @private
 * @param {*} properties Properties for the new page.
 */
function Page(properties) {

    var self = this;

    this.caption = '';
    this.type = 'Card';
    this.sourceID = '';
    this.controller = '';
    this.icon = '';
    /** @type {PageField[]} */
    this.fields = [];
    /** @type {PageAction[]} */
    this.actions = [];
    /** @type {PageTab[]} */
    this.tabs = [];
    this.view = '';
    this.options = '';
    this.deleteAllowed = false;
    this.insertAllowed = false;
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

        // Extend the page tabs.
        this.tabs = [];
        $util.forEach(properties.tabs, function(tab) {
            self.tabs.push(new PageTab(tab));
        });
    }
}

module.exports = Page;

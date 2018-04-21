/**
 * Meta data module. Get object meta data from cache, JSON files or data.
 * @module meta
 * @private
 */
'use strict';

var code = require('./code'),
    http = require('./http'),
    settings = require('./settings'),
    util = require('./util'),
    defaults = {
        /** @type {PageMeta} */
        page: {
            name: '',
            caption: '',
            component: 'cardcomponent',
            controller: '',
            icon: '',
            factbox: false,
            fields: [],
            actions: [],
            tabs: []
        },
        /** @type {PageFieldMeta} */
        pagefield: {
            name: '',
            caption: '',
            type: 'Text',
            component: '',
            tab: '',
            width: '100px',
            editable: true,
            hidden: false,
            desktopOnly: false,
            mobileOnly: false,
            password: false,
            leftColumn: false,
            rightColumn: false
        },
        /** @type {PageActionMeta} */
        pageaction: {
            name: '',
            text: '',
            icon: '',
            className: '',
            desktopOnly: false,
            mobileOnly: false
        },
        /** @type {PageTabMeta} */
        pagetab: {
            name: '',
            text: '',
            pageName: '',
            icon: '',
            desktopOnly: false,
            mobileOnly: false,
            factbox: false
        }
    };

/**
 * Get page object meta data.
 * @param {string} name Name of the page to get.
 * @returns {JQueryPromise} Promise to get the page meta data.
 */
function page(name) {
    return code.block(
        function() {
            // Get the page from a JSON file.
            return http.get(settings.meta.dir + 'pages/' + name + '.json');
        },
        /**
         * @param {PageMeta} json JSON object.
         * @returns {PageMeta} Returns the merged page,
         */
        function mergePage(json) {

            // Merge the json with default values.
            var $ = require('./external/jquery');

            json.caption = json.caption || json.name;

            // Extend the page.
            var pge = $.extend({}, defaults.page, json);

            // Extend the page fields.
            pge.fields = [];
            $.each(json.fields, function(index, field) {
                field.caption = field.caption || field.name;
                pge.fields.push($.extend({}, defaults.pagefield, field));
            });

            // Extend the page actions.
            pge.actions = [];
            $.each(json.actions, function(index, action) {
                action.text = action.text || action.name;
                pge.actions.push($.extend({}, defaults.pageaction, action));
            });

            // Extend the page tabs.
            pge.tabs = [];
            $.each(json.tabs, function(index, tab) {
                tab.text = tab.text || tab.name;
                pge.tabs.push($.extend({}, defaults.pagetab, tab));
            });

            return pge;
        }
    );
}

module.exports = {
    page: page
};

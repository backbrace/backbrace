/**
 * Meta data module. Get object meta data from cache, JSON files or data.
 * @module meta
 * @private
 */

import { codeblock } from './code';
import { get } from './http';
import { settings } from './settings';
import { get as getJQuery } from './providers/jquery';

const defaults = {
    /** @type {PageMeta} */
    page: {
        name: '',
        caption: '',
        component: 'cardpage',
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
        password: false,
        className: 's12 m6'
    },
    /** @type {PageActionMeta} */
    pageaction: {
        name: '',
        text: '',
        icon: '',
        iconColor: '',
        className: ''
    },
    /** @type {PageTabMeta} */
    pagetab: {
        name: '',
        text: '',
        pageName: '',
        icon: '',
        className: ''
    }
};

/**
 * Get page object meta data.
 * @param {string} name Name of the page to get.
 * @returns {JQueryPromise} Promise to get the page meta data.
 */
export function page(name) {

    const $ = getJQuery();

    return codeblock(

        // Get the page from a JSON file.
        () => get(settings.meta.dir + 'pages/' + name + '.json'),

        (/** @type {PageMeta} */json) => {

            // Merge the json with default values.
            json.caption = json.caption || json.name;

            // Extend the page.
            let pge = $.extend({}, defaults.page, json);

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

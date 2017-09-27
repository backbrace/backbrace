'use strict';

/**
 * Page object.
 * @param {*} properties - Properties for the new page.
 */
function Page(properties) {

    var _self = this;

    this.caption = '';
    this.controller = '';
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
    this.closeFunction = null;
    this.openFunction = null;
    this.tabList = [];
    this.showFilters = false;
    this.runFunctionOnCancel = false;
    this.runDblClickOnNew = false;
    this.skipRecordLoad = false;
    this.allowExternal = false;

    if (typeof properties !== 'undefined') {

        // Extend the page.
        $js.extend(this, properties);

        // Extend the page fields.
        this.fields = [];
        $js.forEach(properties.fields, function(field) {
            _self.fields.push(new PageField(field));
        });

        // Extend the page actions.
        this.actions = [];
        $js.forEach(properties.actions, function(action) {
            _self.actions.push(new PageAction(action));
        });
    }
}

/**
 * Page field object.
 * @param {*} properties - Properties for the new page field.
 */
function PageField(properties) {

    this.name = '';
    this.caption = '';
    this.editable = false;
    this.type = '';
    this.width = 0;
    this.tabName = '';
    this.fieldMask = '';
    this.tooltip = '';
    this.hidden = false;
    this.incrementDelta = 0;
    this.totals = false;
    this.customComponent = '';
    this.sort = 0;
    this.optionString = '';
    this.optionCaption = '';
    this.onValidate = '';
    this.onLookup = '';
    this.lookupTable = '';
    this.lookupField = '';
    this.lookupFilters = '';
    this.lookupColumns = '';
    this.lookupCategoryField = '';
    this.lookupDisplayField = '';

    if (typeof properties !== 'undefined') {
        // Extend the page field.
        $js.extend(this, properties);
    }
}

/**
 * Page action object.
 * @param {*} propeties - Properties for the new page action.
 */
function PageAction(properties) {

    this.name = '';
    this.type = '';
    this.onclick = null;
    this.icon = '';
    this.recordRequired = false;
    this.pageName = '';
    this.pageView = '';
    this.reload = false;
    this.reloadParent = false;
    this.onDoubleClick = false;

    if (typeof properties !== 'undefined') {
        // Extend the page action.
        $js.extend(this, properties);
    }
}

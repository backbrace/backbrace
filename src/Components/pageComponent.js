'use strict';

/**
 * Page component. Used to display a view.
 * @param {string} name - Page name.
 */
function PageComponent(name) {
    this.name = name;
    this.page = $app.page(name);
    if (this.page === null)
        $js.error('Page does not exist: {0}', name);
    this.window = new WindowComponent();
}

PageComponent.prototype.load = function(container) {

    var _self = this;

    this.window.load(container);

    this.window.setTitle(this.page.caption);

    // Add actions.
    $.each(this.page.actions, function(i, action) {
        _self.window.addAction({
            text: action.name,
            image: '<i class="mdi mdi-' + action.icon + '"></i>',
            onclick: action.onclick
        });
    });

    this.window.show();
};

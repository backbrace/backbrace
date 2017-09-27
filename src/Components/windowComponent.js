'use strict';

/**
 * Window component.
 */
function WindowComponent(settings) {

    this.settings = {
        style: 'window-width-full window-height-half',
        parent: null
    };

    // Merge settings.
    $js.extend(this.settings, settings);

    this.id = $js.nextID();
    this.visible = false;
    this.hidden = false;
}

WindowComponent.prototype.load = function(container) {

    var titlebar = null;

    titlebar = $('<div class="title-bar unselectable" />');

    if (!this.settings.parent)
        titlebar.append('<span id="title' + this.id + '" class="title unselectable" />');

    // Add close button.
    //titlebar.append('<i class="fa fa-times title-icon" aria-hidden="true"></i>');

    $('<div id="window' + this.id + '" class="window" />')
        .addClass(this.settings.style)
        .append(titlebar)
        .append('<div id="actions' + this.id + '" class="actions-bar unselectable" />')
        .appendTo(container);
};

WindowComponent.prototype.show = function() {

    this.visible = true;

    if (!this.hidden)
        $('#window' + this.id).css('display', 'inline-block');
};

WindowComponent.prototype.setTitle = function(title) {
    $('#title' + this.id).html(title);
};

WindowComponent.prototype.addAction = function(action) {
    var id = this.id + 'action' + $js.nextID();
    var btn = $('<div id="' + id + '" class="action-button unselectable" ' +
        'data-ripple>' + action.image + ' ' + action.text + '</div>');
    if (action.style)
        btn.addClass(action.style);
    btn.ripple().click(action.onclick);
    $('#actions' + this.id).append(btn);
};

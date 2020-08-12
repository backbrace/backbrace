import {
    dom as $,
    ready,
    start
} from '../node_modules/@backbrace/core/dist/Backbrace.js';

ready(async () => {

    const header = $('bb-header'),
        nav = header.find('.bb-nav-inner');

    // Add top bar links.
    $(`<div class="header-link hide-small"><a bb-route="guides">Docs</a></div>
        <div class="header-link hide-small"><a bb-route="api">API</a></div>
        <div class="header-link hide-small"><a bb-route="components">Components</a></div>`).appendTo(nav);

});

// Start the app!
start();

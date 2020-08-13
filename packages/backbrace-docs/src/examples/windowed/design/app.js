import {
    ready,
    start,
    publicPath
} from '../../../node_modules/@backbrace/core/dist/Backbrace.js';

publicPath('../../../node_modules/@backbrace/core/dist/');

ready(async (app) => {
    app.loadPage('page/home.json');
});

// Start the app!
start();

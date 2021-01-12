import {
    ready,
    start,
    publicPath
} from '../../../node_modules/@backbrace/core/dist/Backbrace.js';

publicPath('../../../node_modules/@backbrace/core/dist/');

ready(async (app) => {
    await app.loadPage('page/home.json');
    await app.loadPage('page/page1.json');
    await app.loadPage('page/page2.json');
});

// Start the app!
start();

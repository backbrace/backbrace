import { settings } from '../src/settings';
import * as app from '../src/app';

/**
 * @type {import('../src/components/app').App}
 */
let appComponent = null;

describe('section component', () => {

    beforeAll((done) => {
        // Run up an app.
        settings.dir.design = '/design/sectioncomponent/';
        app.ready(() => done());
        app.start().then(() => {
            appComponent = app.app;
        });
    });

    afterAll(() => app.unload());

    describe('external component', () => {

        it('should load an external component', async (done) => {

            // Load the page.
            await appComponent.loadPage('page/external.json');

            // Wait for the page to load.
            let currPage = appComponent.currentPage();
            expect(currPage.sections.get('external').innerText).toBe('foo');
            done();
        });

    });

});

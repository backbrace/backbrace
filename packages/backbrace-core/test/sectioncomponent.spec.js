import { settings } from '../src/settings';
import * as app from '../src/app';

describe('section component', () => {

    beforeAll((done) => {
        // Run up an app.
        settings.windowMode = true;
        settings.dir.design = '/design/sectioncomponent/';
        app.ready(() => done());
        app.start();
    });

    afterAll(() => app.unload());

    describe('external component', () => {

        it('should load an external component', async (done) => {

            // Load the page.
            await app.app.loadPage('page/external.json');

            // Wait for the page to load.
            let currPage = app.app.currentPage();
            expect(currPage.sections.get('external').innerText).toBe('foo');
            done();
        });

    });

});

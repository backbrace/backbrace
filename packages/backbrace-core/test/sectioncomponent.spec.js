import { settings } from '../src/settings';
import * as app from '../src/app';

describe('section component', () => {

    beforeAll((done) => {
        // Run up an app.
        settings.dir.design = '/design/sectioncomponent/';
        app.ready(() => done());
        app.start();
    });

    afterAll(() => app.unload());

    describe('external component', () => {

        it('should load an external component', async (done) => {

            // Load the page.
            await app.loadPage('page/external');

            // Wait for the page to load.
            let currPage = app.currentPage();
            expect(currPage.sections.get('external').container.html()).toBe('foo');
            done();
        });

    });

});

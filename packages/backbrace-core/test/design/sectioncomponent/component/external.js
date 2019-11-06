import '../../../../dist/backbrace.min.js';

export default class External extends backbrace.SectionComponent {

    load(container) {

        super.load(container);

        // Load foo into the container.
        this.container.append('foo');

        return this;
    }

}

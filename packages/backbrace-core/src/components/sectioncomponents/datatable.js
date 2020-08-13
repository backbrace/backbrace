import { Container } from '../container';
import { format } from '../../data';

/**
 * @class DataTable
 * @augments Container
 * @description
 * Data table section component.
 */
export class DataTable extends Container {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['route', 'string'],
            ['height', 'string']
        ]);
    }

    /**
     * @constructs DataTable
     */
    constructor() {

        super();

        /**
         * @description
         * Attribute. Set the height of the data table. Defaults to `auto`.
         * @type {string}
         */
        this.height = 'auto';

        /**
         * @description
         * Attribute. The route to run when the user clicks a row.
         * @type {string}
         */
        this.route = '';
    }

    /**
     * Merge a route.
     * @param {Object} data Data to merge.
     * @returns {string}
     */
    mergeRoute(data) {
        let route = this.route;
        for (let p in data) {
            route = route.replace(':' + p, data[p]);
        }
        return route;
    }



    /** @override */
    renderContent() {
        return this.html`
            <div class="data-table" style=${this.styleMap({ height: this.height })}>
                <table>
                    <thead>
                        <tr>
                            ${this.design.fields.map(f => this.html`<th class="header-cell">${f.caption}</th>`)}
                        </tr>
                    </thead>
                    <tbody>
                        ${this.state.data.map(d => this.html`
                            <tr class="table-row" bb-route=${this.mergeRoute(d)}>
                                ${this.design.fields.map(f => this.html`<td class="data-cell">${this.unsafeHTML(format(d[f.bind || f.name]))}</td>`)}
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
        `;
    }

}

export default DataTable;

Container.define('bb-datatable', DataTable);

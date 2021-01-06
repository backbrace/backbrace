import { Card } from './card';
import { fetch } from '../../data';

/**
 * @class Login
 * @augments Card
 * @description
 * Login section component.
 */
export class Login extends Card {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['route', 'string'],
            ['data', 'string'],
            ['query', 'string']
        ]);
    }

    /**
     * @constructs Login
     */
    constructor() {

        super();

        this.route = '';
        this.data = '';
        this.query = '';
    }

    /**
     * Execute the login query.
     * @async
     * @returns {Promise<void>}
     */
    async login() {

        this.state.isLoading = true;

        // Clear the last error.
        this.state.hasError = false;

        try {

            let variables = {};
            for (let f of this.fields.values()) {
                variables[f.design.bind || f.design.name] = f.value;
            }

            let data = await fetch(this.data, this.query, variables);

            // Check for errors.
            if (data && data.errors && data.errors.length && data.errors.length > 0 && data.errors[0].message)
                throw data.errors[0].message;

            this.state.isLoading = false;

        } catch (e) {
            this.state.isLoading = false;
            throw this.error('login', `${e}`);
        }

    }

    /** @override */
    renderContent() {
        return this.html`
            ${super.renderContent()}
            <button class="bb-button bg-primary" @click=${this.login}>
                <span class="bb-button-label text-primary">
                    Login
                </span>
            </button>
        `;
    }

}

export default Login;

Card.define('bb-login', Login);

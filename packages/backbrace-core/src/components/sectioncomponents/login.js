import { Card } from './card';
import { fetch, setBearer } from '../../data';
import { navigate } from '../../route';

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
            ['path', 'string'],
            ['data', 'string'],
            ['query', 'string'],
            ['bind', 'string']
        ]);
    }

    /**
     * @constructs Login
     */
    constructor() {

        super();

        /**
         * @description
         * Attribute. Path to navigate to after the login is successful.
         * @type {string}
         */
        this.path = '';

        /**
         * @description
         * Attribute. Data source to query.
         * @type {string}
         */
        this.data = '';

        /**
         * @description
         * Attribute. Query to run.
         * @type {string}
         */
        this.query = '';

        /**
         * @description
         * Attribute. Binding path to the login token.
         * @type {string}
         */
        this.bind = '';

        this.errorMessage = '';
    }

    /**
     * Execute the login query.
     * @async
     * @returns {Promise<void>}
     */
    async login() {

        const path = this.path || this.params.callbackPath;

        // Clear the last error.
        this.state.hasError = false;
        this.errorMessage = '';

        try {

            // Generate variables.
            let variables = {},
                fieldError = false;
            for (let f of this.fields.values()) {
                f.helpertext = '';
                if (!f.value) {
                    f.helpertext = `Please enter your ${f.caption}`;
                    fieldError = true;
                }
                variables[f.design.bind || f.design.name] = f.value;
            }

            if (fieldError)
                return;

            this.state.isLoading = true;

            let data = await fetch(this.data, this.query, variables);

            if (data) {

                // Check for errors.
                if (data.errors && data.errors.length && data.errors.length > 0 && data.errors[0].message) {
                    this.errorMessage = data.errors[0].message;
                    this.state.isLoading = false;
                    this.update();
                    return;
                }


                // Bind the result.
                let bindData = data;
                this.bind.split('.').forEach((bprop) => {
                    if (bindData === null || typeof bindData[bprop] === 'undefined')
                        throw this.error('bind', `Data binding failed for ${this.bind} on property ${bprop}`);
                    bindData = bindData[bprop];
                });

                // Set the bearer token.
                setBearer(bindData);

                this.state.isLoading = false;

                // Navigate to the callback path.
                if (path)
                    await navigate(path);

            } else {
                throw new Error('Invalid request');
            }

        } catch (e) {
            this.state.isLoading = false;
            throw this.error('login', `${e}`);
        }

    }

    /** @override */
    async load() {

        // Checks.
        if (!this.data || !this.query || !this.bind)
            throw this.error('attributes', 'Please add all required attributes (data,query,bind)');

        await super.load();

        // Login on enter.
        for (let f of this.fields.values())
            f.addEventListener('keyup', (ev) => {
                if (ev.keyCode === 13) {
                    ev.preventDefault();
                    this.login();
                }
            });
    }

    /** @override */
    renderContent() {

        return this.html`
            ${super.renderContent()}
            ${this.errorMessage ? this.html`<span class="bb-login-error">${this.errorMessage}</span>` : ''}
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

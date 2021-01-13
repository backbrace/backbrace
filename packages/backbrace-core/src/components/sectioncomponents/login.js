import $ from 'cash-dom';
import { Card } from './card';
import { fetch, bind, auth } from '../../data';
import { navigate } from '../../route';
import { get as getWindow } from '../../providers/window';
import { Header } from '../header';
import { makeObservable, observable } from 'mobx';
import { settings } from '../../settings';

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
            ['loginquery', 'string'],
            ['loginbind', 'string'],
            ['userquery', 'string'],
            ['userbind', 'string']
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
         * Attribute. Query to run when logging in.
         * @type {string}
         */
        this.loginquery = '';

        /**
         * @description
         * Attribute. Binding path to the login object.
         * @type {string}
         */
        this.loginbind = '';

        /**
         * @description
         * Attribute. Query to run when getting the `userInfo`.
         * @type {string}
         */
        this.userquery = '';

        /**
         * @description
         * Attribute. Binding path to the `userInfo` object.
         * @type {string}
         */
        this.userbind = '';

        /**
         * @description
         * Login error message.
         * @type {string}
         */
        this.errorMessage = '';

        /**
         * @description
         * App header.
         * @type {import('../header').Header}
         */
        this.header = null;

        makeObservable(this, {
            errorMessage: observable
        });
    }

    /** @override */
    firstUpdated() {

        super.firstUpdated();

        // Save a reference to the app header.
        const ele = $('bb-header');
        if (ele.length > 0 && ele[0] instanceof Header)
            this.header = ele[0];
    }

    /**
     * Executes after login is successful.
     * @async
     * @returns {Promise<void>}
     */
    async onLogin() {

        const path = this.path || this.params.callbackPath;

        // Get the user info.
        if (this.userquery && this.userbind) {

            let data = await fetch(this.data, this.userquery);

            if (data) {

                // Check for errors.
                if (data.errors && data.errors.length && data.errors.length > 0 && data.errors[0].message)
                    throw this.error('onlogin', data.errors[0].message);

                // Bind the result.
                let bindData = bind(this.userbind, data);
                this.header.userInfo = bindData;
            }
        }

        this.header.show();

        // Navigate to the callback path.
        if (path)
            await navigate(path);
    }

    /**
     * Execute the login query.
     * @async
     * @returns {Promise<void>}
     */
    async login() {

        // Clear the last error.
        this.errorMessage = '';

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

        if (this.data) {

            let data = await fetch(this.data, this.loginquery, variables);

            if (data) {

                // Check for errors.
                if (data.errors && data.errors.length && data.errors.length > 0 && data.errors[0].message) {
                    this.errorMessage = data.errors[0].message;
                    this.state.isLoading = false;
                    return;
                }

                // Bind the result.
                let bindData = bind(this.loginbind, data);

                // Save the auth.
                auth.token = bindData['token'];
                auth.userID = bindData['userID'];

                this.state.isLoading = false;

                await this.onLogin();

            }

        }

    }

    /** @override */
    async load() {

        // Auto login.
        if (settings.auth.refreshTokenURL) {
            let res = await getWindow().fetch(settings.auth.refreshTokenURL);
            if (res.ok) {

                let data = await res.json();

                // Save the auth.
                auth.token = data['token'];
                auth.userID = data['userID'];

                await this.onLogin();
                return;
            }
        }

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
            <button class="bb-button" @click=${this.login}>
                <span class="bb-button-label">
                    Login
                </span>
            </button>
        `;
    }

}

export default Login;

Card.define('bb-login', Login);

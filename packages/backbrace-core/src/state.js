import { observable } from 'mobx';

/**
 * @module state
 * @private
 * @description
 * Application state management.
 */

/**
 * @type {Map<String,Map<String,Object>>}
 * @description
 * Application store. Used to store custom state objects.
 */
export let store = observable.map();

/**
 * @type {import('./types').appState}
 * @description
 * Global application state.
 */
export let appState = observable({
    isAuthenticated: false,
    auth: null,
    user: null
});

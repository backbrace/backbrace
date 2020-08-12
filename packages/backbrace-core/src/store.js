import { observable } from 'mobx';

/**
 * @module store
 * @private
 * @description
 * Application state management.
 */

/**
 * @type {Map<String,Map<String,Object>>}
 * @description
 * Application store.
 */
export let store = observable.map();

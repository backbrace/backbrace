/**
 * @description
 * Formatter module.
 * @module format
 * @private
 */

import moment from 'moment';
import 'modules/moment/locale/en-au.js';

import { isDefined } from './util';

/**
 * Format a field value to a string.
 * @param {PageFieldMeta} field Page field.
 * @param {*} value Value to format.
 * @returns {string} Returns the formatted field value.
 */
export function formatField(field, value) {

    if (value === null || !isDefined(value))
        return value;

    if (field.type === 'Date')
        return moment(value).format('DD/MM/YYYY');

    return value;
}

/**
 * @description
 * Formatter module.
 * @module format
 * @private
 */

import { isDefined } from './util';
import { get as moment } from './providers/moment';

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

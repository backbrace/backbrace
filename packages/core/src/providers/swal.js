/**
 * Readonly Sweet Alerts provider module.
 * @module swal
 * @private
 */

/**
 * Get sweet alerts if it has been loaded.
 * @returns {SweetAlert.SweetAlertStatic} Returns the swal instance.
 */
export function get() {
    return window['swal'] || null;
}

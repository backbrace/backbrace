import velocity from 'velocity-animate';

/**
 * @description
 * Animation module. Used to animate elements.
 * @module animate
 * @private
 */

/**
 * Animate an element.
 * @param {HTMLElement} elem Element to animate.
 * @param {Object} css Css to set.
 * @param {number} [duration=400] Animation duration.
 * @returns {Promise<void>}
 */
export function animate(elem, css, duration = 400) {
    return velocity(elem, css, duration).then(() => { });
}

/**
 * Fade-in an element.
 * @param {HTMLElement} elem Element to fade in.
 * @param {number} [duration] Animation duration.
 * @returns {Promise<void>}
 */
export function fadeIn(elem, duration) {
    return velocity(elem, {
        opacity: 1
    }, duration).then(() => { });
}

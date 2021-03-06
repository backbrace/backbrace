import { ShadowComponent } from '../../components/shadowcomponent';
import { settings } from '../../settings';

/**
 * @class MaterialDesignSpinner
 * @augments ShadowComponent
 * @private
 * @description
 * Material design progress spinner.
 */
export class MaterialDesignSpinner extends ShadowComponent {

    /**
     * @constructs MaterialDesignSpinner
     */
    constructor() {
        super();
    }

    /**
     * @override
     */
    render() {
        return this.html`
            <style>
                .spinner {
                    -webkit-animation: rotation 1.35s linear infinite;
                    animation: rotation 1.35s linear infinite;
                    display: block;
                    margin: 60px auto;
                }
                @-webkit-keyframes rotation {
                    0% {
                    -webkit-transform: rotate(0deg);
                    transform: rotate(0deg);
                    }

                    100% {
                    -webkit-transform: rotate(270deg);
                    transform: rotate(270deg);
                    }
                }
                @keyframes rotation {
                    0% {
                    -webkit-transform: rotate(0deg);
                    transform: rotate(0deg);
                    }

                    100% {
                    -webkit-transform: rotate(270deg);
                    transform: rotate(270deg);
                    }
                }
                .circle {
                    stroke-dasharray: 180;
                    stroke-dashoffset: 0;
                    -webkit-transform-origin: center;
                    -ms-transform-origin: center;
                    transform-origin: center;
                    -webkit-animation: turn 1.35s ease-in-out infinite;
                    animation: turn 1.35s ease-in-out infinite;
                }
                @-webkit-keyframes turn {
                    0% {
                    stroke-dashoffset: 180;
                    }

                    50% {
                    stroke-dashoffset: 45;
                    -webkit-transform: rotate(135deg);
                    transform: rotate(135deg);
                    }

                    100% {
                    stroke-dashoffset: 180;
                    -webkit-transform: rotate(450deg);
                    transform: rotate(450deg);
                    }
                }
                @keyframes turn {
                    0% {
                    stroke-dashoffset: 180;
                    }

                    50% {
                    stroke-dashoffset: 45;
                    -webkit-transform: rotate(135deg);
                    transform: rotate(135deg);
                    }

                    100% {
                    stroke-dashoffset: 180;
                    -webkit-transform: rotate(450deg);
                    transform: rotate(450deg);
                    }
                }
                svg.spinner {
                    stroke: ${settings.style.colors.fgprogress};
                }
            </style>
            <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle class="circle" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
        `;
    }
}

ShadowComponent.define('md-spinner', MaterialDesignSpinner);

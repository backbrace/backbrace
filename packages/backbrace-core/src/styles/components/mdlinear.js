import { ShadowComponent } from '../../components/shadowcomponent';
import { settings } from '../../settings';

/**
 * @class MaterialDesignLinear
 * @augments ShadowComponent
 * @private
 * @description
 * Material design progress meter - linear.
 */
export class MaterialDesignLinear extends ShadowComponent {

    /**
     * @constructs MaterialDesignLinear
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
                .md-linear{
                    background-color: ${settings.style.colors.bgprogress};
                    height: 4px;
                    overflow: hidden;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                }
                .md-linear-bar {
                    top: 0;
                    left: 0;
                    width: 100%;
                    bottom: 0;
                    position: absolute;
                    transition: transform 0.2s linear;
                    transform-origin: left;
                    background-color: ${settings.style.colors.fgprogress};
                    width: auto;
                }
                .md-linear-bar-1 {
                    animation: MuiLinearProgress-keyframes-indeterminate1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
                }
                .md-linear-bar-2 {
                    animation: MuiLinearProgress-keyframes-indeterminate2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
                }
                @-webkit-keyframes MuiLinearProgress-keyframes-indeterminate1 {
                    0% {
                        left: -35%;
                        right: 100%;
                    }
                    60% {
                        left: 100%;
                        right: -90%;
                    }
                    100% {
                        left: 100%;
                        right: -90%;
                    }
                }
                @keyframes MuiLinearProgress-keyframes-indeterminate1 {
                    0% {
                        left: -35%;
                        right: 100%;
                    }
                    60% {
                        left: 100%;
                        right: -90%;
                    }
                    100% {
                        left: 100%;
                        right: -90%;
                    }
                }
                @-webkit-keyframes MuiLinearProgress-keyframes-indeterminate2 {
                    0% {
                        left: -200%;
                        right: 100%;
                    }
                    60% {
                        left: 107%;
                        right: -8%;
                    }
                    100% {
                        left: 107%;
                        right: -8%;
                    }
                }
                @keyframes MuiLinearProgress-keyframes-indeterminate2 {
                    0% {
                        left: -200%;
                        right: 100%;
                    }
                    60% {
                        left: 107%;
                        right: -8%;
                    }
                    100% {
                        left: 107%;
                        right: -8%;
                    }
                }
            </style>
            <div class="md-linear" role="progressbar">
                <div class="md-linear-bar md-linear-bar-1"></div>
                <div class="md-linear-bar md-linear-bar-2"></div>
            </div>
        `;
    }
}

ShadowComponent.define('md-linear', MaterialDesignLinear);

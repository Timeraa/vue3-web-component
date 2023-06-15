import { App, Component } from "vue";
export interface PluginOptions {
    /**
     * Tags to copy from the main document to the shadow DOM.
     * @default ["style", "link[rel=stylesheet]"]
     */
    tagsToInclude?: string[];
}
export declare function createWebComponent(options?: PluginOptions): {
    install: (app: App) => void;
};
export declare function createWrappedWebComponent(component: Component, setup: (app: App) => void): import("vue").VueElementConstructor<{}>;

import { App, Component, createApp, defineCustomElement, getCurrentInstance, h, onMounted } from "vue";

export interface PluginOptions {
	/**
	 * Tags to copy from the main document to the shadow DOM.
	 * @default ["style", "link[rel=stylesheet]"]
	 */
	tagsToInclude?: string[];
}

export function createWebComponent(options?: PluginOptions) {
	const optionsWithDefaults: NonNullable<PluginOptions> = {
		tagsToInclude: ["style", "link[rel=stylesheet]"],
		...options,
	};

	return {
		install: (app: App) => {
			//* is set when vue.customElement is true
			let shadowRoot: ShadowRoot;

			onMounted(() => {
				shadowRoot = getCurrentInstance()?.vnode.el?.getRootNode();

				const tagsToMonitor = optionsWithDefaults.tagsToInclude?.flatMap(tags => [...document.querySelectorAll(tags)]) || [];

				for (const styleTag of tagsToMonitor) shadowRoot?.insertBefore(styleTag.cloneNode(true), shadowRoot.lastChild);
			});

			app.mixin({
				mounted() {
					//* shadowRoot not set when vue.customElement is true
					if (!shadowRoot) shadowRoot = getCurrentInstance()?.vnode.el?.getRootNode();

					const styles = this.$.type.styles?.join(",");
					if (!styles) return;

					this.__style = document.createElement("style");
					this.__style.innerHTML = styles;
					this.__style.id = `s${this.$.uid}`;
					shadowRoot.insertBefore(this.__style, shadowRoot.firstChild);
				},
				name: "style",
				unmounted() {
					this.__style?.remove();
				},
			});
		},
	};
}

export function createWrappedWebComponent(component: Component, setup: (app: App) => void) {
	return defineCustomElement({
		setup() {
			// @ts-expect-error We create a fake instance to get the app context
			// deepscan-disable-next-line
			const app = createApp();

			app.use(createWebComponent());
			setup(app);

			const inst = getCurrentInstance();
			if (!inst) return;
			Object.assign(inst.appContext, app._context);
			//@ts-expect-error inst.provides is defined
			Object.assign(inst.provides, app._context.provides);

			return () => h(component);
		},
	});
}

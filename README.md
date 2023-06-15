# vue3-web-component

Create full vue3 apps inside embeddable components.

## Why?

Vue3 supports web components out of the box, but it's not easy to create a full app inside a web component. This project aims to make it easy to create full vue3 apps inside embeddable components. There were also a lot of issues I encountered when trying to create a web component with vue3 only like styles not being applied, plugins not easily being able to be used as you don't have an app instance like usual by default and most importantly if you want to use this as an embeddable script on let's say a customers homepage and they want to override some styles, you can't do that with vue3 out of the box due to its shadow dom usage. This project aims to solve all of these issues.

## How?

This module exposes 2 functions, one is the plugin which only takes care of styles being applied and copied over from the host page and the other one is a function that basically works like `createApp` from vue (even uses it under the hood) but allows you to easily use the `app` instance to register the plugins you love.

What happens in the background is pretty straightforward, we walk through all the styles that you have in components (nested ones as well) and collect them using a mixin. Then we create a new style tag inside of the shadow dom and copy over all the styles we collected. and onUnmounted we remove the style tag again preventing styles from overriding something that isn't rendered, this also allows for HMR to work as expected as each style tag has the component's uid assigned to them.

After this is done we copy over the host's styles to the shadow dom (at the bottom of the component's styles), this allows for the host page to override styles if needed for let's say themes.

## Known issues

- Currently HMR does not work for copying over the host's styles as there is no monitoring and managing of wether those styles changed (When the project is built and the host page's styles change)

## TODO

- [ ] Add tests
- [ ] Add support for HMR for host styles

## Usage

### main.js/main.ts

```js
import "./index.css";

import App from "./App.vue";
import { createWrappedWebComponent } from "vue3-web-component";

customElements.define(
	"your-custom-element",
	createWrappedWebComponent(App, app => {
		//* Use app like normal
		// app.use(createI18n())
		// app.use(createPinia())
	})
);
```

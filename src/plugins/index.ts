/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";

import router from "@/router";
import mitt from "mitt";

const emitter = mitt();
export default emitter;

// Types
import type { App } from "vue";
import { createPinia } from "pinia";
import ToastPlugin from "vue-toast-notification";

const pinia = createPinia();

export function registerPlugins(app: App) {
  app.use(vuetify);
  app.use(pinia);
  app.use(router);
  app.use(ToastPlugin);
}

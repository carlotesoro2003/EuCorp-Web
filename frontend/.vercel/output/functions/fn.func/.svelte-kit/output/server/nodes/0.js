import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CdYkDWQP.js","_app/immutable/chunks/supabaseClient.CaMOPPuz.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/disclose-version.CM6f1PTD.js","_app/immutable/chunks/runtime.g0my00JR.js","_app/immutable/chunks/render.pmuW5QOO.js","_app/immutable/chunks/utils.sCj8HAia.js","_app/immutable/chunks/if.DVEvk735.js","_app/immutable/chunks/attributes.BVavg5V5.js","_app/immutable/chunks/misc.CY9ixZp3.js","_app/immutable/chunks/class.tYA33czU.js","_app/immutable/chunks/lifecycle.6aQbxLMK.js","_app/immutable/chunks/props.BjMJLEAs.js","_app/immutable/chunks/proxy.DHlUMAZI.js","_app/immutable/chunks/store.6LPOOnpP.js","_app/immutable/chunks/utils.B1xoYXWc.js","_app/immutable/chunks/entry.1ToqRDAj.js","_app/immutable/chunks/index.C34d6m6q.js","_app/immutable/chunks/index-client.v1G0sw0w.js","_app/immutable/chunks/stores.Btl6ja-Q.js","_app/immutable/chunks/Login.D30KFOSh.js","_app/immutable/chunks/input.N22HgeA5.js","_app/immutable/chunks/shared.PYFuWgKe.js","_app/immutable/chunks/event-modifiers.CWmzcjye.js"];
export const stylesheets = ["_app/immutable/assets/tailwind.C0IcpMr0.css","_app/immutable/assets/Login.CSp8ONmM.css"];
export const fonts = [];

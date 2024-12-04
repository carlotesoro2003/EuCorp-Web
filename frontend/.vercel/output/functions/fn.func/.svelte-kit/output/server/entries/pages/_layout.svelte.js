import { C as store_get, E as unsubscribe_stores, F as bind_props, B as pop, z as push } from "../../chunks/index.js";
/* empty css                    */
import "../../chunks/client.js";
import "../../chunks/supabaseClient.js";
import { p as page } from "../../chunks/stores.js";
/* empty css                                               */
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let data = $$props["data"];
  let tmp = data;
  tmp.session;
  store_get($$store_subs ??= {}, "$page", page).url.pathname;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center min-h-screen bg-base-300"><span class="loading loading-spinner loading-lg"></span></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _layout as default
};

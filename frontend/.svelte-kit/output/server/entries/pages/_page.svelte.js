import { F as bind_props, B as pop, z as push } from "../../chunks/index.js";
/* empty css                    */
import "../../chunks/client.js";
import "../../chunks/supabaseClient.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  data.session;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center min-h-screen bg-base-300"><div class="loader svelte-zc28ab"><span class="loading loading-spinner loading-sm"></span> Checking verification status...</div></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};

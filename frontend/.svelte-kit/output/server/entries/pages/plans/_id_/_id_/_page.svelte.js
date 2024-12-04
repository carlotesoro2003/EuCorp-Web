import { B as pop, z as push } from "../../../../../chunks/index.js";
import "../../../../../chunks/supabaseClient.js";
import "../../../../../chunks/client.js";
import "jspdf";
import "jspdf-autotable";
function _page($$payload, $$props) {
  push();
  $$payload.out += `<div class="min-h-screen bg-base-300 p-8"><h1 class="text-2xl font-bold mb-4">Action Plans</h1> <div class="mb-4">`;
  {
    $$payload.out += "<!--[!-->";
    {
      $$payload.out += "<!--[-->";
      $$payload.out += `<h2 class="text-xl font-bold">Loading Objective...</h2>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div> <button class="btn btn-secondary mb-4 svelte-1gak4wa">Export to PDF</button> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div>Loading action plans...</div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};

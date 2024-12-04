import { J as ensure_array_like, G as escape_html, B as pop, z as push } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
function _page($$payload, $$props) {
  push();
  let leads = [];
  $$payload.out += `<div class="container mx-auto px-6"><h2 class="text-2xl font-bold mb-6">Leads</h2> <button class="mt-4 mb-4 btn bg-indigo-600 hover:bg-indigo-700 text-white">Add Lead</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
    if (leads.length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div>No leads found.</div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array = ensure_array_like(leads);
      $$payload.out += `<div class="overflow-x-auto rounded-lg shadow-lg"><table class="table w-full bg-base-100 text-left"><thead><tr class="bg-gray-800"><th class="px-6 py-3">Name</th><th class="px-6 py-3">Actions</th></tr></thead><tbody><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let lead = each_array[$$index];
        $$payload.out += `<tr class="hover:bg-gray-700"><td class="px-6 py-4">${escape_html(lead.name)}</td><td class="px-6 py-4 flex gap-2"><button class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white font-medium">Edit</button> <button class="btn btn-sm bg-red-600 hover:bg-red-700 text-white font-medium">Delete</button></td></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};

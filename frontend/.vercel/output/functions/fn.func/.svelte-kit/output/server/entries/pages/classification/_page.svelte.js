import { J as ensure_array_like, G as escape_html, K as attr, B as pop, L as stringify, z as push } from "../../../chunks/index.js";
/* empty css                       */
import "../../../chunks/supabaseClient.js";
function _page($$payload, $$props) {
  push();
  let classifications = [];
  let isDeleting = false;
  const each_array = ensure_array_like(classifications);
  $$payload.out += `<div class="min-h-screen p-8"><h1 class="text-3xl font-bold mb-6">Classifications</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="overflow-x-auto shadow-lg rounded-lg"><table class="table w-full"><thead><tr class="border"><th class="px-6 py-4">Classification Name</th><th class="px-6 py-4">Actions</th></tr></thead><tbody><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let classification = each_array[$$index];
    $$payload.out += `<tr class="hover border border-gray-700"><td class="px-6 py-4">${escape_html(classification.name)}</td><td class="px-6 py-4 flex gap-4"><button class="btn btn-sm bg-blue-600 hover:bg-blue-700 font-medium">Edit</button> <button${attr("class", `btn btn-sm bg-red-600 hover:bg-red-700 font-medium ${stringify("")}`)}${attr("disabled", isDeleting, true)}>`;
    {
      $$payload.out += "<!--[-->";
      $$payload.out += `Delete`;
    }
    $$payload.out += `<!--]--></button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div> <div class="mt-6"><button class="btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium">Add Classification</button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};

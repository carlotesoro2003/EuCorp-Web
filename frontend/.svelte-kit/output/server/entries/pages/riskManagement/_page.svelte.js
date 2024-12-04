import { J as ensure_array_like, G as escape_html, B as pop, z as push } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
function _page($$payload, $$props) {
  push();
  let likelihoodRating = [];
  $$payload.out += `<div class="min-h-screen bg-base-300 p-8"><h1 class="text-3xl font-bold text-white mb-6">Ratings Management</h1> <div class="container mx-auto p-4"><label for="dataSelect" class="text-lg font-semibold text-white mr-4">Select Data Type:</label> <div class="relative inline-block w-64"><select id="dataSelect" class="input input-bordered w-full appearance-none pr-10"><option value="likelihoodRating">Likelihood Rating</option><option value="severity">Severity</option><option value="riskControlRating">Risk Control Rating</option><option value="riskMonitoringRating">Risk Monitoring Rating</option></select> <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><svg class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="overflow-x-auto bg-base-100 shadow-lg rounded-lg">`;
  {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(likelihoodRating);
    $$payload.out += `<table class="table w-full"><thead><tr class="bg-gray-800 text-white"><th class="px-6 py-4">Name</th><th class="px-6 py-4">Symbol</th></tr></thead><tbody><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$payload.out += `<tr class="hover:bg-gray-700 border-b border-gray-700"><td class="px-6 py-4">${escape_html(item.name)}</td><td class="px-6 py-4">${escape_html(item.symbol)}</td></tr>`;
    }
    $$payload.out += `<!--]--></tbody></table>`;
  }
  $$payload.out += `<!--]--> `;
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
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
export {
  _page as default
};

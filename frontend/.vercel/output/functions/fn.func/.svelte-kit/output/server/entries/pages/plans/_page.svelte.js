import { J as ensure_array_like, G as escape_html, B as pop, z as push } from "../../../chunks/index.js";
/* empty css                       */
import "../../../chunks/supabaseClient.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let strategicGoals = [];
  let leads = [];
  let isLoading = false;
  const getLeadNameById = (leadId) => {
    const lead = leads.find((l) => l.id === leadId);
    return lead ? lead.name : "No Lead Assigned";
  };
  $$payload.out += `<div class="container bg-base-300 mx-auto p-4">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <h1 class="text-3xl font-bold mb-4">Strategic Goals</h1> <button class="btn btn-primary text-white font-medium mb-5">Add Strategic Goal</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (strategicGoals.length === 0 && !isLoading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center py-4 text-lg">No strategic goals found.</div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_1 = ensure_array_like(strategicGoals);
    $$payload.out += `<table class="table table-zebra w-full"><thead><tr><th>Goal No</th><th>Name</th><th>Description</th><th>KPI</th><th>Lead</th><th>Actions</th></tr></thead><tbody><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let goal = each_array_1[$$index_1];
      $$payload.out += `<tr><td>${escape_html(goal.goal_no)}</td><td>${escape_html(goal.name)}</td><td>${escape_html(goal.description)}</td><td>${escape_html(goal.kpi)}</td><td>${escape_html(getLeadNameById(goal.lead_id))}</td><td class="flex justify-center space-x-2"><button class="btn btn-sm bg-teal-500 hover:bg-teal-600 text-white font-medium">View</button> <button class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white font-medium">Edit</button> <button class="btn btn-sm bg-red-600 hover:bg-red-700 text-white font-medium">Delete</button></td></tr>`;
    }
    $$payload.out += `<!--]--></tbody></table>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};

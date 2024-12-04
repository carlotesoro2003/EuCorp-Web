import { J as ensure_array_like, K as attr, G as escape_html, B as pop, z as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabaseClient.js";
function _page($$payload, $$props) {
  push();
  let strategicGoals = [];
  let objectives = [
    {
      name: "",
      strategic_initiatives: "",
      kpi: "",
      persons_involved: "",
      target: "",
      eval_measures: "",
      strategic_goal_id: 0,
      profile_id: ""
    }
  ];
  const each_array = ensure_array_like(strategicGoals);
  const each_array_1 = ensure_array_like(objectives);
  $$payload.out += `<div class="min-h-screen bg-base-300 p-8"><h1 class="text-2xl font-bold mb-4 text-white">Create Strategic Objectives</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="mb-4"><label for="strategic_goal" class="block text-lg font-bold text-white mb-2">Select Strategic Goal</label> <select id="strategic_goal" class="select select-bordered w-full font-semibold bg-gray-800 text-white" required><option${attr("value", null)} disabled selected>Select a goal</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let goal = each_array[$$index];
    $$payload.out += `<option${attr("value", goal.id)}>${escape_html(goal.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div class="overflow-x-auto"><table class="table w-full table-zebra shadow-lg rounded-lg"><thead><tr><th>Objective Name</th><th>Strategic Initiatives</th><th>KPI</th><th>Persons Involved</th><th>Target</th><th>Evaluation Measures</th><th>Actions</th></tr></thead><tbody><!--[-->`;
  for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
    let objective = each_array_1[index];
    $$payload.out += `<tr><td><textarea class="textarea textarea-bordered w-full resize-none" placeholder="Enter objective name">`;
    const $$body = escape_html(objective.name);
    if ($$body) {
      $$payload.out += `${$$body}`;
    }
    $$payload.out += `</textarea></td><td><textarea class="textarea textarea-bordered w-full resize-none" placeholder="Enter strategic initiatives">`;
    const $$body_1 = escape_html(objective.strategic_initiatives);
    if ($$body_1) {
      $$payload.out += `${$$body_1}`;
    }
    $$payload.out += `</textarea></td><td><textarea class="textarea textarea-bordered w-full resize-none" placeholder="Enter KPI">`;
    const $$body_2 = escape_html(objective.kpi);
    if ($$body_2) {
      $$payload.out += `${$$body_2}`;
    }
    $$payload.out += `</textarea></td><td><textarea class="textarea textarea-bordered w-full resize-none" placeholder="Enter persons involved">`;
    const $$body_3 = escape_html(objective.persons_involved);
    if ($$body_3) {
      $$payload.out += `${$$body_3}`;
    }
    $$payload.out += `</textarea></td><td><textarea class="textarea textarea-bordered w-full resize-none" placeholder="Enter target">`;
    const $$body_4 = escape_html(objective.target);
    if ($$body_4) {
      $$payload.out += `${$$body_4}`;
    }
    $$payload.out += `</textarea></td><td><textarea class="textarea textarea-bordered w-full resize-none" placeholder="Enter evaluation measures">`;
    const $$body_5 = escape_html(objective.eval_measures);
    if ($$body_5) {
      $$payload.out += `${$$body_5}`;
    }
    $$payload.out += `</textarea></td><td><button class="btn btn-error btn-sm">Delete</button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div> <div class="flex space-x-4 mt-4"><button class="btn btn-primary">Add Objective</button> <button class="btn btn-success">Submit Objectives</button></div></div>`;
  pop();
}
export {
  _page as default
};

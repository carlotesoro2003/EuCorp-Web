import { J as ensure_array_like, G as escape_html, B as pop, z as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabaseClient.js";
import "../../../../chunks/client.js";
import "jspdf";
import "jspdf-autotable";
function _page($$payload, $$props) {
  push();
  let goal = null;
  let objectives = [];
  let editingObjective = null;
  let updatedObjective = {};
  $$payload.out += `<div class="container mx-auto p-4">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (objectives.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(objectives);
    $$payload.out += `<div class="mt-8"><h1 class="text-3xl font-bold mb-4">Strategic Objectives for Goal ${escape_html(goal?.goal_no)}</h1> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p>Goal details not found.</p>`;
    }
    $$payload.out += `<!--]--> <a href="/plans/strategicPlans" class="btn btn-primary text-white mt-4">Add More Strategic Objectives</a> <button class="btn btn-secondary text-white mt-4">Export to PDF</button> <table class="table table-zebra w-full mt-5"><thead><tr><th>Strategic Objectives</th><th>Strategic Initiatives</th><th>KPI</th><th>Persons Involved</th><th>Target</th><th>Evaluation Measures</th><th>Actions</th></tr></thead><tbody><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let objective = each_array[$$index];
      $$payload.out += `<tr>`;
      if (editingObjective?.id === objective.id) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3">`;
        const $$body = escape_html(updatedObjective.name);
        if ($$body) {
          $$payload.out += `${$$body}`;
        }
        $$payload.out += `</textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3">`;
        const $$body_1 = escape_html(updatedObjective.strategic_initiatives);
        if ($$body_1) {
          $$payload.out += `${$$body_1}`;
        }
        $$payload.out += `</textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3">`;
        const $$body_2 = escape_html(updatedObjective.kpi);
        if ($$body_2) {
          $$payload.out += `${$$body_2}`;
        }
        $$payload.out += `</textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3">`;
        const $$body_3 = escape_html(updatedObjective.persons_involved);
        if ($$body_3) {
          $$payload.out += `${$$body_3}`;
        }
        $$payload.out += `</textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3">`;
        const $$body_4 = escape_html(updatedObjective.target);
        if ($$body_4) {
          $$payload.out += `${$$body_4}`;
        }
        $$payload.out += `</textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3">`;
        const $$body_5 = escape_html(updatedObjective.eval_measures);
        if ($$body_5) {
          $$payload.out += `${$$body_5}`;
        }
        $$payload.out += `</textarea></td> <td><button class="btn btn-primary">Save</button> <button class="btn btn-secondary">Cancel</button></td>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<td>${escape_html(objective.name)}</td> <td>${escape_html(objective.strategic_initiatives)}</td> <td>${escape_html(objective.kpi)}</td> <td>${escape_html(objective.persons_involved)}</td> <td>${escape_html(objective.target)}</td> <td>${escape_html(objective.eval_measures)}</td> <td><button class="btn btn-primary text-white">View</button> <button class="btn btn-secondary text-white">Edit</button></td>`;
      }
      $$payload.out += `<!--]--></tr>`;
    }
    $$payload.out += `<!--]--></tbody></table></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="mt-8"><p>No objectives found for this goal.</p> <a href="/plans/strategicPlans" class="btn btn-primary text-white mt-4">Add Strategic Objectives for this Goal</a></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};

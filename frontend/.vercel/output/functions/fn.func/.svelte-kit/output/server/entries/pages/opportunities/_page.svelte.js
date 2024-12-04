import { J as ensure_array_like, G as escape_html, K as attr, L as stringify, B as pop, z as push, F as bind_props } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
import "jspdf";
import "jspdf-autotable";
function AdminOpportunities($$payload, $$props) {
  push();
  let opportunities = [];
  $$payload.out += `<div class="container mx-auto p-6"><h2 class="text-2xl font-bold mb-6">My Opportunities</h2> <button class="btn btn-accent my-5">Export to PDF</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
    if (opportunities.length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="text-center text-gray-500">No opportunities found.</div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array = ensure_array_like(opportunities);
      $$payload.out += `<div class="overflow-x-auto"><table class="table table-zebra w-full"><thead><tr class="uppercase text-sm"><th class="px-4 py-2 text-left">Opportunity Statement</th><th class="px-4 py-2 text-left">Planned Actions</th><th class="px-4 py-2 text-left">KPI</th><th class="px-4 py-2 text-left">Key Persons</th><th class="px-4 py-2 text-left">Target Output</th><th class="px-4 py-2 text-left">Budget</th><th class="px-4 py-2 text-left">Department</th><th class="px-4 py-2 text-left">Actions</th></tr></thead><tbody><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let opportunity = each_array[$$index];
        $$payload.out += `<tr class="hover"><td class="px-4 py-2">${escape_html(opportunity.opt_statement)}</td><td class="px-4 py-2">${escape_html(opportunity.planned_actions)}</td><td class="px-4 py-2">${escape_html(opportunity.kpi)}</td><td class="px-4 py-2">${escape_html(opportunity.key_persons)}</td><td class="px-4 py-2">${escape_html(opportunity.target_output)}</td><td class="px-4 py-2">${escape_html(opportunity.budget)}</td><td class="px-4 py-2">${escape_html(opportunity.department_name)}</td><td class="px-4 py-2 flex gap-2"><button class="btn bg-blue-600 hover:bg-blue-700 text-white font-medium">Edit</button> <button${attr("class", `btn text-white ${stringify(opportunity.is_approved ? "bg-green-700 cursor-not-allowed" : "btn-success")}`)}${attr("disabled", opportunity.is_approved, true)}>${escape_html(opportunity.is_approved ? "Approved" : "Approve")}</button> <button class="btn bg-red-600 hover:bg-red-700 text-white font-medium">Delete</button></td></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function DepartmentOpportunities($$payload, $$props) {
  push();
  let isLoading = false;
  let isSaving = false;
  let formData = [
    {
      opt_statement: "",
      planned_actions: "",
      kpi: "",
      key_persons: "",
      target_output: "",
      budget: 0,
      profile_id: ""
    }
  ];
  const each_array = ensure_array_like(formData);
  $$payload.out += `<div class="container mx-auto p-6"><div class="p-6 rounded-lg shadow-lg mb-6"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-semibold">${escape_html("Create Opportunity")}</h2> <button class="btn btn-success"${attr("disabled", isSaving, true)}>Save Progress</button></div> <div class="overflow-x-auto"><table class="table-auto table table-zebra w-full"><thead><tr class="text-sm"><th class="px-4 py-2 text-left">Opportunity Statement</th><th class="px-4 py-2 text-left">Planned Actions</th><th class="px-4 py-2 text-left">KPI</th><th class="px-4 py-2 text-left">Key Persons</th><th class="px-4 py-2 text-left">Target Output</th><th class="px-4 py-2 text-left">Budget</th><th class="px-4 py-2 text-left">Actions</th></tr></thead><tbody><!--[-->`;
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let row = each_array[index];
    $$payload.out += `<tr><td class="px-4 py-2"><textarea placeholder="Opportunity Statement" class="textarea textarea-bordered w-full" style="overflow: hidden">`;
    const $$body = escape_html(row.opt_statement);
    if ($$body) {
      $$payload.out += `${$$body}`;
    }
    $$payload.out += `</textarea></td><td class="px-4 py-2"><textarea placeholder="Planned Actions" class="textarea textarea-bordered w-full" style="overflow: hidden">`;
    const $$body_1 = escape_html(row.planned_actions);
    if ($$body_1) {
      $$payload.out += `${$$body_1}`;
    }
    $$payload.out += `</textarea></td><td class="px-4 py-2"><textarea placeholder="KPI" class="textarea textarea-bordered w-full" style="overflow: hidden">`;
    const $$body_2 = escape_html(row.kpi);
    if ($$body_2) {
      $$payload.out += `${$$body_2}`;
    }
    $$payload.out += `</textarea></td><td class="px-4 py-2"><textarea placeholder="Key Persons" class="textarea textarea-bordered w-full" style="overflow: hidden">`;
    const $$body_3 = escape_html(row.key_persons);
    if ($$body_3) {
      $$payload.out += `${$$body_3}`;
    }
    $$payload.out += `</textarea></td><td class="px-4 py-2"><textarea placeholder="Target Output" class="textarea textarea-bordered w-full" style="overflow: hidden">`;
    const $$body_4 = escape_html(row.target_output);
    if ($$body_4) {
      $$payload.out += `${$$body_4}`;
    }
    $$payload.out += `</textarea></td><td class="px-4 py-2"><input type="number"${attr("value", row.budget)} placeholder="Budget" class="input input-bordered w-full"></td><td class="px-4 py-2"><button class="btn btn-sm btn-error">Delete</button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div> <button class="btn btn-secondary mt-4">Add Row</button> <button class="btn btn-primary mt-4"${attr("disabled", isLoading, true)}>${escape_html("Submit Opportunities")}</button></div></div>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  const { session } = data;
  let profile = null;
  let loading = true;
  const fetchUserProfile = async () => {
    if (session) {
      const { user } = session;
      const { data: data2, error } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (error) {
        console.error("Error fetching user profile:", error.message);
      } else {
        profile = data2;
        console.log("Role in Opportunities: ", profile);
      }
    }
    loading = false;
  };
  fetchUserProfile();
  $$payload.out += `<div>`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="loading loading-spinner loading-sm"></span> <p class="text-white">Loading...</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (session !== null && profile) {
      $$payload.out += "<!--[-->";
      if (profile.role === "admin") {
        $$payload.out += "<!--[-->";
        AdminOpportunities($$payload);
      } else {
        $$payload.out += "<!--[!-->";
        DepartmentOpportunities($$payload);
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};

import { J as ensure_array_like, K as attr, G as escape_html, L as stringify, B as pop, z as push } from "../../../chunks/index.js";
/* empty css                       */
import "../../../chunks/supabaseClient.js";
function _page($$payload, $$props) {
  push();
  let users = [];
  let approvingUserId = null;
  let deletingUserId = null;
  const each_array = ensure_array_like(users);
  $$payload.out += `<div class="min-h-screen bg-base-300 p-8">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <h1 class="text-2xl font-bold mb-4">User List</h1> <div class="overflow-x-auto"><table class="table w-full shadow-lg rounded-lg"><thead><tr><th>Profile</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead><tbody><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let user = each_array[$$index];
    $$payload.out += `<tr class="hover:bg-gray-800"><td>`;
    if (user.profile_pic) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<img${attr("src", user.profile_pic)} alt="Profile" class="w-10 h-10 rounded-full">`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">N/A</div>`;
    }
    $$payload.out += `<!--]--></td><td>${escape_html(user.first_name)}</td><td>${escape_html(user.last_name)}</td><td>${escape_html(user.email)}</td><td>${escape_html(user.role)}</td><td>${escape_html(user.department_name)}</td><td>`;
    if (user.is_verified) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="text-green-500 font-medium">Verified</span>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<span class="text-red-500 font-medium">Not Verified</span>`;
    }
    $$payload.out += `<!--]--></td><td><button class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white font-medium">Edit</button> `;
    if (!user.is_verified) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button${attr("class", `btn btn-sm bg-green-600 hover:bg-green-700 text-white font-medium ${stringify(approvingUserId === user.id ? "loading" : "")}`)}${attr("disabled", approvingUserId === user.id, true)}>`;
      if (approvingUserId === user.id) {
        $$payload.out += "<!--[-->";
        $$payload.out += `Approving...`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `Approve`;
      }
      $$payload.out += `<!--]--></button>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <button${attr("class", `btn btn-sm bg-red-600 hover:bg-red-700 text-white font-medium ${stringify(deletingUserId === user.id ? "loading" : "")}`)}${attr("disabled", deletingUserId === user.id, true)}>`;
    if (deletingUserId === user.id) {
      $$payload.out += "<!--[-->";
      $$payload.out += `Deleting...`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `Delete`;
    }
    $$payload.out += `<!--]--></button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};

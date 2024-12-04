import { B as pop, z as push, P as fallback, K as attr, F as bind_props, L as stringify } from "../../../../chunks/index.js";
import { s as supabase } from "../../../../chunks/supabaseClient.js";
import "jspdf";
import "jspdf-autotable";
/* empty css                          */
function AdminPlansMonitoring($$payload, $$props) {
  push();
  $$payload.out += `<div class="min-h-screen p-8 bg-base-300"><h1 class="text-3xl font-bold mb-6">Plans Monitoring</h1> <div class="flex space-x-4 mb-4"><button class="btn btn-primary svelte-1tziaei">Show All</button> <button class="btn btn-success svelte-1tziaei">Show Achieved</button> <button class="btn btn-error svelte-1tziaei">Show Not Achieved</button> <button class="btn btn-secondary ml-auto svelte-1tziaei">Export to PDF</button></div> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center text-xl"><span class="loading loading-spinner loading-md"></span> Loading...</div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function DeptPlansMonitoring($$payload, $$props) {
  push();
  $$payload.out += `<div class="min-h-screen p-8 bg-base-300"><h1 class="text-3xl font-bold mb-6">Plans Monitoring</h1> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center text-xl"><span class="loading loading-spinner loading-md"></span></div>`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = fallback($$props["data"], null);
  let session = null;
  let profile = null;
  let loading = true;
  const fetchUserProfile = async () => {
    try {
      if (data?.session) {
        session = data.session;
        const { user } = session;
        const { data: profileData, error } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (error) {
          console.error("Error fetching user profile:", error.message);
        } else {
          profile = profileData;
          console.log("Role in Opportunities: ", profile);
        }
      } else {
        console.warn("Session is not available or data is missing.");
      }
    } catch (error) {
      console.error("Error fetching user profile or session:", error);
    } finally {
      loading = false;
    }
  };
  fetchUserProfile();
  $$payload.out += `<div class="min-h-screen bg-base-300 p-8"><div role="tablist" class="tabs tabs-boxed"><a role="tab"${attr("class", `tab ${stringify("tab-active")}`)}>Plans</a> <a role="tab"${attr("class", `tab ${stringify("")}`)}>Risks</a> <a role="tab"${attr("class", `tab ${stringify("")}`)}>Opportunities</a></div> `;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center"><span class="loading loading-spinner loading-lg"></span> <p class="mt-2">Loading...</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (session !== null && profile) {
      $$payload.out += "<!--[-->";
      if (profile.role === "admin") {
        $$payload.out += "<!--[-->";
        {
          $$payload.out += "<!--[-->";
          AdminPlansMonitoring($$payload);
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
        if (profile.role === "user") {
          $$payload.out += "<!--[-->";
          {
            $$payload.out += "<!--[-->";
            DeptPlansMonitoring($$payload);
          }
          $$payload.out += `<!--]-->`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<p class="text-white text-xl">You do not have the required permissions to view this page.</p>`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-red-500 text-xl">Failed to load session or profile data.</p>`;
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

import { K as attr, G as escape_html, B as pop, z as push } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
/* empty css                                                  */
function Login($$payload, $$props) {
  push();
  let email = "";
  let isLoading = false;
  $$payload.out += `<div class="h-screen grid lg:grid-cols-2"><div class="relative hidden lg:block" style="background-image: linear-gradient(180deg, rgba(103, 21, 21, 0.8) 0%, rgba(103, 21, 21, 0.3) 50%), url('/images/login_bg.png');; background-repeat: no-repeat; background-size: cover; background-position: center;"><div class="relative z-10 h-full flex flex-col items-center justify-center space-y-4 p-10"><div class="text-center"><h1 class="text-5xl font-extrabold text-white tracking-tight mb-4">EuCorp</h1> <p class="text-xl text-gray-300 max-w-md">Your Institutional Planning System</p></div> <div class="mt-6 space-y-2 text-gray-200"><div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Streamline Project Management</p></div> <div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Enhance Collaboration</p></div> <div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Monitor Progress Effectively</p></div></div></div></div> <div class="flex items-center justify-center px-8"><div class="w-full max-w-md"><div class="text-center mb-8"><h1 class="text-2xl font-semibold">Create an account</h1> <p class="text-gray-600">Enter your email below to create your account</p></div> <form class="space-y-4"><input type="email"${attr("value", email)} placeholder="name@example.com" required class="input input-bordered w-full"> <button type="submit" class="btn bg-rose-700 w-full text-white"${attr("disabled", isLoading, true)}>`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <span>${escape_html("Sign In with Email")}</span></button></form> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="divider svelte-130ijz8">OR CONTINUE WITH</div> <button class="btn btn-outline w-full">Google</button> <p class="text-gray-500 text-sm text-center mt-4">By clicking continue, you agree to our <a href="/terms" class="hover:underline text-primary">Terms of Service</a> and <a href="/privacy" class="hover:underline text-primary">Privacy Policy</a>.</p></div></div></div>`;
  pop();
}
function _page($$payload) {
  Login($$payload);
}
export {
  _page as default
};

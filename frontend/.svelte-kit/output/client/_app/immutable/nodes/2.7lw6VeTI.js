import{c as v,a as u,t as _}from"../chunks/disclose-version.CM6f1PTD.js";import{p as b,f as w,a as E,g as k,b as y,d as N}from"../chunks/runtime.g0my00JR.js";import{i as R}from"../chunks/if.DVEvk735.js";import{i as A}from"../chunks/lifecycle.6aQbxLMK.js";import{p as C}from"../chunks/props.BjMJLEAs.js";import{o as U}from"../chunks/index-client.v1G0sw0w.js";/* empty css                         */import{g as s}from"../chunks/entry.Dj_Mz2ul.js";import{s as t}from"../chunks/supabaseClient.CaMOPPuz.js";var x=_('<div class="flex items-center justify-center min-h-screen bg-base-300"><div class="loader svelte-zc28ab"><span class="loading loading-spinner loading-sm"></span> Checking verification status...</div></div>');function V(p,l){b(l,!1);let i=C(l,"data",8)().session,d=N(!0),a=!1;const f=async()=>{var o,r;if(console.log("Ensuring session..."),!i){console.log("No session found. Redirecting to /login..."),s("/login");return}try{const e=i.user,{data:g,error:n}=await t.from("profiles").select("id, is_verified").eq("id",e.id).single();if(n)if(n.code==="PGRST116"){console.log("User not found in profiles. Adding new user...");const{error:m}=await t.from("profiles").insert({id:e.id,email:e.email,first_name:((o=e.user_metadata)==null?void 0:o.first_name)||"",last_name:((r=e.user_metadata)==null?void 0:r.last_name)||"",role:"user",is_verified:!1});if(m){console.error("Error adding new user to profiles:",m.message),s("/login");return}else console.log("New user added to profiles."),a=!1}else{console.error("Error fetching user profile:",n.message),s("/login");return}g&&(a=g.is_verified??!1,a?(console.log("User is verified. Redirecting to /dashboard..."),s("/dashboard")):(console.warn("User is not verified. Redirecting to /login..."),s("/login")))}catch(e){console.error("Error during session check:",e),s("/login")}finally{y(d,!1)}};U(()=>{console.log("Page mounted. Checking session..."),f();const{data:o}=t.auth.onAuthStateChange((r,e)=>{console.log("Auth state changed:",r,"New session:",e),i=e,i?f():(console.log("No active session, redirecting to login."),s("/login"))});return()=>{o.subscription.unsubscribe()}}),A();var c=v(),h=w(c);R(h,()=>k(d),o=>{var r=x();u(o,r)}),u(p,c),E()}export{V as component};

import{a as v,t as p,c as F}from"../chunks/disclose-version.CM6f1PTD.js";import{p as tt,a as rt,b as g,f as S,g as e,t as T,d as k,s as d,c,r as n}from"../chunks/runtime.g0my00JR.js";import{s as m}from"../chunks/render.pmuW5QOO.js";import{i as x}from"../chunks/if.DVEvk735.js";import{e as et,i as ot}from"../chunks/each.BeKM084r.js";import{e as G}from"../chunks/utils.sCj8HAia.js";import{i as at}from"../chunks/lifecycle.6aQbxLMK.js";import{s as st,a as it}from"../chunks/store.6LPOOnpP.js";import{o as nt}from"../chunks/index-client.v1G0sw0w.js";import{s as b}from"../chunks/supabaseClient.CaMOPPuz.js";import{p as ct}from"../chunks/stores.C8ewMCja.js";import{E as lt,a as dt}from"../chunks/jspdf.plugin.autotable.4s0l0uhg.js";var vt=p("<p><strong>Strategic Goal:</strong> </p>"),pt=p("<p><strong>Objective Name:</strong> </p> <!>",1),_t=p('<h2 class="text-xl font-bold">Loading Objective...</h2>'),ft=p('<h2 class="text-xl font-bold">Objective not found.</h2>'),gt=p("<div>Loading action plans...</div>"),mt=p('<tr><td> </td><td> </td><td> </td><td> </td><td class="flex space-x-2"><button class="btn btn-sm btn-success text-white svelte-1gak4wa"> </button> <button class="btn btn-sm btn-error text-white svelte-1gak4wa">Delete</button></td></tr>'),bt=p('<div class="overflow-x-auto"><table class="table table-zebra w-full shadow-lg rounded-lg svelte-1gak4wa"><thead><tr><th>Actions Taken</th><th>KPI</th><th>Target Output</th><th>Key Person Responsible</th><th>Actions</th></tr></thead><tbody></tbody></table></div>'),ut=p("<div>No action plans found for this objective.</div>"),ht=p('<div class="min-h-screen bg-base-300 p-8"><h1 class="text-2xl font-bold mb-4">Action Plans</h1> <div class="mb-4"><!></div> <button class="btn btn-secondary mb-4 svelte-1gak4wa">Export to PDF</button> <!></div>');function Nt(L,R){tt(R,!1);const Y=st(),C=()=>it(ct,"$page",Y);let _=k([]),w=k(null),u=k(null),y=null,E=k(!0);nt(async()=>{const{params:r}=C();if(y=parseInt(r.id),y)try{const{data:t,error:s}=await b.from("action_plans").select("*").eq("objective_id",y);s?console.error("Error fetching action plans:",s):g(_,t);const{data:i,error:o}=await b.from("strategic_objectives").select("id, name, strategic_goal_id").eq("id",y).single();if(o)console.error("Error fetching objective:",o);else{g(w,i);const{data:l,error:a}=await b.from("strategic_goals").select("id, name").eq("id",i.strategic_goal_id).single();a?console.error("Error fetching strategic goal:",a):g(u,l)}}catch(t){console.error("Error:",t)}finally{g(E,!1)}else console.error("Objective ID is missing."),g(E,!1)});const I=async r=>{try{const{data:t,error:s}=await b.from("action_plans").select("profile_id").eq("id",r).single();if(s||!t){console.error("Error fetching profile_id from action_plan:",s);return}const i=t.profile_id,{error:o}=await b.from("action_plans").update({is_approved:!0}).eq("id",r);if(o){console.error("Error approving action plan:",o);return}const{error:l}=await b.from("plan_monitoring").insert({action_plan_id:r,profile_id:i});l?console.error("Error inserting into plan_monitoring:",l):g(_,e(_).map(a=>a.id===r?{...a,is_approved:!0}:a))}catch(t){console.error("Error approving action plan:",t)}},M=async r=>{try{const{error:t}=await b.from("action_plans").delete().eq("id",r);t?console.error("Error deleting action plan:",t):g(_,e(_).filter(s=>s.id!==r))}catch(t){console.error("Error deleting action plan:",t)}},B=()=>{var l;const r=new lt("landscape"),t=`Action Plans for Objective: ${((l=e(w))==null?void 0:l.name)||"N/A"}`,s=e(u)?`Strategic Goal: ${e(u).name}`:"No Strategic Goal Assigned";r.setFontSize(10),r.text(t,14,15),r.text(s,14,25);const i=["Actions Taken","KPI","Target Output","Key Person Responsible","Approved"],o=e(_).map(a=>[a.actions_taken,a.kpi,a.target_output,a.key_person_responsible,a.is_approved?"Yes":"No"]);dt(r,{head:[i],body:o,startY:35,theme:"grid",styles:{fontSize:10},headStyles:{fillColor:[41,128,185]}}),r.save("ActionPlans.pdf")};at();var j=ht(),A=d(c(j),2),H=c(A);x(H,()=>e(w),r=>{var t=pt(),s=S(t),i=d(c(s));n(s);var o=d(s,2);x(o,()=>e(u),l=>{var a=vt(),P=d(c(a));n(a),T(()=>m(P,` ${e(u).name??""}`)),v(l,a)}),T(()=>m(i,` ${e(w).name??""}`)),v(r,t)},r=>{var t=F(),s=S(t);x(s,()=>e(E),i=>{var o=_t();v(i,o)},i=>{var o=ft();v(i,o)},!0),v(r,t)}),n(A);var K=d(A,2),J=d(K,2);x(J,()=>e(E),r=>{var t=gt();v(r,t)},r=>{var t=F(),s=S(t);x(s,()=>e(_).length>0,i=>{var o=bt(),l=c(o),a=d(c(l));et(a,5,()=>e(_),ot,(P,f)=>{var D=mt(),$=c(D),Q=c($,!0);n($);var O=d($),U=c(O,!0);n(O);var q=d(O),V=c(q,!0);n(q);var N=d(q),W=c(N,!0);n(N);var z=d(N),h=c(z),X=c(h,!0);n(h);var Z=d(h,2);n(z),n(D),T(()=>{m(Q,e(f).actions_taken),m(U,e(f).kpi),m(V,e(f).target_output),m(W,e(f).key_person_responsible),h.disabled=e(f).is_approved,m(X,e(f).is_approved?"Approved":"Approve")}),G("click",h,()=>I(e(f).id)),G("click",Z,()=>M(e(f).id)),v(P,D)}),n(a),n(l),n(o),v(i,o)},i=>{var o=ut();v(i,o)},!0),v(r,t)}),n(j),G("click",K,B),v(L,j),rt()}export{Nt as component};
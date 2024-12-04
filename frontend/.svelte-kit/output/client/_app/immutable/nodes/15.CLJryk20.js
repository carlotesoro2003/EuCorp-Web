import{a as m,t as p}from"../chunks/disclose-version.CM6f1PTD.js";import{p as vt,a as ct,g as t,f as U,t as W,b as f,m as k,c as s,s as e,r,d as z}from"../chunks/runtime.g0my00JR.js";import{s as _}from"../chunks/render.pmuW5QOO.js";import{i as B}from"../chunks/if.DVEvk735.js";import{e as mt,i as _t}from"../chunks/each.BeKM084r.js";import{e as L}from"../chunks/utils.sCj8HAia.js";import{r as P}from"../chunks/misc.CY9ixZp3.js";import{b as D}from"../chunks/input.N22HgeA5.js";import{i as pt}from"../chunks/lifecycle.6aQbxLMK.js";import{s as gt,a as ft}from"../chunks/store.6LPOOnpP.js";import{o as bt}from"../chunks/index-client.v1G0sw0w.js";import{s as H}from"../chunks/supabaseClient.CaMOPPuz.js";import{p as ut}from"../chunks/stores.fMx5rsW_.js";import{g as xt}from"../chunks/entry.CKTm3BkS.js";import{E as ht,a as wt}from"../chunks/jspdf.plugin.autotable.4s0l0uhg.js";var yt=p('<span class="loading loading-spinner text-primary">Loading...</span>'),St=p('<p class="mb-4"><strong>Goal Name:</strong> </p> <p class="mb-4"><strong>Lead:</strong> </p>',1),Et=p("<p>Goal details not found.</p>"),kt=p('<td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3"></textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3"></textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3"></textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3"></textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3"></textarea></td> <td><textarea class="textarea textarea-bordered w-full svelte-1ydiet3"></textarea></td> <td><button class="btn btn-primary">Save</button> <button class="btn btn-secondary">Cancel</button></td>',1),Ot=p('<td> </td> <td> </td> <td> </td> <td> </td> <td> </td> <td> </td> <td><button class="btn btn-primary text-white">View</button> <button class="btn btn-secondary text-white">Edit</button></td>',1),$t=p("<tr><!></tr>"),It=p('<div class="mt-8"><h1 class="text-3xl font-bold mb-4"> </h1> <!> <a href="/plans/strategicPlans" class="btn btn-primary text-white mt-4">Add More Strategic Objectives</a> <button class="btn btn-secondary text-white mt-4">Export to PDF</button> <table class="table table-zebra w-full mt-5"><thead><tr><th>Strategic Objectives</th><th>Strategic Initiatives</th><th>KPI</th><th>Persons Involved</th><th>Target</th><th>Evaluation Measures</th><th>Actions</th></tr></thead><tbody></tbody></table></div>'),Pt=p('<div class="mt-8"><p>No objectives found for this goal.</p> <a href="/plans/strategicPlans" class="btn btn-primary text-white mt-4">Add Strategic Objectives for this Goal</a></div>'),Dt=p('<div class="container mx-auto p-4"><!> <!></div>');function Ht(rt,st){vt(st,!1);const ot=gt(),X=()=>ft(ut,"$page",ot);let n=z(null),M=z([]),T=z(!1),O=null,$=z(null),o=z({});const Z=async()=>{if(O!==null){f(T,!0);try{const{data:a,error:l}=await H.from("strategic_goals").select("id, name, goal_no, lead_id").eq("id",O).single();if(l||!a)throw new Error("Failed to fetch goal details");if(f(n,{id:a.id,name:a.name,goal_no:a.goal_no,lead:""}),a.lead_id){const{data:F,error:G}=await H.from("leads").select("name").eq("id",a.lead_id).single();G?console.error("Error fetching lead name:",G):F&&k(n,t(n).lead=F.name)}const{data:I,error:v}=await H.from("strategic_objectives").select("*").eq("strategic_goal_id",O);if(v)throw new Error("Failed to fetch objectives");f(M,I||[])}catch(a){console.error(a)}finally{f(T,!1)}}},it=async()=>{if(t($)){const{error:a}=await H.from("strategic_objectives").update(t(o)).eq("id",t($).id);a?console.error("Error updating objective:",a):(Z(),f($,null))}},lt=a=>{O!==null&&xt(`/plans/${O}/${a}`)},dt=()=>{const a=new ht("landscape","mm","a4");a.setFontSize(18),a.text("Strategic Objectives",14,20),t(n)&&(a.setFontSize(12),a.text(`Goal Name: ${t(n).name}`,14,30),a.text(`Lead: ${t(n).lead}`,14,37));const l=t(M).map(v=>[v.name,v.strategic_initiatives,v.kpi,v.persons_involved,v.target,v.eval_measures]);wt(a,{head:[["Strategic Objectives","Strategic Initiatives","KPI","Persons Involved","Target","Evaluation Measures"]],body:l,startY:45,theme:"grid",styles:{fontSize:10}}),a.save("StrategicObjectives.pdf")};bt(()=>{O=X().params.id?parseInt(X().params.id):null,Z()}),pt();var J=Dt(),tt=s(J);B(tt,()=>t(T),a=>{var l=yt();m(a,l)});var nt=e(tt,2);B(nt,()=>!t(T)&&t(M).length>0,a=>{var l=It(),I=s(l),v=s(I);r(I);var F=e(I,2);B(F,()=>t(n),g=>{var i=St(),b=U(i),Q=e(s(b));r(b);var c=e(b,2),u=e(s(c));r(c),W(()=>{_(Q,` ${t(n).name??""}`),_(u,` ${t(n).lead??""}`)}),m(g,i)},g=>{var i=Et();m(g,i)});var G=e(F,4),at=e(G,2),et=e(s(at));mt(et,5,()=>t(M),_t,(g,i)=>{var b=$t(),Q=s(b);B(Q,()=>{var c;return((c=t($))==null?void 0:c.id)===t(i).id},c=>{var u=kt(),x=U(u),A=s(x);P(A),r(x);var h=e(x,2),N=s(h);P(N),r(h);var w=e(h,2),C=s(w);P(C),r(w);var y=e(w,2),K=s(y);P(K),r(y);var S=e(y,2),V=s(S);P(V),r(S);var E=e(S,2),Y=s(E);P(Y),r(E);var j=e(E,2),q=s(j),R=e(q,2);r(j),D(A,()=>t(o).name,d=>k(o,t(o).name=d)),D(N,()=>t(o).strategic_initiatives,d=>k(o,t(o).strategic_initiatives=d)),D(C,()=>t(o).kpi,d=>k(o,t(o).kpi=d)),D(K,()=>t(o).persons_involved,d=>k(o,t(o).persons_involved=d)),D(V,()=>t(o).target,d=>k(o,t(o).target=d)),D(Y,()=>t(o).eval_measures,d=>k(o,t(o).eval_measures=d)),L("click",q,it),L("click",R,()=>f($,null)),m(c,u)},c=>{var u=Ot(),x=U(u),A=s(x,!0);r(x);var h=e(x,2),N=s(h,!0);r(h);var w=e(h,2),C=s(w,!0);r(w);var y=e(w,2),K=s(y,!0);r(y);var S=e(y,2),V=s(S,!0);r(S);var E=e(S,2),Y=s(E,!0);r(E);var j=e(E,2),q=s(j),R=e(q,2);r(j),W(()=>{_(A,t(i).name),_(N,t(i).strategic_initiatives),_(C,t(i).kpi),_(K,t(i).persons_involved),_(V,t(i).target),_(Y,t(i).eval_measures)}),L("click",q,()=>lt(t(i).id)),L("click",R,()=>{f($,t(i)),f(o,{...t(i)})}),m(c,u)}),r(b),m(g,b)}),r(et),r(at),r(l),W(()=>{var g;return _(v,`Strategic Objectives for Goal ${((g=t(n))==null?void 0:g.goal_no)??""}`)}),L("click",G,dt),m(a,l)},a=>{var l=Pt();m(a,l)}),r(J),m(rt,J),ct()}export{Ht as component};
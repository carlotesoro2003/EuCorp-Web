import{a as f,t as A,b as Q}from"../chunks/disclose-version.CM6f1PTD.js";import{p as at,a as st,b as n,g as t,s as o,c as r,r as s,t as z,m as R,d as u}from"../chunks/runtime.g0my00JR.js";import{s as D}from"../chunks/render.pmuW5QOO.js";import{i as k}from"../chunks/if.DVEvk735.js";import{e as rt,i as lt}from"../chunks/each.BeKM084r.js";import{r as U}from"../chunks/attributes.BVavg5V5.js";import{s as B}from"../chunks/class.tYA33czU.js";import{e as w}from"../chunks/utils.sCj8HAia.js";import{b as V}from"../chunks/input.N22HgeA5.js";import{i as nt}from"../chunks/lifecycle.6aQbxLMK.js";import{o as ot}from"../chunks/index-client.v1G0sw0w.js";/* empty css                         */import{s as E}from"../chunks/supabaseClient.CaMOPPuz.js";var it=A("<div><span> </span></div>"),dt=A('<tr class="hover border-b border-gray-700"><td class="px-6 py-4 "> </td><td class="px-6 py-4 "> </td><td class="px-6 py-4 flex gap-4"><button class="btn btn-sm bg-blue-600 hover:bg-blue-700  font-medium">Edit</button> <button><!></button></td></tr>'),mt=A('<div class="modal modal-open"><div class="modal-box bg-base-200"><h2 class="font-bold text-xl mb-4"> </h2> <label for="department-name" class="block mb-2 text-white">Department Name</label> <input id="department-name" type="text" class="input input-bordered w-full mb-4"> <label for="full-name" class="block mb-2 text-white">Full Name</label> <input id="full-name" type="text" class="input input-bordered w-full mb-4"> <div class="modal-action"><button><!></button> <button class="btn">Cancel</button></div></div></div>'),ut=A('<div class="min-h-screen bg-base-300 p-8"><h1 class="text-3xl font-bold mb-6">Department List</h1> <!> <div class="overflow-x-auto bg-base-100 shadow-lg rounded-lg"><table class="table w-full"><thead><tr><th class="px-6 py-4">Department Name</th><th class="px-6 py-4">Full Name</th><th class="px-6 py-4">Actions</th></tr></thead><tbody></tbody></table></div> <div class="mt-6"><button class="btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium">Add Department</button></div> <!></div>');function Et(W,X){at(X,!1);let G=u([]),N=u(!1),M=u(!1),l=u({id:null,name:"",full_name:""}),H=u(""),I=u("success"),$=u(!1),_=u(!1),g=u(!1);ot(async()=>{await y()});const y=async()=>{const{data:a,error:e}=await E.from("departments").select("id, name, full_name");e?c("Error fetching departments","error"):n(G,a)},c=(a,e="success")=>{n(H,a),n(I,e),n($,!0),setTimeout(()=>n($,!1),3e3)},J=(a={id:null,name:"",full_name:""})=>{n(l,{...a}),n(M,a.id!==null),n(N,!0)},q=()=>{n(N,!1),n(l,{id:null,name:"",full_name:""})},Y=async()=>{if(n(_,!0),t(M)&&t(l).id!==null){const{error:a}=await E.from("departments").update({name:t(l).name,full_name:t(l).full_name}).eq("id",t(l).id);a?c("Error updating department","error"):(c("Department updated successfully"),await y(),q())}else{const{error:a}=await E.from("departments").insert({name:t(l).name,full_name:t(l).full_name});a?c("Error adding department","error"):(c("Department added successfully"),await y(),q())}n(_,!1)},Z=async a=>{n(g,!0);const{error:e}=await E.from("departments").delete().eq("id",a);e?c("Error deleting department","error"):(c("Department deleted successfully"),await y()),n(g,!1)};nt();var F=ut(),K=o(r(F),2);k(K,()=>t($),a=>{var e=it(),i=r(e),d=r(i,!0);s(i),s(e),z(()=>{B(e,`alert ${t(I)==="success"?"alert-success":"alert-error"} shadow-lg mb-6`),D(d,t(H))}),f(a,e)});var S=o(K,2),O=r(S),P=o(r(O));rt(P,5,()=>t(G),lt,(a,e)=>{var i=dt(),d=r(i),C=r(d,!0);s(d);var p=o(d),h=r(p,!0);s(p);var x=o(p),m=r(x),b=o(m,2),L=r(b);k(L,()=>!t(g),v=>{var j=Q("Delete");f(v,j)}),s(b),s(x),s(i),z(()=>{D(C,t(e).name),D(h,t(e).full_name),B(b,`btn  btn-sm bg-red-600 hover:bg-red-700  font-medium ${(t(g)?"loading":"")??""}`),b.disabled=t(g)}),w("click",m,()=>J(t(e))),w("click",b,()=>Z(t(e).id)),f(a,i)}),s(P),s(O),s(S);var T=o(S,2),tt=r(T);s(T);var et=o(T,2);k(et,()=>t(N),a=>{var e=mt(),i=r(e),d=r(i),C=r(d,!0);s(d);var p=o(d,4);U(p);var h=o(p,4);U(h);var x=o(h,2),m=r(x),b=r(m);k(b,()=>!t(_),v=>{var j=Q("Save");f(v,j)}),s(m);var L=o(m,2);s(x),s(i),s(e),z(()=>{D(C,t(M)?"Edit Department":"Add Department"),B(m,`btn btn-success ${(t(_)?"loading":"")??""}`),m.disabled=t(_)}),V(p,()=>t(l).name,v=>R(l,t(l).name=v)),V(h,()=>t(l).full_name,v=>R(l,t(l).full_name=v)),w("click",m,Y),w("click",L,q),f(a,e)}),s(F),w("click",tt,()=>J()),f(W,F),st()}export{Et as component};
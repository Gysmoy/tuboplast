import{j as e}from"./DataGrid-DAFs00V8.js";import{r as x}from"./index-RYns6xqu.js";import{r as u}from"./index-DJSEUtJE.js";const g=`
.cm-ovl{position:fixed;inset:0;z-index:1300;background:rgba(15,23,42,.5);display:flex;align-items:center;justify-content:center;padding:12px;}
.cm-box{width:min(420px,96vw);background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);overflow:hidden;}
.cm-body{padding:24px 22px 18px;text-align:center;}
.cm-icon{width:54px;height:54px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:12px;}
.cm-icon.danger{background:#fcebeb;color:#e24b4a;}
.cm-icon.primary{background:#e6effa;color:#004991;}
.cm-title{font-size:17px;font-weight:700;color:#0f2540;margin:0 0 6px;}
.cm-msg{font-size:13.5px;color:#5b6577;margin:0;line-height:1.5;}
.cm-foot{display:flex;gap:8px;justify-content:center;padding:0 22px 22px;}
.cm-btn{height:40px;padding:0 18px;border-radius:10px;border:0;font-weight:600;font-size:13px;cursor:pointer;transition:background .2s,filter .2s;}
.cm-btn.cancel{background:#fff;border:1px solid #dce5f0;color:#5b6577;}
.cm-btn.cancel:hover{background:#f4f8fd;color:#0f2540;}
.cm-btn.danger{background:#e24b4a;color:#fff;}.cm-btn.danger:hover{filter:brightness(.94);}
.cm-btn.primary{background:#004991;color:#fff;}.cm-btn.primary:hover{background:#003b7a;}
.cm-btn:disabled{opacity:.6;cursor:not-allowed;}
`;let s=!1;const h=()=>{if(s||typeof document>"u")return;s=!0;const r=document.createElement("style");r.textContent=g,document.head.appendChild(r)},v=({open:r,title:d="¿Estás seguro?",message:i,confirmLabel:a="Confirmar",cancelLabel:m="Cancelar",variant:c="danger",loading:o=!1,icon:l,onConfirm:f,onCancel:t})=>{if(h(),x.useEffect(()=>{if(!r)return;const n=b=>{b.key==="Escape"&&!o&&(t==null||t())};return document.addEventListener("keydown",n),()=>document.removeEventListener("keydown",n)},[r,o,t]),!r)return null;const p=l||(c==="danger"?"mdi mdi-trash-can-outline":"mdi mdi-help-circle-outline");return u.createPortal(e.jsx("div",{className:"cm-ovl",onMouseDown:()=>{o||t==null||t()},children:e.jsxs("div",{className:"cm-box",onMouseDown:n=>n.stopPropagation(),children:[e.jsxs("div",{className:"cm-body",children:[e.jsx("span",{className:`cm-icon ${c}`,children:e.jsx("i",{className:p})}),e.jsx("h3",{className:"cm-title",children:d}),i&&e.jsx("p",{className:"cm-msg",children:i})]}),e.jsxs("div",{className:"cm-foot",children:[e.jsx("button",{type:"button",className:"cm-btn cancel",onClick:t,disabled:o,children:m}),e.jsx("button",{type:"button",className:`cm-btn ${c}`,onClick:f,disabled:o,children:o?"Procesando…":a})]})]})}),document.body)};export{v as default};

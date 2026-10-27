"use strict";
(()=>{
 const selector=document.getElementById('oraculoLang');
 const translate=document.getElementById('oraculoTranslate');
 const help=document.getElementById('oraculoLanguageHelp');
 const status=document.getElementById('oraculoLanguageStatus');
 if(!selector||!translate||!help||!status)return;
 const choices=new Set([...selector.options].map(x=>x.value));
 try{const saved=localStorage.getItem('oraculo-language');if(saved&&choices.has(saved))selector.value=saved}catch{}
 selector.addEventListener('change',()=>{
  try{localStorage.setItem('oraculo-language',selector.value)}catch{}
  status.textContent=selector.value==='pt'?'Português é o idioma original do site.':'Idioma selecionado. Clique em “Traduzir página” para abrir uma tradução externa.';
 });
 translate.addEventListener('click',()=>{
  const target=selector.value;
  if(target==='pt'){
   status.textContent='A versão original do Oráculo já está em português.';
   return;
  }
  const url=new URL('https://translate.google.com/translate');
  url.searchParams.set('sl','pt');url.searchParams.set('tl',target);
  url.searchParams.set('u',location.href.split('#')[0]);
  const win=window.open(url.toString(),'_blank','noopener,noreferrer');
  status.textContent=win?'Tradução externa aberta. Não informe senhas, dados pessoais ou conteúdo privado ao tradutor.':'O navegador pode ter bloqueado a janela: permita pop-ups para usar a tradução.';
 });
 help.addEventListener('click',()=>{
  status.textContent='No Chrome/Edge: clique com o botão direito na página e escolha “Traduzir para...”; no celular, abra o menu ⋮ e selecione “Traduzir”. O conteúdo traduzido não substitui as fontes oficiais.';
 });
})();

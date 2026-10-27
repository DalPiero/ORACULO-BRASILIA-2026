(()=>{'use strict';
async function download(format,{secret,question,answer,sources=[]}){
if(!secret)throw Error('Entre novamente como administrador.');
if(!answer||!answer.trim())throw Error('Gere uma consulta antes de baixar o relatório.');
const title=(question||'Relatório de consulta').trim().slice(0,135);
const date=new Date().toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'});
const lines=['ORÁCULO DE BRASÍLIA 2026','Relatório de pesquisa e consulta','Data de geração (Brasília): '+date,'','PERGUNTA',question||'Consulta administrativa','','RESPOSTA',answer,'','FONTES CONSULTADAS'];
for(let i=0;i<sources.length;i++)lines.push((i+1)+'. '+(sources[i].title||sources[i].url)+' — '+sources[i].url);
lines.push('','NOTA EDITORIAL: Esta resposta deve ser conferida nas fontes primárias antes de publicação. Projeções eleitorais não equivalem a resultados oficiais.');
const response=await fetch('/api/export',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json','X-ORACULO-ADMIN':secret},body:JSON.stringify({title,text:lines.join('\n'),format,cover:true})});
if(!response.ok){const error=await response.json().catch(()=>({}));throw Error(error.error||'Falha ao gerar o documento: HTTP '+response.status)}
const blob=await response.blob();if(!blob.size)throw Error('Arquivo vazio retornado pelo servidor.');
const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='Oraculo_Relatorio_Consulta_'+new Date().toISOString().slice(0,10)+(format==='docx'?'.docx':'.pdf');
document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
window.OraculoReport={download};
})();
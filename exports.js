import express from 'express';
import PDFDocument from 'pdfkit';
import {Document, Packer, Paragraph, TextRun, PageBreak, ImageRun, AlignmentType, Header, Footer} from 'docx';
import sharp from 'sharp';
const router=express.Router();
router.use(express.json({limit:'1mb'}));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const safeTitle=s=>String(s||'Relatório eleitoral').slice(0,140);
const valid=x=>typeof x?.text==='string'&&x.text.length>0&&x.text.length<150000&&typeof x?.title==='string'&&x.title.length<200;
const linify=(text,max=95)=>{let out=[];for(const par of text.replace(/\r/g,'').split('\n')){if(!par){out.push('');continue}let line='';for(const word of par.split(/\s+/)){if((line+' '+word).length>max&&line){out.push(line);line=word}else line+=(line?' ':'')+word}out.push(line)}return out};
const coverSvg=(title,topic)=>Buffer.from('<svg width="1240" height="1754" xmlns="http://www.w3.org/2000/svg"><rect width="1240" height="1754" fill="#0d2338"/><path d="M0 360L1240 80 M0 1450L1240 1100" stroke="#b99b55" stroke-width="12" opacity=".7"/><circle cx="620" cy="720" r="240" fill="none" stroke="#c5aa6a" stroke-width="9"/><path d="M620 490v460M390 720h460" stroke="#c5aa6a" stroke-width="4" opacity=".6"/><text x="620" y="190" font-size="45" fill="#e4c98c" text-anchor="middle" font-family="sans-serif">ORÁCULO DE BRASÍLIA 2026</text><text x="620" y="1210" font-size="47" fill="#fff" text-anchor="middle" font-family="sans-serif">'+esc(title.slice(0,39))+'</text><text x="620" y="1300" font-size="28" fill="#e6d4ad" text-anchor="middle" font-family="sans-serif">'+esc(topic.slice(0,52))+'</text><text x="620" y="1650" font-size="29" fill="#e4c98c" text-anchor="middle" font-family="sans-serif">Professor Dr. Fadal · @fadalprofdr</text></svg>');

// Gráfico editorial gerado exclusivamente a partir de valores fornecidos pelo administrador.
function chartSvg(chart){
 if(!chart||chart.type==='none')return null;
 const types=['bar','horizontal','line','pie'];
 if(!types.includes(chart.type)||!Array.isArray(chart.points)||chart.points.length<2||chart.points.length>12)throw Error('Gráfico inválido.');
 const pts=chart.points.map(x=>({label:String(x.label||'').trim().slice(0,28),value:Number(x.value)}));
 if(pts.some(x=>!x.label||!Number.isFinite(x.value)||x.value<0||x.value>1e9))throw Error('Dados numéricos inválidos.');
 const max=Math.max(...pts.map(x=>x.value),1), W=1000,H=610;
 const colors=['#a77d34','#254a6c','#548477','#96655b','#6975a0','#8b7546','#527b95','#b48d73','#587d65','#8078a4','#998a64','#396b87'];
 let svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="610"><rect width="1000" height="610" fill="#fff"/><text x="45" y="48" font-size="28" fill="#102b43" font-family="sans-serif">GRÁFICO — DADOS INFORMADOS PELO ADMINISTRADOR</text><path d="M45 65H955" stroke="#bc9e62" stroke-width="3"/>';
 const label=(x,y,t,size=15,anchor='start')=>'<text x="'+x+'" y="'+y+'" font-family="sans-serif" font-size="'+size+'" fill="#23384a" text-anchor="'+anchor+'">'+esc(t)+'</text>';
 if(chart.type==='bar'){
   const w=790/pts.length;pts.forEach((p,i)=>{let bh=395*p.value/max,x=105+i*w+10;svg+='<rect x="'+x+'" y="'+(495-bh)+'" width="'+Math.max(10,w-22)+'" height="'+bh+'" fill="'+colors[i%colors.length]+'"/>'+label(x+w/2-11,517,p.label.slice(0,12),12,'middle')+label(x+w/2-11,Math.max(85,483-bh),p.value,13,'middle')});
 }else if(chart.type==='horizontal'){
   pts.forEach((p,i)=>{const y=96+i*(450/pts.length),bw=630*p.value/max;svg+=label(50,y+18,p.label.slice(0,25),14)+'<rect x="260" y="'+y+'" width="'+bw+'" height="25" fill="'+colors[i%colors.length]+'"/>'+label(270+bw,y+19,p.value,14)});
 }else if(chart.type==='line'){
   let points=pts.map((p,i)=>[110+i*760/(pts.length-1),495-375*p.value/max]);svg+='<polyline points="'+points.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#254a6c" stroke-width="5"/>';points.forEach((pt,i)=>{svg+='<circle cx="'+pt[0]+'" cy="'+pt[1]+'" r="7" fill="#ae884a"/>'+label(pt[0],pt[1]-16,pts[i].value,13,'middle')+label(pt[0],520,pts[i].label.slice(0,12),12,'middle')});
 }else{
 const sum=pts.reduce((a,p)=>a+p.value,0);if(sum<=0)throw Error('O gráfico de setores exige valores positivos.');
 let a=-Math.PI/2;pts.forEach((p,i)=>{const next=a+2*Math.PI*p.value/sum,r=190,cx=330,cy=325;const x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a),x2=cx+r*Math.cos(next),y2=cy+r*Math.sin(next);if(p.value>0){svg+='<path d="M'+cx+' '+cy+' L'+x1+' '+y1+' A'+r+' '+r+' 0 '+(next-a>Math.PI?1:0)+' 1 '+x2+' '+y2+' Z" fill="'+colors[i%colors.length]+'"/>'}svg+='<rect x="615" y="'+(100+i*37)+'" width="16" height="16" fill="'+colors[i%colors.length]+'"/>'+label(640,114+i*37,p.label+': '+p.value,15);a=next});
 }
 svg+=label(50,585,'Fonte: valores manuais fornecidos pelo administrador; não são verificados automaticamente.',14)+'</svg>';
 return Buffer.from(svg);
}

function pdf(text,title,imageOnly,cover,chart){return new Promise(async(resolve,reject)=>{try{const doc=new PDFDocument({size:'A4',margin:52,autoFirstPage:false,compress:true});const chunks=[];doc.on('data',b=>chunks.push(b));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);
if(cover){doc.addPage();const image=await sharp(coverSvg(title,'Análise documentada')).png().toBuffer();doc.image(image,0,0,{width:595.28,height:841.89})}
if(!imageOnly){doc.addPage();doc.fillColor('#142a40').fontSize(17).text(title);doc.moveDown();doc.fillColor('#111').fontSize(10);doc.text(text,{lineGap:3});}else{let lines=linify(text,92),perPage=53;for(let i=0;i<lines.length;i+=perPage){const group=lines.slice(i,i+perPage);let t=group.map((l,k)=>'<text x="76" y="'+(154+k*27)+'" font-size="21" fill="#172638" font-family="sans-serif">'+esc(l)+'</text>').join('');let svg=Buffer.from('<svg width="1240" height="1754" xmlns="http://www.w3.org/2000/svg"><rect width="1240" height="1754" fill="white"/><text x="76" y="90" font-size="30" fill="#102c47" font-family="sans-serif">'+esc(title.slice(0,50))+'</text><path d="M76 107H1165" stroke="#b8a06d" stroke-width="4"/>'+t+'</svg>');const png=await sharp(svg).png().toBuffer();doc.addPage();doc.image(png,0,0,{width:595.28,height:841.89})}}if(chart){const image=await sharp(chartSvg(chart)).png().toBuffer();doc.addPage();doc.image(image,35,135,{fit:[525,420]})}doc.end()}catch(e){reject(e)}})}
async function docx(text,title,cover,chart){const children=[];if(cover){const png=await sharp(coverSvg(title,'Relatório editorial')).resize({width:595}).png().toBuffer();children.push(new Paragraph({children:[new ImageRun({data:png,transformation:{width:595,height:842},type:'png'})],pageBreakBefore:false}));children.push(new Paragraph({children:[new PageBreak()]}));}children.push(new Paragraph({children:[new TextRun({text:title,bold:true,size:34})]}));for(const line of text.replace(/\r/g,'').split('\n'))children.push(new Paragraph({children:[new TextRun({text:line,size:22})],spacing:{after:100}}));if(chart){const png=await sharp(chartSvg(chart)).png().toBuffer();children.push(new Paragraph({children:[new ImageRun({data:png,type:'png',transformation:{width:510,height:311}})],pageBreakBefore:true}))}const doc=new Document({sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:900,bottom:900,left:900,right:900}}},children}]});return Packer.toBuffer(doc)}
router.post('/',async(req,res)=>{const {text,title,format,cover=true,chart=null}=req.body||{};if(!valid(req.body)||!['pdf','docx','pdf-image'].includes(format))return res.status(400).json({error:'Forneça título, texto e formato válidos.'});try{const output=format==='docx'?await docx(text,safeTitle(title),cover,chart):await pdf(text,safeTitle(title),format==='pdf-image',cover,chart);res.set('Cache-Control','no-store');res.set('Content-Type',format==='docx'?'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'application/pdf');res.set('Content-Disposition','attachment; filename="oraculo-relatorio.'+(format==='docx'?'docx':'pdf')+'"');res.send(output)}catch(e){console.error('Export failure:',e.message);res.status(500).json({error:'Não foi possível exportar o relatório.'})}});
export default router;

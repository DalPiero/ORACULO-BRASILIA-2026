(()=>{'use strict';
const tracks=[
{id:'masters',title:"The Master's Song",year:'1723',query:"The Master's Song Anderson 1723"},
{id:'apprentice',title:"The Enter'd Apprentice's Song",year:'1722–1723',query:"Entered Apprentice Song 1723"},
{id:'naudot',title:'Canções de Naudot',year:'1737',query:'Jacques Christophe Naudot masonic songs'},
{id:'lire',title:'La Lire Maçonne',year:'1766',query:'La Lire Maçonne 1766'},
{id:'gesellen',title:'Lied zur Gesellenreise — Mozart',year:'1785',query:'Mozart K 468 Lied zur Gesellenreise'},
{id:'freude',title:'Die Maurerfreude — Mozart',year:'1785',query:'Mozart K471 Die Maurerfreude'},
{id:'trauermusik',title:'Maurerische Trauermusik — Mozart',year:'1785',query:'Mozart K477 Maurerische Trauermusik'},
{id:'zauber',title:'Die Zauberflöte — Mozart (abertura)',year:'1791',file:'Mozart - Magic Flute Overture.ogg',source:'https://commons.wikimedia.org/wiki/File:Mozart_-_Magic_Flute_Overture.ogg',yearNote:'Gravação CC0 da Musopen Symphony Orchestra'},
{id:'kantate',title:'Kleine Freimaurer-Kantate — Mozart',year:'1791',query:'Mozart K623 Kleine Freimaurer Kantate'},
{id:'sibelius',title:'Masonic Ritual Music — Sibelius',year:'1927',query:'Sibelius Masonic Ritual Music op 113'}
];
const $=id=>document.getElementById(id),select=$('oraculo-music-select'),player=$('oraculo-music-audio'),status=$('oraculo-music-status'),description=$('oraculo-music-description'),source=$('oraculo-music-source');if(!select||!player)return;
const searchLink=t=>'https://commons.wikimedia.org/w/index.php?search='+encodeURIComponent(t.query||t.title)+'&title=Special:MediaSearch&type=audio';
const playable=tracks.filter(t=>t.file);
async function choose(id,auto=false){const t=tracks.find(x=>x.id===id)||tracks[0];select.value=t.id;player.pause();player.removeAttribute('src');player.load();description.textContent=t.title+' ('+t.year+'). '+(t.yearNote||'O acervo está listado para consulta histórica. Reprodução depende de gravação com licença verificada.');
source.href=t.source||searchLink(t);source.textContent=t.source?'Gravação e licença — Wikimedia Commons':'Pesquisar gravações e licenças — Wikimedia Commons';
if(!t.file){status.textContent='Não há gravação com licença verificada cadastrada para esta obra. Escolha outra faixa ou consulte a fonte.';return}
player.src='https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(t.file);player.load();status.textContent='Faixa selecionada: '+t.title+'. '+(auto?'Tentando reprodução automática…':'Clique em Reproduzir.');
if(auto)try{await player.play();status.textContent='Reproduzindo: '+t.title}catch{status.textContent='Seu navegador bloqueou a reprodução automática com som. Clique em Reproduzir para ouvir.'}
}
select.addEventListener('change',()=>choose(select.value,true));
$('oraculo-music-play').onclick=async()=>{const t=tracks.find(x=>x.id===select.value);if(!t?.file){status.textContent='Não há arquivo sonoro verificado para esta composição.';return}try{await player.play();status.textContent='Reproduzindo: '+t.title}catch{status.textContent='O áudio não pôde ser reproduzido neste navegador. Consulte a gravação na fonte.'}};
$('oraculo-music-pause').onclick=()=>{player.pause();status.textContent='Reprodução pausada.'};
$('oraculo-music-random').onclick=()=>choose(playable[Math.floor(Math.random()*playable.length)].id,true);
player.addEventListener('ended',()=>choose(playable[Math.floor(Math.random()*playable.length)].id,true));
player.addEventListener('error',()=>{status.textContent='Falha ao carregar o áudio externo. Abra a fonte da gravação ou tente novamente.'});
choose(playable[Math.floor(Math.random()*playable.length)].id,true);
})();
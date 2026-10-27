(()=>{'use strict';
const tracks=[{id:"mozartOverture",title:"A Flauta Mágica — Abertura",year:"Mozart, 1791",file:"Mozart - Magic Flute Overture.ogg",source:"https://commons.wikimedia.org/wiki/File:Mozart_-_Magic_Flute_Overture.ogg",credit:"CC0 — Musopen Symphony Orchestra"},
{id:"priests",title:"A Flauta Mágica — Marcha dos Sacerdotes",year:"Mozart, 1791",file:"March of the Priests.ogg",source:"https://commons.wikimedia.org/wiki/File:March_of_the_Priests.ogg",credit:"CC BY 2.5 — Siam Philharmonic Orchestra"},
{id:"magic2",title:"A Flauta Mágica — Abertura (Bangkok Opera)",year:"Mozart, 1791",file:"Magic Flute Overture.ogg",source:"https://commons.wikimedia.org/wiki/File:Magic_Flute_Overture.ogg",credit:"Gravação — Bangkok Opera"},
{id:"sun",title:"A Flauta Mágica — Die Strahlen der Sonne",year:"Mozart, 1791",file:"W. A. Mozart - Die Zauberflöte - 30. Die Strahlen der Sonne vertreiben die Nacht (Ferenc Fricsay, 1953).ogg",source:"https://commons.wikimedia.org/wiki/File:W._A._Mozart_-_Die_Zauberflöte_-_30._Die_Strahlen_der_Sonne_vertreiben_die_Nacht_(Ferenc_Fricsay,_1953).ogg",credit:"Gravação de 1953 — Ferenc Fricsay"},
{id:"portrait",title:"A Flauta Mágica — Dies Bildnis",year:"Mozart, 1791",file:"W. A. Mozart - Die Zauberflöte - 04. Dies Bildnis ist bezaubernd schön (Ferenc Fricsay, 1953).ogg",source:"https://commons.wikimedia.org/wiki/File:W._A._Mozart_-_Die_Zauberflöte_-_04._Dies_Bildnis_ist_bezaubernd_schön_(Ferenc_Fricsay,_1953).ogg",credit:"Gravação de 1953 — Ferenc Fricsay"},
{id:"queen",title:"A Flauta Mágica — Der Hölle Rache",year:"Mozart, 1791",file:"Der Hölle Rache.ogg",source:"https://commons.wikimedia.org/wiki/File:Der_Hölle_Rache.ogg",credit:"Gravação de Rachel Smith"}];
const $=id=>document.getElementById(id);
const select=$('oraculo-music-select'),player=$('oraculo-music-audio'),status=$('oraculo-music-status'),description=$('oraculo-music-description'),source=$('oraculo-music-source');
if(!select||!player)return;
const randomTrack=()=>tracks[Math.floor(Math.random()*tracks.length)];
async function choose(id,auto=false){const t=tracks.find(x=>x.id===id)||tracks[0];select.value=t.id;player.pause();player.src='https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(t.file);player.load();description.textContent=t.title+' ('+t.year+'). '+t.credit;source.href=t.source;source.textContent='Ver arquivo, autoria e licença no Wikimedia Commons';status.textContent='Selecionada: '+t.title;
if(auto)try{await player.play();status.textContent='Reproduzindo: '+t.title}catch{status.textContent='Reprodução automática bloqueada. Clique em Reproduzir.'}
}
select.addEventListener('change',()=>choose(select.value,true));
$('oraculo-music-play').onclick=async()=>{try{await player.play();status.textContent='Reproduzindo: '+tracks.find(t=>t.id===select.value).title}catch{status.textContent='Erro de reprodução. Confira a gravação na fonte.'}};
$('oraculo-music-pause').onclick=()=>{player.pause();status.textContent='Pausado.'};
$('oraculo-music-random').onclick=()=>choose(randomTrack().id,true);
player.addEventListener('ended',()=>choose(randomTrack().id,true));
player.addEventListener('error',()=>{status.textContent='Falha ao carregar a gravação. Consulte a fonte do arquivo.'});
choose(randomTrack().id,true);
})();
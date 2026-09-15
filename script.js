const shows=[
 {key:"demon-slayer",title:"Demon Slayer",search:"Demon Slayer",score:"8.6",genres:["Action","Fantasy","Adventure"],desc:"Tanjiro Kamado sets out on a dangerous journey to find a cure for his sister and confront the forces behind her transformation."},
 {key:"jujutsu-kaisen",title:"Jujutsu Kaisen",search:"Jujutsu Kaisen",score:"8.7",genres:["Action","Supernatural"],desc:"A supernatural action series where sorcerers battle dangerous curses and protect people from the unseen."},
 {key:"one-piece",title:"One Piece",search:"One Piece",score:"9.0",genres:["Action","Adventure","Fantasy"],desc:"Follow Luffy and the Straw Hat crew on a huge adventure filled with friendship, freedom and the search for the legendary treasure."},
 {key:"solo-leveling",title:"Solo Leveling",search:"Solo Leveling",score:"8.8",genres:["Action","Fantasy"],desc:"Sung Jinwoo rises from the weakest hunter into a powerful fighter after gaining a mysterious system."},
 {key:"spy-family",title:"SPY x FAMILY",search:"SPY x FAMILY",score:"8.5",genres:["Comedy","Action"],desc:"A spy, an assassin and a telepath form a fake family while each secretly hides the truth from the others."},
 {key:"aot",title:"Attack on Titan",search:"Attack on Titan",score:"9.0",genres:["Action","Drama","Adventure"],desc:"A dramatic survival story built around mystery, difficult choices and a fight for humanity’s future."},
 {key:"fullmetal",title:"Fullmetal Alchemist: Brotherhood",search:"Fullmetal Alchemist: Brotherhood",score:"9.1",genres:["Action","Adventure","Drama"],desc:"Two brothers pursue the Philosopher’s Stone while uncovering a much larger conspiracy."},
 {key:"hunter",title:"Hunter x Hunter",search:"Hunter x Hunter",score:"9.0",genres:["Action","Adventure"],desc:"Gon begins a journey to become a Hunter and find his father."},
 {key:"death-note",title:"Death Note",search:"Death Note",score:"8.6",genres:["Psychological","Thriller"],desc:"A psychological thriller centered on a supernatural notebook and the consequences of using its mysterious power."},
 {key:"steins-gate",title:"Steins;Gate",search:"Steins;Gate",score:"8.8",genres:["Sci-Fi","Thriller"],desc:"A science-fiction thriller involving experiments, messages and dangerous changes to time."},
 {key:"your-name",title:"Your Name",search:"Your Name",score:"8.8",genres:["Romance","Drama"],desc:"Two strangers find their lives mysteriously connected across distance and time."},
 {key:"spirited-away",title:"Spirited Away",search:"Spirited Away",score:"8.6",genres:["Fantasy","Adventure"],desc:"A young girl enters a mysterious spirit world and must find a way home."},
 {key:"frieren",title:"Frieren: Beyond Journey's End",search:"Frieren: Beyond Journey's End",score:"9.1",genres:["Fantasy","Adventure","Drama"],desc:"A thoughtful fantasy adventure about memories, friendship and understanding people long after the great battle is over."},
 {key:"chainsaw",title:"Chainsaw Man",search:"Chainsaw Man",score:"8.6",genres:["Action","Horror"],desc:"A young devil hunter gets a strange new life after an unexpected transformation."},
 {key:"blue-lock",title:"Blue Lock",search:"Blue Lock",score:"8.4",genres:["Sports","Drama"],desc:"Young football players compete in an intense program designed to create an elite striker."},
 {key:"kaiju",title:"Kaiju No. 8",search:"Kaiju No. 8",score:"8.3",genres:["Action","Sci-Fi"],desc:"A cleanup worker gains a dangerous secret while dreaming of joining the defense force."}
];

const regions={
 ZA:{name:"South Africa",code:"za"},US:{name:"United States",code:"us"},GB:{name:"United Kingdom",code:"uk"},
 CA:{name:"Canada",code:"ca"},AU:{name:"Australia",code:"au"},DE:{name:"Germany",code:"de"},JP:{name:"Japan",code:"jp"}
};
let saved=JSON.parse(localStorage.getItem("otakuSaved")||"[]"), filter="All", heroIndex=0, region=localStorage.getItem("otakuRegion")||"ZA";

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const api="https://graphql.anilist.co";

async function loadAnimeData(){
 const q=`query($ids:[Int]){Page(perPage:20){media(type:ANIME,sort:POPULARITY_DESC){id title{romaji english} coverImage{large extraLarge} bannerImage averageScore genres description trailer{id site thumbnail} }}}`;
 try{
  const r=await fetch(api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:q})});
  const data=await r.json(); const media=data?.data?.Page?.media||[];
  shows.forEach(s=>{
    const m=media.find(x=>((x.title.english||x.title.romaji||"").toLowerCase().includes(s.search.toLowerCase().replace("spY x family","spy x family"))||s.search.toLowerCase().includes((x.title.english||x.title.romaji||"").toLowerCase())));
    if(m){s.image=m.coverImage?.extraLarge||m.coverImage?.large;s.banner=m.bannerImage;s.trailer=m.trailer?.id||null;s.score=m.averageScore?(m.averageScore/10).toFixed(1):s.score;s.anilist=m.id;}
  });
 }catch(e){console.log("Anime artwork service unavailable; using fallbacks.");}
 renderAll();
}

function imgFallback(a){return a.image||"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="100%" height="100%" fill="#12172e"/><text x="50%" y="50%" fill="#b45cff" text-anchor="middle" font-size="22">${esc(a.title)}</text></svg>`)}
function poster(a){return `<article class="poster-card" onclick="openInfo('${a.key}')"><img src="${imgFallback(a)}" alt="${esc(a.title)} poster" loading="lazy"><button class="play-mini" onclick="event.stopPropagation();openInfo('${a.key}')">▶</button><div class="poster-body"><div class="poster-title">${esc(a.title)}</div><div class="poster-meta"><strong>★ ${a.score}</strong> · ${esc(a.genres[0])}</div></div></article>`}
function libraryCard(a){const isSaved=saved.includes(a.key);return `<article class="library-card"><img class="cover" src="${imgFallback(a)}" alt="${esc(a.title)} poster"><div><h3>${esc(a.title)}</h3><div class="tile-meta"><span class="tile-score">★ ${a.score}</span> · ${a.genres.join(" · ")}</div><p>${esc(a.desc)}</p><div class="tags">${a.genres.slice(0,3).map(g=>`<span class="tag">${esc(g)}</span>`).join("")}</div><div class="card-actions"><button class="small-btn primary" onclick="openInfo('${a.key}')">▶ Trailer</button><button class="small-btn" onclick="toggleSaved('${a.key}')">${isSaved?"✓ Saved":"＋ List"}</button></div></div></article>`}
function renderRows(){
 document.querySelector("#trendingRow").innerHTML=shows.slice(0,8).map(poster).join("");
 document.querySelector("#topRow").innerHTML=[...shows].sort((a,b)=>+b.score-+a.score).slice(0,8).map(poster).join("");
 document.querySelector("#recentRow").innerHTML=[...shows].slice(-8).reverse().map(poster).join("");
}
function renderLibrary(){
 const q=(document.querySelector("#search")?.value||"").toLowerCase();
 const arr=shows.filter(a=>(filter==="All"||a.genres.includes(filter))&&(a.title+" "+a.genres.join(" ")).toLowerCase().includes(q));
 document.querySelector("#libraryGrid").innerHTML=arr.length?arr.map(libraryCard).join(""):`<div class="empty" style="grid-column:1/-1">⌕<h3>No anime found</h3><p>Try another title or genre.</p></div>`;
 const s=shows.filter(a=>saved.includes(a.key));
 document.querySelector("#savedGrid").innerHTML=s.map(libraryCard).join("");
 document.querySelector("#emptyList").style.display=s.length?"none":"block";
}
function renderAll(){renderHero();renderRows();renderLibrary()}

function renderHero(){
 const a=shows[heroIndex];
 document.querySelector("#heroTitle").textContent=a.title;
 document.querySelector("#heroScore").textContent=a.score;
 document.querySelector("#heroDesc").textContent=a.desc;
 ["heroGenre1","heroGenre2","heroGenre3"].forEach((id,i)=>document.querySelector("#"+id).textContent=a.genres[i]||"");
 document.querySelector("#heroBg").style.backgroundImage=`url("${imgFallback(a)}")`;
 document.querySelector("#heroPicks").innerHTML=shows.slice(0,4).map((x,i)=>`<div class="hero-pick ${i===heroIndex?"active":""}" onclick="setHero(${i})"><img src="${imgFallback(x)}"><span>${esc(x.title)}</span></div>`).join("");
 document.querySelector("#heroDots").innerHTML=shows.slice(0,4).map((_,i)=>`<span class="hero-dot ${i===heroIndex?"active":""}"></span>`).join("");
}
function setHero(i){heroIndex=i%4;renderHero()}
function toggleSaved(key){saved=saved.includes(key)?saved.filter(x=>x!==key):[...saved,key];localStorage.setItem("otakuSaved",JSON.stringify(saved));renderLibrary()}

function trailerUrl(a){
 if(a.trailer) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(a.trailer)}?autoplay=1&rel=0`;
 return `https://www.youtube.com/results?search_query=${encodeURIComponent(a.title+" official trailer")}`;
}
function justWatch(a){return `https://www.justwatch.com/${regions[region].code}/search?q=${encodeURIComponent(a.title)}`}
function openInfo(key){
 const a=shows.find(x=>x.key===key); if(!a)return;
 const embed=a.trailer?`<div class="modal-video"><iframe src="${trailerUrl(a)}" title="${esc(a.title)} official trailer" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`:`<div class="modal-content"><p>Opening the official trailer search because an embeddable trailer was not returned for this title.</p><a class="btn primary" target="_blank" rel="noopener" href="${trailerUrl(a)}">Find Official Trailer</a></div>`;
 document.querySelector("#modalBody").innerHTML=`${embed}<div class="modal-content"><h2>${esc(a.title)}</h2><div class="tile-meta"><span class="tile-score">★ ${a.score}</span> · ${a.genres.join(" · ")}</div><p>${esc(a.desc)}</p><div class="region-row"><label>Region:</label><select id="regionSelect">${Object.entries(regions).map(([k,v])=>`<option value="${k}" ${k===region?"selected":""}>${v.name}</option>`).join("")}</select></div><div class="watch-options"><a target="_blank" rel="noopener" href="${justWatch(a)}">📺 Where to Watch in ${regions[region].name}</a><a target="_blank" rel="noopener" href="https://www.crunchyroll.com/search?q=${encodeURIComponent(a.title)}">Crunchyroll search</a><a target="_blank" rel="noopener" href="https://www.netflix.com/search?q=${encodeURIComponent(a.title)}">Netflix search</a></div></div>`;
 document.querySelector("#modal").classList.add("open");document.querySelector("#modal").setAttribute("aria-hidden","false");
 document.querySelector("#regionSelect").addEventListener("change",e=>{region=e.target.value;localStorage.setItem("otakuRegion",region);openInfo(key)});
}
function closeModal(){document.querySelector("#modal").classList.remove("open");document.querySelector("#modal").setAttribute("aria-hidden","true");document.querySelector("#modalBody").innerHTML=""}

document.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",closeModal));
document.querySelector("#prevHero").onclick=()=>setHero((heroIndex+3)%4);
document.querySelector("#nextHero").onclick=()=>setHero((heroIndex+1)%4);
document.querySelector("#heroTrailer").onclick=()=>openInfo(shows[heroIndex].key);
document.querySelector("#heroWatch").onclick=()=>openInfo(shows[heroIndex].key);
document.querySelector("#heroList").onclick=()=>toggleSaved(shows[heroIndex].key);
document.querySelector("#search").addEventListener("input",renderLibrary);
document.querySelector("#topSearch").addEventListener("input",e=>{document.querySelector("#search").value=e.target.value;document.querySelector("#browse").scrollIntoView({behavior:"smooth"});renderLibrary()});
document.querySelectorAll(".genre").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".genre").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;renderLibrary();document.querySelector("#browse").scrollIntoView({behavior:"smooth"})}));
document.querySelector("#newsletter").addEventListener("submit",e=>{e.preventDefault();alert("Thanks! Newsletter signup is ready for your email service.");e.target.reset()});

renderAll();loadAnimeData();

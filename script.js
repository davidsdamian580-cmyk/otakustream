const data=[
{id:1,t:"Demon Slayer",g:["Action","Fantasy"],e:"⚔️",d:"Discover characters, reviews and official previews."},
{id:2,t:"One Piece",g:["Adventure","Fantasy"],e:"🏴‍☠️",d:"Explore a legendary pirate adventure."},
{id:3,t:"Solo Leveling",g:["Action","Fantasy"],e:"⚡",d:"A modern action-fantasy favourite."},
{id:4,t:"Jujutsu Kaisen",g:["Action"],e:"👊",d:"Explore supernatural battles and characters."},
{id:5,t:"Spy x Family",g:["Comedy","Action"],e:"🕵️",d:"A family comedy mixed with action."},
{id:6,t:"Frieren",g:["Fantasy","Adventure"],e:"✨",d:"A thoughtful fantasy journey."},
{id:7,t:"My Hero Academia",g:["Action"],e:"🦸",d:"Heroes, rivalries and superpowered adventures."},
{id:8,t:"Attack on Titan",g:["Action","Adventure"],e:"🛡️",d:"Discover the story through reviews and previews."}
];
let saved=JSON.parse(localStorage.getItem("savedAnime")||"[]"), filter="All";
const grid=document.querySelector("#grid"), savedEl=document.querySelector("#saved"), none=document.querySelector("#none");
function card(a){let s=saved.includes(a.id);return `<article class="card"><div class="poster">${a.e}</div><div class="body"><h3>${a.t}</h3><div class="meta">${a.g.join(" • ")}</div><p>${a.d}</p><div class="actions"><button class="mini primary" onclick="openInfo(${a.id})">▶ Preview</button><button class="mini" onclick="toggle(${a.id})">${s?"✓ Saved":"＋ List"}</button></div></div></article>`}
function render(){let q=document.querySelector("#search").value.toLowerCase();let x=data.filter(a=>(filter==="All"||a.g.includes(filter))&&(a.t+" "+a.g.join(" ")).toLowerCase().includes(q));grid.innerHTML=x.map(card).join("")||"<p>No anime found.</p>";let y=data.filter(a=>saved.includes(a.id));savedEl.innerHTML=y.map(card).join("");none.style.display=y.length?"none":"block"}
function toggle(id){saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem("savedAnime",JSON.stringify(saved));render()}
function openInfo(id){let a=data.find(x=>x.id===id);document.querySelector("#modalContent").innerHTML=`<small>ANIME PREVIEW</small><h2>${a.t}</h2><p>${a.d}</p><p><b>Genres:</b> ${a.g.join(", ")}</p><p>This button is ready for an official trailer embed/link. To stay legal, connect it to the anime publisher's official trailer or a licensed streaming provider rather than uploading episodes yourself.</p><a class="watch" href="https://www.youtube.com/results?search_query=${encodeURIComponent(a.t+" official trailer")}" target="_blank" rel="noopener">Find Official Trailer</a>`;document.querySelector("#modal").classList.add("show")}
document.querySelector("#close").onclick=()=>document.querySelector("#modal").classList.remove("show");
document.querySelector("#modal").onclick=e=>{if(e.target.id==="modal")e.currentTarget.classList.remove("show")};
document.querySelector("#search").oninput=render;
document.querySelectorAll(".filters button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;render()});
document.querySelector("#menu").onclick=()=>{document.querySelector("#nav").style.display=document.querySelector("#nav").style.display==="flex"?"none":"flex"};
render();

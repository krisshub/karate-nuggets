const CATEGORIES = ["All Nuggets", "Masters", "Quick Reference", "Insights", "Back to Basics", "World Champion Competitors", "Exam Syllabus", "Specials"];
const state = { nuggets: [], category: "All Nuggets", tag: "", query: "", sort: "featured", featuredIndex: 0, modalIndex: -1 };
const $ = (id) => document.getElementById(id);
const escapeHtml = (value="") => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const assetUrl = path => new URL("../" + path.replace(/^\/+/, ""), document.currentScript.src).href;

async function loadNuggets() {
  try {
    const response = await fetch("data/nuggets.json");
    if (!response.ok) throw new Error("Could not load nuggets.json");
    state.nuggets = await response.json();
  } catch (error) {
    console.error(error);
    state.nuggets = [];
  }
  render();
}
function filteredNuggets() {
  let items = [...state.nuggets];
  if (state.category !== "All Nuggets") items = items.filter(n => n.category === state.category);
  if (state.tag) items = items.filter(n => (n.tags || []).includes(state.tag));
  if (state.query) {
    const q = state.query.toLowerCase();
    items = items.filter(n => [n.title,n.subtitle,n.description,n.category,...(n.tags||[])].join(" ").toLowerCase().includes(q));
  }
  if (state.sort === "newest") items.sort((a,b)=>(b.dateAdded||"").localeCompare(a.dateAdded||""));
  else if (state.sort === "oldest") items.sort((a,b)=>(a.dateAdded||"").localeCompare(b.dateAdded||""));
  else if (state.sort === "az") items.sort((a,b)=>a.title.localeCompare(b.title));
  else items.sort((a,b)=>Number(!!b.featured)-Number(!!a.featured));
  return items;
}
function posterMarkup(n, index, featured=false) {
  const img = n.thumbnail ? `<img class="poster-thumb" src="${escapeHtml(n.thumbnail)}" alt="${escapeHtml(n.title)} poster" loading="lazy" onerror="this.outerHTML='<div class=&quot;poster-placeholder&quot;>空手</div>'">` : `<div class="poster-placeholder">空手</div>`;
  return `<article class="${featured ? "featured-card" : "poster-card"}" data-open-index="${state.nuggets.indexOf(n)}" tabindex="0" role="button" aria-label="View ${escapeHtml(n.title)}">
    ${img}<div class="card-body"><span class="card-category">${escapeHtml(n.category)}</span><h4>${escapeHtml(n.title)}</h4><p>${escapeHtml(n.subtitle || n.description || "")}</p>
    ${featured ? "" : `<div class="card-tags">${(n.tags||[]).slice(0,4).map(t=>`<span>${escapeHtml(t)}</span>`).join("")}</div>`}
    <div class="card-actions"><a href="${escapeHtml(n.download || n.thumbnail || "#")}" download onclick="event.stopPropagation()">↓ Download</a><button class="view-button" type="button" data-view-index="${state.nuggets.indexOf(n)}" onclick="event.stopPropagation()">◉ View</button></div></div></article>`;
}
function render() {
  const items = filteredNuggets();
  $("collectionCount").textContent = `${state.nuggets.length} Nuggets in the collection`;
  $("categoryTabs").querySelectorAll("button").forEach(b => b.classList.toggle("selected", b.dataset.category === state.category));
  $("resultsTitle").textContent = state.category;
  $("resultsMeta").textContent = `${items.length} shown`;
  const featured = state.nuggets.filter(n=>n.featured);
  $("featuredWrap").hidden = !featured.length;
  $("featuredTrack").innerHTML = featured.map(n=>posterMarkup(n,state.nuggets.indexOf(n),true)).join("");
  $("posterGrid").innerHTML = items.map(n=>posterMarkup(n,state.nuggets.indexOf(n))).join("");
  $("emptyState").hidden = !!items.length;
  const tags = [...new Set(state.nuggets.filter(n=>state.category==="All Nuggets"||n.category===state.category).flatMap(n=>n.tags||[]))].sort();
  $("tagFilters").innerHTML = tags.map(t=>`<button class="tag-chip ${state.tag===t?"selected":""}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join("");
  $("tagFilters").hidden = !tags.length;
  $("featuredTrack").querySelectorAll("[data-open-index]").forEach(card=>card.addEventListener("click",()=>openModal(Number(card.dataset.openIndex))));
  $("posterGrid").querySelectorAll("[data-open-index]").forEach(card=>card.addEventListener("click",()=>openModal(Number(card.dataset.openIndex))));
  document.querySelectorAll("[data-view-index]").forEach(btn=>btn.addEventListener("click",()=>openModal(Number(btn.dataset.viewIndex))));
}
function openModal(index) {
  if (index < 0 || index >= state.nuggets.length) return;
  state.modalIndex = index;
  const n=state.nuggets[index];
  $("modalImage").src=n.thumbnail || "";
  $("modalImage").alt=n.title+" poster";
  $("modalCategory").textContent=n.category;
  $("modalTitle").textContent=n.title;
  $("modalDescription").textContent=n.description || n.subtitle || "";
  $("modalTags").innerHTML=(n.tags||[]).map(t=>`<span>${escapeHtml(t)}</span>`).join("");
  $("modalDownload").href=n.download || n.thumbnail || "#";
  $("modalDownload").download=(n.title||"karate-nugget").toLowerCase().replace(/[^a-z0-9]+/g,"-")+".png";
  $("posterModal").classList.add("open");
  $("posterModal").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function closeModal(){ $("posterModal").classList.remove("open"); $("posterModal").setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
function moveModal(step){ if(!state.nuggets.length)return; openModal((state.modalIndex+step+state.nuggets.length)%state.nuggets.length); }

$("categoryTabs").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;state.category=b.dataset.category;state.tag="";render();});
$("tagFilters").addEventListener("click",e=>{const b=e.target.closest("[data-tag]");if(!b)return;state.tag=state.tag===b.dataset.tag?"":b.dataset.tag;render();});
$("searchInput").addEventListener("input",e=>{state.query=e.target.value.trim();render();});
$("sortSelect").addEventListener("change",e=>{state.sort=e.target.value;render();});
$("clearFilters").addEventListener("click",()=>{state.category="All Nuggets";state.tag="";state.query="";$("searchInput").value="";render();});
$("carouselPrev").addEventListener("click",()=>$("featuredTrack").scrollBy({left:-300,behavior:"smooth"}));
$("carouselNext").addEventListener("click",()=>$("featuredTrack").scrollBy({left:300,behavior:"smooth"}));
$("modalClose").addEventListener("click",closeModal);
document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeModal));
$("modalPrev").addEventListener("click",()=>moveModal(-1));
$("modalNext").addEventListener("click",()=>moveModal(1));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();if(e.key==="ArrowLeft"&&$("posterModal").classList.contains("open"))moveModal(-1);if(e.key==="ArrowRight"&&$("posterModal").classList.contains("open"))moveModal(1);});
document.querySelectorAll("[data-nav-category]").forEach(a=>a.addEventListener("click",()=>{state.category=a.dataset.navCategory;state.tag="";render();}));
$("menuToggle").addEventListener("click",()=>{const nav=document.querySelector(".main-nav");const open=nav.classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",String(open));});
loadNuggets();

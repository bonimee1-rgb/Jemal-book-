const starterBooks = [
 {id:"quran",title:"القرآن الكريم",author:"كلام الله تعالى",category:"ቁርአን",language:"Arabic",description:"የቁርአን ዋና ጽሑፍ። ትርጉም እና ተፍሲር በተረጋገጡ ምንጮች ሲገኙ ይጨመራሉ።",content:"ይህ የአፑ የመዋቅር ማሳያ ነው። ሙሉ የቁርአን ጽሑፍ ከተረጋገጠ ምንጭ መጫን አለበት።"},
 {id:"bukhari",title:"صحيح البخاري",author:"الإمام محمد بن إسماعيل البخاري",category:"ሐዲስ",language:"Arabic",description:"ከታወቁ የሐዲስ ስብስቦች አንዱ።",content:"የሙሉ ሐዲስ ጽሑፍ እና ቁጥሮች ከተረጋገጠ እትም መጨመር አለባቸው።"},
 {id:"muslim",title:"صحيح مسلم",author:"الإمام مسلم بن الحجاج",category:"ሐዲስ",language:"Arabic",description:"የሐዲስ ስብስብ።",content:"ይህ የመጽሐፉ መግቢያ ቦታ ነው። ሙሉ ጽሑፉ በተረጋገጠ ምንጭ ይጨመራል።"},
 {id:"tafsir",title:"تفسير ابن كثير",author:"ابن كثير",category:"ተፍሲር",language:"Arabic",description:"የቁርአን ተፍሲር መጽሐፍ።",content:"ሙሉ ተፍሲር ጽሑፍ ከተፈቀደ እና ከተረጋገጠ ምንጭ ይጨመራል።"},
 {id:"riyad",title:"رياض الصالحين",author:"الإمام النووي",category:"ሐዲስ",language:"Arabic",description:"ስለ ሥነ-ምግባርና መልካም ሥራ የሐዲስ ስብስብ።",content:"ሙሉ ጽሑፍ፣ ትርጉምና ማብራሪያ በተረጋገጠ እትም ይሞላሉ።"},
 {id:"aqidah",title:"العقيدة الواسطية",author:"ابن تيمية",category:"ዐቂዳ",language:"Arabic",description:"በዐቂዳ ዘርፍ የታወቀ ጽሑፍ።",content:"የተሟላ ጽሑፍና የምሁራን ማብራሪያ ከምንጭ ተረጋግጦ ይጨመራል።"}
];
const categories=["ሁሉም","ቁርአን","ተፍሲር","ሐዲስ","ፊቅህ","ዐቂዳ","ሲራ","የዓረብኛ ቋንቋ","ሌሎች"];
let books = [...starterBooks], selectedCategory="ሁሉም", activeBook=null, deferredInstall=null;
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function loadLocal(){try{const x=JSON.parse(localStorage.getItem("jemalBooks")||"[]");books=[...starterBooks,...x.filter(b=>!starterBooks.some(s=>s.id===b.id))]}catch{}}
function saveLocal(){localStorage.setItem("jemalBooks",JSON.stringify(books.filter(b=>!starterBooks.some(s=>s.id===b.id))))}
function savedIds(){try{return JSON.parse(localStorage.getItem("jemalSaved")||"[]")}catch{return []}}
function setSaved(ids){localStorage.setItem("jemalSaved",JSON.stringify(ids))}
function renderCategories(){ $("categories").innerHTML=categories.map(c=>`<button class="${c===selectedCategory?'active':''}" data-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("");}
function card(b){return `<article class="book-card" data-book="${escapeHTML(b.id)}"><div class="book-icon">۞</div><h3>${escapeHTML(b.title)}</h3><p>${escapeHTML(b.author)}<br>${escapeHTML(b.description)}</p><div class="book-bottom"><span class="tag">${escapeHTML(b.category)}</span><small>${escapeHTML(b.language)}</small></div></article>`}
function renderBooks(){const q=$("searchInput").value.trim().toLowerCase();const list=books.filter(b=>(selectedCategory==="ሁሉም"||b.category===selectedCategory)&&[b.title,b.author,b.category,b.description].join(" ").toLowerCase().includes(q));$("bookGrid").innerHTML=list.map(card).join("");$("bookCount").textContent=`${list.length} መጻሕፍት`; $("emptyState").classList.toggle("hidden",list.length>0)}
function renderSaved(){const ids=savedIds();const list=books.filter(b=>ids.includes(b.id));$("savedGrid").innerHTML=list.map(card).join("");$("savedEmpty").classList.toggle("hidden",list.length>0)}
function renderHadith(){$("hadithList").innerHTML=books.filter(b=>b.category==="ሐዲስ").map(b=>`<article class="hadith-card"><h3>${escapeHTML(b.title)}</h3><p>${escapeHTML(b.description)}</p><button class="outline open-hadith" data-book="${escapeHTML(b.id)}">መጽሐፉን ክፈት</button></article>`).join("")||'<div class="empty">የሐዲስ መጻሕፍት አልተገኙም።</div>'}
function openBook(id){const b=books.find(x=>x.id===id);if(!b)return;activeBook=b;$("readerTitle").textContent=b.title;$("readerMeta").textContent=`${b.author} · ${b.category} · ${b.language}`;
$("readerBody").innerHTML=`<h2>${escapeHTML(b.title)}</h2><p><b>ደራሲ፦</b> ${escapeHTML(b.author)}</p><p><b>ምድብ፦</b> ${escapeHTML(b.category)}</p><p>${escapeHTML(b.description)}</p>${b.pdfUrl?`<p><a href="${b.pdfUrl}" target="_blank" rel="noopener">PDF ክፈት / አውርድ</a></p>`:""}<div class="arabic" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div><p>${escapeHTML(b.content||"የመጽሐፉ ይዘት እዚህ ይታያል።")}</p><p class="notice">ይህ የመጽሐፍ ካታሎግ እና ንባብ መዋቅር ነው። ሙሉ የመጽሐፍ ጽሑፎች እና ትርጉሞች ከተረጋገጡ እና ለማሰራጨት ፈቃድ ካላቸው ምንጮች በኋላ ይጨመራሉ።</p>`;
const ids=savedIds();$("saveReader").textContent=ids.includes(id)?"★ ተቀምጧል":"☆ አስቀምጥ";$("reader").classList.remove("hidden")}
function closeReader(){$("reader").classList.add("hidden")}
document.addEventListener("click",e=>{
 const tab=e.target.closest("[data-view]");if(tab){document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===tab));document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));$(tab.dataset.view+"View").classList.remove("hidden");}
 const cat=e.target.closest("[data-category]");if(cat){selectedCategory=cat.dataset.category;renderCategories();renderBooks()}
 const book=e.target.closest("[data-book]");if(book)openBook(book.dataset.book);
});
$("searchInput").addEventListener("input",renderBooks);$("clearSearch").onclick=()=>{$("searchInput").value="";renderBooks()};
$("closeReader").onclick=closeReader;
$("saveReader").onclick=()=>{if(!activeBook)return;let ids=savedIds();ids=ids.includes(activeBook.id)?ids.filter(x=>x!==activeBook.id):[...ids,activeBook.id];setSaved(ids);$("saveReader").textContent=ids.includes(activeBook.id)?"★ ተቀምጧል":"☆ አስቀምጥ";renderSaved()};
$("addBookBtn").onclick=async()=>{
 const title=$("newTitle").value.trim();if(!title){alert("የመጽሐፉን ርዕስ ያስገቡ።");return}
 const f=$("pdfFile").files[0];let pdfUrl="";
 if(f){if(f.size>15*1024*1024){alert("በዚህ የሙከራ ስሪት ከ15MB በላይ PDF አይደገፍም። ለትልቅ ፋይሎች cloud storage ያስፈልጋል።");return}pdfUrl=URL.createObjectURL(f)}
 const b={id:"local-"+Date.now(),title,author:$("newAuthor").value.trim()||"ያልታወቀ ደራሲ",category:$("newCategory").value,language:$("newLanguage").value,description:$("newDescription").value.trim()||"የተጨመረ መጽሐፍ",content:"PDF ፋይሉ በዚህ መሣሪያ ላይ ተከፍቶ ሊነበብ ይችላል።",pdfUrl};
 books.push(b);saveLocal();renderBooks();renderHadith();alert("መጽሐፉ በዚህ መሣሪያ ላይ ተጨምሯል።");
 ["newTitle","newAuthor","newDescription","pdfFile"].forEach(id=>$(id).value="");
};
document.addEventListener("click",e=>{if(e.target.matches(".open-hadith"))openBook(e.target.dataset.book)});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("installBtn").classList.remove("hidden")});
$("installBtn").onclick=async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("installBtn").classList.add("hidden")};
loadLocal();renderCategories();renderBooks();renderSaved();renderHadith();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));

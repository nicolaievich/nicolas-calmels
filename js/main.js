const routes={
  "/":{file:"site.json",type:"home"},
  "/perfil/":{file:"profile.json",type:"profile"},
  "/experiencia/":{file:"experience.json",type:"experience"},
  "/proyectos/":{file:"projects.json",type:"projects"},
  "/formacion/":{file:"education.json",type:"education"},
  "/contacto/":{file:"site.json",type:"contact"}
};
const path=location.pathname.endsWith("/")?location.pathname:location.pathname+"/";
const route=routes[path]||routes["/"];

function esc(value=""){
  return String(value).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
}
function text(value=""){return esc(value).replace(/\n/g,"<br>");}
function link(url,label){return url?'<a class="button" href="'+esc(url)+'">'+esc(label)+'</a>':"";}
async function get(file){return (await fetch("/content/"+file)).json();}
function header(data){
  document.title=(data.title||"Nicolás Calmels")+" — Nicolás Calmels";
  const f=document.querySelector("#site-favicon");
  if(data.images?.favicon)f.href=data.images.favicon;
}
function cards(items=[]){
  return '<div class="grid">'+items.map(x=>'<article class="card"><div class="card-kicker">'+esc(x.kicker||"")+'</div><h3>'+esc(x.title||"")+'</h3><p>'+text(x.description||"")+'</p>'+link(x.url,x.linkLabel||"Profundizar →")+'</article>').join("")+'</div>';
}

function projectCard(x){
 const href="/proyectos/?proyecto="+encodeURIComponent(x.slug||"");
 const image=x.images?.desktop||x.images?.mobile;
 return '<article class="card project-card">'+
 (image?'<a class="project-image" href="'+href+'"><img src="'+esc(image)+'" alt="'+esc(x.title||"")+'" loading="lazy"></a>':'')+
 '<div class="card-kicker">'+esc(x.type||"Proyecto")+'</div>'+
 '<h3>'+esc(x.title||"")+'</h3>'+
 (x.domain?'<div class="project-domain">'+esc(x.domain)+'</div>':'')+
 '<p>'+text(x.description||"")+'</p>'+
 '<a class="button" href="'+href+'">Ver proyecto →</a></article>';
}
function projectDetail(data,slug){
 const x=(data.items||[]).find(p=>p.slug===slug); if(!x)return null;
 document.title=(x.title||"Proyecto")+" — Nicolás Calmels";
 const desktop=x.images?.desktop, mobile=x.images?.mobile;
 const images=(desktop||mobile)?'<div class="project-images">'+
 (desktop?'<figure class="project-screen"><img src="'+esc(desktop)+'" alt="'+esc(x.title||"")+' en monitor"></figure>':'')+
 (mobile?'<figure class="project-phone"><img src="'+esc(mobile)+'" alt="'+esc(x.title||"")+' en celular"></figure>':'')+
 '</div>':"";
 const tech=(x.technologies||[]).map(t=>'<span>'+esc(t)+'</span>').join("");
 return '<section class="project-detail"><a class="back-link" href="/proyectos/">← Todos los proyectos</a>'+
 '<div class="eyebrow">'+esc(x.type||"Proyecto")+'</div><h1>'+esc(x.title||"")+'</h1>'+
 (x.domain?'<div class="project-domain project-domain-large">'+esc(x.domain)+'</div>':'')+
 '<p class="project-lead">'+text(x.description||"")+'</p>'+images+
 '<div class="project-meta">'+
 (x.year?'<span>'+esc(x.year)+'</span>':'')+(x.style?'<span>'+esc(x.style)+'</span>':'')+
 '</div><div class="project-detail-grid"><div class="prose">'+text(x.details||x.description||"")+'</div>'+
 '<aside class="project-sidebar">'+(tech?'<div><h2>Tecnologías</h2><div class="tag-list">'+tech+'</div></div>':'')+
 (x.url?'<a class="button" href="'+esc(x.url)+'" target="_blank" rel="noopener">Visitar sitio →</a>':'')+
 (x.repo?'<a class="button button-secondary" href="'+esc(x.repo)+'" target="_blank" rel="noopener">Ver código →</a>':'')+
 '</aside></div></section>';
}
function page(title,intro,body){
  return '<section class="page-intro"><div class="eyebrow">Nicolás Calmels</div><h1>'+esc(title)+'</h1><p>'+text(intro||"")+'</p></section>'+body;
}
async function render(){
 try{
  const d=await get(route.file); header(d);
  let html="";
  if(route.type==="home"){
   html='<section class="hero '+(d.images?.hero?"hero--with-image":"hero--text-only")+'"><div class="hero-content"><div class="eyebrow">'+esc(d.eyebrow||"")+'</div><h1>'+esc(d.name)+'</h1><p>'+text(d.intro)+'</p><a class="button" href="/perfil/">Profundizar →</a></div>'+(d.images?.hero?'<figure class="hero-media"><img src="'+esc(d.images.hero)+'" alt="" loading="eager"></figure>':"")+'</section>';
   html+='<section class="section"><div class="section-heading"><h2>Conocer el recorrido</h2><p>Una mirada breve sobre las experiencias, proyectos y formación que fueron construyendo mi forma de trabajar.</p></div>'+cards(d.homeCards)+'</section>';
   html+='<section class="section"><div class="split-callout"><div><h2>Una tecnología que sirva.</h2><p>'+text(d.currentText)+'</p></div><a class="button" href="/contacto/">Conversar →</a></div></section>';
  }else if(route.type==="profile"){
   html=page(d.title,d.intro,'<section class="section narrow"><div class="prose">'+text(d.story)+'</div></section><section class="section"><div class="section-heading"><h2>Cómo trabajo</h2></div>'+cards(d.principles)+'</section>');
  }else if(route.type==="experience"){
   html=page(d.title,d.intro,'<section class="section"><div class="timeline">'+d.items.map(x=>'<article class="timeline-item"><div class="timeline-date">'+esc(x.period)+'</div><div><h2>'+esc(x.title)+'</h2><p>'+text(x.description)+'</p></div></article>').join("")+'</div></section>');
  }else if(route.type==="projects"){
   html=page(d.title,d.intro,'<section class="section">'+cards(d.items)+'</section>');
  }else if(route.type==="education"){
   html=page(d.title,d.intro,'<section class="section"><div class="education-list">'+d.items.map(x=>'<article class="education-item"><div class="timeline-date">'+esc(x.period)+'</div><div><h2>'+esc(x.title)+'</h2><p>'+text(x.description)+'</p></div></article>').join("")+'</div></section>');
  }else if(route.type==="contact"){
   html=page("Contacto",d.contactText,'<section class="section narrow"><div class="contact"><p>Si tenés un proyecto, una idea o un problema que quieras conversar, escribime.</p><a class="contact-email" href="mailto:'+esc(d.email)+'">'+esc(d.email)+'</a></div></section>');
  }
  document.querySelector("#app").innerHTML=html;
 }catch(e){console.error(e);document.querySelector("#app").innerHTML='<section class="section"><p>No se pudo cargar el contenido.</p></section>';}
}
render();
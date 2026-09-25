async function load(){
  try{
    const r=await fetch("/content/site.json");
    const d=await r.json();

    document.title=d.title||"Nicolás Calmels";

    // Las imágenes son opcionales. Si no existen, el HTML no crea
    // espacios vacíos: cada componente conserva su versión textual.
    const images=d.images||{};
    const favicon=document.querySelector("#site-favicon");

    if(images.favicon){
      favicon.href=images.favicon;
    }else{
      favicon.removeAttribute("href");
    }

    const heroImage=images.hero
      ? `<figure class="hero-media"><img src="${images.hero}" alt="" loading="eager"></figure>`
      : "";

    const profileImage=images.profile
      ? `<figure class="profile-media"><img src="${images.profile}" alt="Nicolás Calmels" loading="lazy"></figure>`
      : "";

    document.querySelector("#app").innerHTML=`
      <section class="hero ${images.hero?"hero--with-image":"hero--text-only"}" id="perfil">
        <div class="hero-content">
          <div class="eyebrow">${d.eyebrow||""}</div>
          <h1>${d.name||"Nicolás Calmels"}</h1>
          <p>${d.intro||""}</p>
        </div>
        ${heroImage}
      </section>

      <section class="section" id="servicios">
        <h2>Servicios</h2>
        <div class="grid">
          ${(d.services||[]).map(s=>`<article class="card"><h3>${s.title}</h3><p>${s.description}</p></article>`).join("")}
        </div>
      </section>

      <section class="section profile-section">
        <div class="profile-layout ${images.profile?"profile-layout--with-image":""}">
          ${profileImage}
          <div class="profile-copy">
            <h2>Perfil</h2>
            <p>${d.profileText||""}</p>
          </div>
        </div>
      </section>

      <section class="section" id="contacto">
        <div class="contact">
          <h2>Contacto</h2>
          <p>${d.contactText||""}</p>
          <a href="mailto:${d.email||""}">${d.email||""}</a>
        </div>
      </section>`;
  }catch(e){
    document.querySelector("#app").innerHTML="<p>No se pudo cargar el contenido.</p>";
    console.error(e);
  }
}
load();
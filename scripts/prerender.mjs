import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const BASE = "https://nicolascalmels.com";

const readJson = async (file) =>
  JSON.parse(await readFile(join(ROOT, "content", file), "utf8"));

const esc = (value = "") =>
  String(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  })[char]);

const text = (value = "") => esc(value).replace(/\r?\n/g, "<br>");
const link = (url, label) =>
  url ? '<a class="button" href="' + esc(url) + '">' + esc(label) + "</a>" : "";

function cards(items = []) {
  return '<div class="grid">' + items.map((item) =>
    '<article class="card"><div class="card-kicker">' + esc(item.kicker || "") +
    "</div><h3>" + esc(item.title || "") + "</h3><p>" +
    text(item.description || "") + "</p>" +
    link(item.url, item.linkLabel || "Profundizar →") + "</article>"
  ).join("") + "</div>";
}

function projectCard(item) {
  const href = "/proyectos/" + encodeURIComponent(item.slug || "") + "/";
  const image = item.images?.desktop || item.images?.mobile;
  return '<article class="card project-card">' +
    (image ? '<a class="project-image" href="' + href + '"><img src="' +
      esc(image) + '" alt="' + esc(item.title || "") + '" loading="lazy"></a>' : "") +
    '<div class="card-kicker">' + esc(item.type || "Proyecto") + "</div>" +
    "<h3>" + esc(item.title || "") + "</h3>" +
    (item.domain ? '<div class="project-domain">' + esc(item.domain) + "</div>" : "") +
    "<p>" + text(item.description || "") + '</p><a class="button" href="' +
    href + '">Profundizar →</a></article>';
}

function projectDetail(data, slug) {
  const item = (data.items || []).find((project) => project.slug === slug);
  if (!item) return null;

  const desktop = item.images?.desktop;
  const mobile = item.images?.mobile;
  const images = (desktop || mobile)
    ? '<div class="project-images">' +
      (desktop ? '<figure class="project-screen"><img src="' + esc(desktop) +
        '" alt="' + esc(item.title || "") + ' en monitor"></figure>' : "") +
      (mobile ? '<figure class="project-phone"><img src="' + esc(mobile) +
        '" alt="' + esc(item.title || "") + ' en celular"></figure>' : "") +
      "</div>"
    : "";
  const tech = (item.technologies || []).map((technology) =>
    "<span>" + esc(technology) + "</span>"
  ).join("");
  const sections = (item.sections || []).map((section) =>
    '<section class="detail-section"><h2>' + esc(section.title || "") + "</h2>" +
    (section.paragraphs || []).map((paragraph) => "<p>" + text(paragraph) + "</p>").join("") +
    (section.items ? "<ul>" + section.items.map((entry) =>
      "<li>" + text(entry) + "</li>"
    ).join("") + "</ul>" : "") + "</section>"
  ).join("");
  const body = sections || "<p>" + text(item.details || item.description || "") + "</p>";

  return '<section class="project-detail"><a class="back-link" href="/proyectos/">← Todos los proyectos</a>' +
    '<div class="eyebrow">' + esc(item.type || "Proyecto") + "</div>" +
    "<h1>" + esc(item.title || "") + "</h1>" +
    (item.domain ? '<div class="project-domain project-domain-large">' + esc(item.domain) + "</div>" : "") +
    '<p class="project-lead">' + text(item.description || "") + "</p>" + images +
    '<div class="project-meta">' + (item.year ? "<span>" + esc(item.year) + "</span>" : "") +
    (item.style ? "<span>" + esc(item.style) + "</span>" : "") +
    '</div><div class="project-detail-grid"><div class="prose project-history">' + body +
    '</div><aside class="project-sidebar">' +
    (tech ? '<div><h2>Stack tecnológico</h2><div class="tag-list">' + tech + "</div></div>" : "") +
    (item.url ? '<a class="button" href="' + esc(item.url) +
      '" target="_blank" rel="noopener noreferrer">Visitar proyecto →</a>' : "") +
    (item.repo ? '<a class="button button-secondary" href="' + esc(item.repo) +
      '" target="_blank" rel="noopener noreferrer">Ver repositorio →</a>' : "") +
    "</aside></div></section>";
}

function page(title, intro, body) {
  return '<section class="page-intro"><div class="eyebrow">Nicolás Calmels</div><h1>' +
    esc(title) + "</h1><p>" + text(intro || "") + "</p></section>" + body;
}

function render(path, data, projects) {
  if (path === "/") {
    return '<section class="hero ' + (data.images?.hero ? "hero--with-image" : "hero--text-only") +
      '"><div class="hero-content"><div class="eyebrow">' + esc(data.eyebrow || "") +
      "</div><h1>" + esc(data.name || "Nicolás Calmels") + "</h1><p>" +
      text(data.intro || "") + '</p><a class="button" href="/perfil/">Profundizar →</a></div>' +
      (data.images?.hero ? '<figure class="hero-media"><img src="' + esc(data.images.hero) +
        '" alt="" loading="eager"></figure>' : "") + "</section>" +
      '<section class="section"><div class="section-heading"><h2>Conocer el recorrido</h2>' +
      "<p>Una mirada breve sobre las experiencias, proyectos y formación que fueron construyendo mi forma de trabajar.</p>" +
      "</div>" + cards(data.homeCards) + "</section>" +
      '<section class="section"><div class="split-callout"><div><h2>Una tecnología que sirva.</h2><p>' +
      text(data.currentText || "") + '</p></div><a class="button" href="/contacto/">Conversar →</a></div></section>';
  }
  if (path === "/perfil/") {
    return page(data.title, data.intro,
      '<section class="section narrow"><div class="prose">' + text(data.story) +
      '</div></section><section class="section"><div class="section-heading"><h2>Cómo trabajo</h2></div>' +
      cards(data.principles) + "</section>");
  }
  if (path === "/experiencia/") {
    return page(data.title, data.intro,
      '<section class="section"><div class="timeline">' + (data.items || []).map((item) =>
        '<article class="timeline-item"><div class="timeline-date">' + esc(item.period) +
        "</div><div><h2>" + esc(item.title) + "</h2><p>" + text(item.description) +
        "</p></div></article>"
      ).join("") + "</div></section>");
  }
  if (path === "/proyectos/") {
    return page(data.title, data.intro,
      '<section class="section"><div class="grid">' +
      (data.items || []).map(projectCard).join("") + "</div></section>");
  }
  if (path.startsWith("/proyectos/")) {
    const slug = decodeURIComponent(path.split("/")[2] || "");
    return projectDetail(projects, slug) ||
      page("Proyecto no encontrado", "No encontramos ese proyecto.",
        '<section class="section"><a class="button" href="/proyectos/">Volver a proyectos →</a></section>');
  }
  if (path === "/formacion/") {
    return page(data.title, data.intro,
      '<section class="section"><div class="education-list">' + (data.items || []).map((item) =>
        '<article class="education-item"><div class="timeline-date">' + esc(item.period) +
        "</div><div><h2>" + esc(item.title) + "</h2><p>" + text(item.description) +
        "</p></div></article>"
      ).join("") + "</div></section>");
  }
  if (path === "/contacto/") {
    return page("Contacto", data.contactText,
      '<section class="section narrow"><div class="contact"><p>Si tenés un proyecto, una idea o un problema que quieras conversar, escribime.</p>' +
      '<a class="contact-email" href="mailto:' + esc(data.email) + '">' +
      esc(data.email) + "</a></div></section>");
  }
  return "";
}

function metadata(path, data, project, site) {
  const isHome = path === "/";
  const title = project
    ? project.title + " | Proyectos — Nicolás Calmels"
    : isHome
      ? "Nicolás Calmels | Desarrollo web y soluciones tecnológicas"
      : (path === "/contacto/" ? "Contacto" : data.title || "Nicolás Calmels") + " — Nicolás Calmels";
  const description = (project?.description || data.seoDescription || data.intro ||
    data.contactText ||
    "Desarrollo web, software, automatizaciones e infraestructura tecnológica. Conocé los proyectos y la experiencia de Nicolás Calmels.")
    .replace(/\s+/g, " ").slice(0, 160);
  const canonical = BASE + path;
  const image = BASE + (project?.images?.desktop || project?.images?.mobile || site.images?.share || site.images?.hero || "/img/uploads/LOGO_NICOLAS_CALMELS.jpeg");
  const graph = [
    {
      "@type": "Person", "@id": BASE + "/#person", name: "Nicolás Calmels",
      url: BASE + "/", image: BASE + "/img/uploads/LOGO_NICOLAS_CALMELS.jpeg",
      jobTitle: "Desarrollador web y profesional de tecnología",
      description: "Desarrollo web, software, automatizaciones e infraestructura tecnológica.",
      sameAs: ["https://github.com/nicolaievich"]
    },
    {
      "@type": "WebSite", "@id": BASE + "/#website", url: BASE + "/",
      name: "Nicolás Calmels", inLanguage: "es-AR",
      publisher: { "@id": BASE + "/#person" }
    }
  ];
  if (project) {
    graph.push({
      "@type": "CreativeWork", "@id": canonical + "#project",
      name: project.title, description: project.description, url: canonical,
      creator: { "@id": BASE + "/#person" },
      dateCreated: project.year || undefined,
      keywords: (project.technologies || []).join(", ")
    });
  } else {
    graph.push({
      "@type": path === "/perfil/" ? "AboutPage" : "WebPage",
      "@id": canonical + "#webpage", url: canonical, name: title,
      description, inLanguage: "es-AR",
      isPartOf: { "@id": BASE + "/#website" },
      about: { "@id": BASE + "/#person" }
    });
  }
  return { title, description, canonical, image, jsonLd: JSON.stringify({
    "@context": "https://schema.org", "@graph": graph
  }).replace(/</g, "\\u003c") };
}

function setMeta(html, selector, attribute, value) {
  const escaped = value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const pattern = new RegExp("<meta\\s+([^>]*" + selector + "[^>]*)>", "i");
  if (pattern.test(html)) {
    return html.replace(pattern, (tag) => {
      const attrPattern = new RegExp("\\b" + attribute + '="[^"]*"');
      return attrPattern.test(tag)
        ? tag.replace(attrPattern, attribute + '="' + escaped + '"')
        : tag.replace(/>$/, " " + attribute + '="' + escaped + '">');
    });
  }
  return html.replace("</head>", '<meta ' + selector + ' ' + attribute + '="' + escaped + '"></head>');
}

function makeDocument(shell, path, data, project, content, site) {
  const meta = metadata(path, data, project, site);
  let html = shell;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "<title>" + esc(meta.title) + "</title>");
  html = setMeta(html, 'name="description"', "content", meta.description);
  html = setMeta(html, 'property="og:title"', "content", meta.title);
  html = setMeta(html, 'property="og:description"', "content", meta.description);
  html = setMeta(html, 'property="og:url"', "content", meta.canonical);
  html = setMeta(html, 'property="og:image"', "content", meta.image);
  html = setMeta(html, 'name="twitter:title"', "content", meta.title);
  html = setMeta(html, 'name="twitter:description"', "content", meta.description);
  html = setMeta(html, 'name="twitter:image"', "content", meta.image);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i,
    '<link rel="canonical" href="' + meta.canonical + '">');
  const favicon = site.images?.favicon || "/img/uploads/LOGO_NICOLAS_CALMELS.jpeg";
  html = html.replace(/<link\s+id="site-favicon"[^>]*>/i,
    '<link id="site-favicon" rel="icon" href="' + esc(favicon) + '">');
  html = html.replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/i, "");
  html = html.replace("</head>", '<script type="application/ld+json">' + meta.jsonLd + "</script></head>");
  html = html.replace('<main id="app"></main>', '<main id="app">' + content + "</main>");
  html = html.replace(/\s*<script\s+src="\/js\/main\.js"><\/script>/i, "");
  return html;
}

async function writePage(path, data, project, content, shell, site) {
  const file = join(ROOT, path === "/" ? "index.html" : path.slice(1) + "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, makeDocument(shell, path, data, project, content, site) + "\n", "utf8");
  console.log("Prerendered " + path + " -> " + file.slice(ROOT.length + 1));
}

async function main() {
  const shell = await readFile(join(ROOT, "index.html"), "utf8");
  const site = await readJson("site.json");
  const profile = await readJson("profile.json");
  const experience = await readJson("experience.json");
  const projects = await readJson("projects.json");
  const education = await readJson("education.json");
  const routes = [
    ["/", site, null],
    ["/perfil/", profile, null],
    ["/experiencia/", experience, null],
    ["/proyectos/", projects, null],
    ["/formacion/", education, null],
    ["/contacto/", site, null]
  ];

  for (const [path, data] of routes) {
    await writePage(path, data, null, render(path, data, projects), shell, site);
  }
  for (const project of projects.items || []) {
    const path = "/proyectos/" + encodeURIComponent(project.slug) + "/";
    await writePage(path, projects, project, render(path, projects, projects), shell, site);
  }

  const urls = routes.map(([path]) => path)
    .concat((projects.items || []).map((project) =>
      "/proyectos/" + encodeURIComponent(project.slug) + "/"
    ));
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((path) => "  <url><loc>" + BASE + path + "</loc></url>").join("\n") +
    "\n</urlset>\n";
  await writeFile(join(ROOT, "sitemap.xml"), sitemap, "utf8");
  console.log("Sitemap generated with " + urls.length + " URLs.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

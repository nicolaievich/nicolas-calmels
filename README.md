# nicolas-calmels

Sitio personal de Nicolás Calmels para **nicolascalmels.com.ar**.

## Estructura

- `index.html` — estructura base y metadatos mínimos.
- `css/styles.css` — identidad visual y comportamiento responsive.
- `js/main.js` — carga y renderizado del contenido.
- `content/site.json` — contenido editable desde Sveltia CMS.
- `admin/` — configuración de Sveltia CMS.
- `img/uploads/` — medios administrados por el CMS.

## CMS

Sveltia administra el contenido directamente en GitHub mediante `admin/config.yml`. El diseño queda separado del contenido para poder cambiar textos y servicios sin editar HTML.

### Imágenes opcionales

El sitio está preparado para trabajar con o sin imágenes.

En Sveltia, dentro de **Contenido del sitio → Sitio → Imágenes**, se pueden administrar cuatro recursos opcionales:

- **Favicon:** icono de la pestaña del navegador.
- **Imagen principal:** acompaña al encabezado/hero.
- **Imagen de perfil:** acompaña visualmente la sección Perfil.
- **Imagen para compartir:** queda preparada para futuras mejoras de metadatos sociales.

Si un campo de imagen queda vacío, el componente correspondiente no reserva espacio ni muestra un marco vacío. El diseño vuelve automáticamente a su versión textual, conservando la estética actual.

Si posteriormente se agrega una imagen, el layout cambia de forma responsiva sin necesidad de modificar HTML ni CSS.

## Identidad visual

La identidad personal utiliza principalmente negro y gris, con toques de verde. No replica la identidad visual roja/blanca de Hermanos Calmels.

## Principio de diseño

El contenido puede crecer sin obligar a rediseñar la estructura. Las imágenes son recursos opcionales: el sitio funciona correctamente en modo **texto** y en modo **texto + imagen**.


## Portfolio de proyectos

Los proyectos se administran desde Sveltia mediante un formulario único. Cada registro puede ser un sitio web, software, automatización o infraestructura.

Campos: identificador, tipo/rubro, título, dominio, descripción, fecha/año, estilo/composición, tecnologías, imagen de monitor, imagen de celular, URL y repositorio.

La estructura queda preparada para que el contenido sea independiente del diseño y para que el futuro portfolio de Hermanos Calmels pueda reutilizar la misma lógica con otra identidad visual.

## Prerenderizado SEO

El sitio genera HTML estático para cada ruta pública y cada ficha de proyecto. Así, el contenido principal, el título, la descripción, el canonical y los datos estructurados llegan en el HTML inicial, sin depender de JavaScript en el navegador.

- El generador compartido está en \`scripts/prerender.mjs\`.
- Los datos siguen siendo editables desde Sveltia en \`content/*.json\`.
- GitHub Actions vuelve a generar las páginas cuando cambia el contenido en \`main\`.
- El resultado se guarda en los \`index.html\` de cada ruta y actualiza \`sitemap.xml\`.
- El navegador ya no necesita ejecutar \`js/main.js\` para mostrar el contenido.

Para probarlo localmente: \`node scripts/prerender.mjs\` (Node.js 22 o superior).

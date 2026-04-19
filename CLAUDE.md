# CLAUDE.md — Soluvex Landing
> Leer este archivo SIEMPRE antes de cualquier cambio. Sin excepción.

## Proyecto
Landing page oficial de Soluvex Studio.
URL producción: https://www.soluvexstudio.com
Repo: sergiosoluvex/soluvex-landing
Deploy: Vercel — auto-deploy en cada push a main.

## Stack técnico
- HTML + CSS + JS vanilla — sin frameworks, sin bundler, sin Node
- GSAP + ScrollTrigger via cdnjs CDN
- Lenis 1.1.13 via unpkg CDN
- Google Fonts: Inter (único typeface)
- Vercel para hosting y dominio

## Estructura de archivos
```
/
├── index.html              ← página principal bilingüe EN/ES
├── style.css               ← todos los estilos
├── main.js                 ← GSAP, Lenis, i18n, autoplay, marquee
├── vercel.json             ← CSP headers + redirect apex→www
├── assets/
│   ├── foto.jpg            ← foto fundador (⚠️ pendiente foto real)
│   ├── logo-fondo-transparente.png
│   ├── favicon.png
│   ├── og-image.jpg
│   └── videos/
│       ├── hero.mp4        ← vídeo hero cinemático (humo negro)
│       └── hero-poster.jpg ← primer frame del vídeo
├── aviso-legal.html        ← NO TOCAR
├── cookies.html            ← NO TOCAR
├── privacidad.html         ← NO TOCAR
└── supabase/               ← NO TOCAR
```

## Paleta de color
| Token | Valor | Uso |
|-------|-------|-----|
| Negro base | `#000000` / `#0a0a0a` | Fondos hero, about, footer |
| Services | `#111111` | Fondo sección servicios |
| Blanco | `#ffffff` | Fondos work, contact + texto sobre negro |
| Dorado | `#C8A96E` | SOLO elementos accionables: CTAs, flechas ↗, WA float, números /01 /02 |
| Secundario | `#666666` | Textos secundarios, descripciones |
| Líneas | `#222222` | Separadores, bordes |

⚠️ El dorado #C8A96E es el único acento. No añadir nuevos colores sin aprobación.

## Tipografía
Inter — único typeface. Sin serif, sin mezclas.
- 900 weight → headlines hero, servicios, contact
- 700 weight → nombres proyectos en work
- 500 weight → labels uppercase, marquee
- 400 weight → body text, descripciones

## Secciones (orden exacto en el DOM)
1. **Hero** — `<section class="panel panel--hero">` dentro de `.stack`
   - Video fullscreen autoplay muted loop playsinline
   - Headline: "A TU / MEDIDA." (ES) / "MADE / FOR YOU." (EN)
   - Subline: "MARCA   DISEÑO   TECNOLOGÍA" (ES) / "BRAND   DESIGN   TECHNOLOGY" (EN)
   - Logo top-left con `filter: brightness(0) invert(1)`
   - Toggle EN/ES top-left junto al logo
   - Icono WhatsApp top-right en dorado
   - Flechas ↑↓ fixed bottom-right (section-nav)

2. **Work** — `<section class="work">` fuera del stack
   - Fondo #ffffff
   - Lista de proyectos: Carat Lifestyle + Dra. Cristina Herrera
   - Hover: fila a #f5f5f5, flecha ↗ dorada anima diagonal

3. **Services** — `<section class="services">`
   - Fondo #111111
   - Dos `.service-panel` full-viewport
   - Marquee infinito GSAP en cada panel
   - /01 WEBSITES / /02 AUTOMATIZACIONES IA

4. **About** — `<section class="about">`
   - Fondo #000
   - Grid: texto izquierda + foto derecha (desktop) / foto arriba + texto abajo (móvil)
   - Foto en grayscale(100%)

5. **Contact** — `<section class="contact">`
   - Fondo #ffffff
   - Headline + botón dorado + email

6. **Footer** — mínimo, fondo #000

## Sistema i18n
- Atributos `data-i18n` en HTML
- Diccionario EN/ES completo en main.js
- Toggle EN/ES persiste en localStorage
- EN por defecto
- Al añadir texto nuevo: siempre añadir clave en AMBOS idiomas

## WhatsApp y contacto
- Número: +34 644804698
- URL ES: `https://wa.me/34644804698?text=Hola%2C%20me%20gustar%C3%ADa%20hablar%20sobre%20un%20proyecto.`
- URL EN: `https://wa.me/34644804698?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project.`
- Email: sergio@soluvexstudio.com

## Protocolo obligatorio
1. **Leer este archivo** antes de cualquier acción
2. **Diagnosticar** el problema antes de proponer solución
3. **Proponer** la solución y esperar confirmación antes de implementar
4. **Nunca tocar** vercel.json CSP sin revisar impacto completo
5. **Nunca tocar** aviso-legal.html, cookies.html, privacidad.html, supabase/
6. **Siempre** commit + push al final de cada sesión con mensaje descriptivo
7. **Siempre** probar en localhost antes de hacer push

## Autoplay móvil
Función `forceVideoAutoplay()` en main.js gestiona autoplay en Safari iOS y Android Chrome.
Atributos requeridos en `<video>`: `muted autoplay loop playsinline webkit-playsinline x5-playsinline`

## Pendientes técnicos
- [ ] Foto real del fundador (sustituir assets/foto.jpg)
- [ ] Screenshots reales Carat Lifestyle y Dra. Herrera para portfolio
- [ ] Nuevo vídeo hero Higgsfield con más color y dinamismo
- [ ] Supabase edge function submit-lead tiene cambios locales sin commitear

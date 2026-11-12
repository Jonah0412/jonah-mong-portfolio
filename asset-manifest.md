# Asset manifest

The implementation uses local WebP files and bundled fonts. The 480px and 800px derivatives preserve the original image proportions and are selected through responsive sources. Media boxes reserve their aspect ratio before each image loads.

| Asset | Placement | Version | Original pixels | Aspect | Format and optimization | Source |
|---|---|---|---|---|---|---|
| `kke-desktop.webp` | KKE showcase, Work, case study | Desktop | 1400 × 3016 | 175:377 | WebP, 480px and 800px sources | Supplied KKE final design |
| `kke-mobile.webp` | KKE showcase and gallery | Mobile | 376 × 3600 | 47:450 | WebP, native resolution | Supplied KKE mobile screen |
| `kke-wireframe.webp` | KKE showcase, gallery and case study | Desktop | 1100 × 2139 | 1100:2139 | WebP, 480px and 800px sources | Supplied KKE wireframe |
| `artstronomy.webp` | ARTStronomy showcase, Work and case study | Desktop | 1265 × 712 | 1265:712 | WebP, 480px and 800px sources | Supplied exhibition homepage capture |
| `artstronomy-radio.webp` | ARTStronomy showcase and gallery | Desktop | 1280 × 720 | 16:9 | WebP, 480px and 800px sources | Existing ARTStronomy Radio Scanner capture |
| `abangboy.webp` | AbangBoy showcase, Work and case study | Desktop | 1440 × 864 | 5:3 | WebP, 480px and 800px sources | Supplied AbangBoy homepage capture |
| `abangboy-detail.webp` | AbangBoy showcase and gallery | Detail | 750 × 774 | 125:129 | WebP, native resolution | Crop of the supplied homepage |
| `island.webp` | Visual studies showcase and case study | Artwork | 1280 × 1600 | 4:5 | WebP, 480px and 800px sources | Supplied Floating Islands composite |
| `coffee.webp` | Visual studies showcase and gallery | Artwork | 1280 × 1600 | 4:5 | WebP, 480px and 800px sources | Supplied Iced Coffee photograph |
| `headphones.webp` | Visual studies gallery and case study | Artwork | 1268 × 1264 | 317:316 | WebP, 480px and 800px sources | Supplied Metallic Frequencies study |
| `portrait.webp` | About | Portrait | 900 × 1350 | 2:3 | WebP, 480px and 800px sources | Supplied portfolio portrait |
| `portfolio-study.webp` | This site, Work and case study | Desktop | 1440 × 900 | 8:5 | WebP, 480px and 800px sources | Screenshot of this local reconstruction |
| `portfolio-reel.mp4` | Homepage hero | Desktop and mobile | 768 × 480 | 8:5 | Silent H.264, 7.2s | Edited from Jonah’s ARTStronomy, KKE, AbangBoy and Floating Islands stills |

Audiowide loads from the Google Fonts stylesheet, with Arial as a fallback. Project graphics and captures are drawn from the supplied portfolio assets. The reference website’s project imagery and awards are excluded from the build.

### About page marks

- Adobe Photoshop, Illustrator, After Effects and XD, Figma, Canva, WordPress, HTML, CSS, Java and GitHub come from [Devicon 2.18.0](https://github.com/devicons/devicon).
- ChatGPT’s OpenAI mark, Codex, Gemini, ComfyUI and n8n come from [Lobe Icons 1.102.0](https://github.com/lobehub/lobe-icons).
- Adobe InDesign and Higgsfield come from [SVG Logos via Iconify](https://github.com/gilbarbara/logos).
- Elementor uses the static mark from [Simple Icons 14.15.0](https://github.com/simple-icons/simple-icons/tree/14.15.0). Procreate, Figma Weave and Dreamina use marks from their official sites.

Product marks identify the tools in the directory. Licences for the bundled icon collections are in `public/assets/about-tools`.

The masthead uses Jonah’s supplied `jam-logo.png`. The header crops the empty border in layout and renders the original mark in cream with a blue tint from the site palette.

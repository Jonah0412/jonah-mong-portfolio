# Jonah Mong motion portfolio

A local, static React reconstruction of the layout and motion in Mike Wilcock’s portfolio, personalised with Jonah Mong’s project material. The reference supplies the layout and interaction direction. [Live reference](https://mikewilcockdesign.com/) · [Technical case study](https://mikewilcockdesign.com/work/portfolio)

The homepage hero follows [The Romans](https://www.wearetheromans.com/). The Work index follows [Matthieu Givelet](https://matthieugivelet.com/work), and the sitewide footer follows [The Collected Works](https://www.thecollectedworks.com/). 

The site palette uses midnight `#010736`, navy `#0D1C42`, blue `#22396F` and cream `#FCF1D0`. [Color Hunt palette](https://colorhunt.co/palette/0107360d1c4222396ffcf1d0)

## Run it locally

Use Node.js 22 or newer and pnpm. From this folder, run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [the local preview](http://127.0.0.1:8899/). Run `pnpm build` to type-check and build. The build produces a `dist` folder that can be served over HTTP.

The static build uses relative assets and React Router hash routes. Serve the contents of `dist` from a static host or a GitHub Pages project directory. The included `.nojekyll` file is for GitHub Pages.

## Content and behavior

- “What I do” is a homepage overview. The dedicated Services page and its detail routes were removed.
- The four homepage entries use KKE Cleaning Services, ARTStronomy, AbangBoy and Visual studies. The work index adds the reconstruction as a fifth case study.
- The contact page presents Jonah’s internship introduction, direct email and LinkedIn links, and two selected case studies. The footer links to Contact and email. Cookie choices are saved locally. The preview has no analytics service.
- The source uses a shared frame loop, Lenis, browser-native animations, and Audiowide loaded from Google Fonts. The reduced-motion branch skips the intro and covers, stops smooth scrolling and pointer effects, and shows the full statement at rest.
- Screenshots from the reference are internal review evidence. The bundled imagery is Jonah’s project material, and the supplied typefaces are distributed with their font licences.

See the asset manifest for project imagery and software logo attribution.

## Public website

[Jonah Mong — Design & Web](https://jonah0412.github.io/jonah-mong-portfolio/)

## Editing

Page components are in `src/pages/`, shared elements in `src/components/`, and artwork in `public/assets/`. Run `pnpm build` after editing to check TypeScript and regenerate the website.

GitHub Pages hosts this website. Every push to `main` runs `.github/workflows/pages.yml`, installs the locked dependencies, builds the portfolio, and publishes `dist/`. Check the Actions tab for deployment progress.

The source was originally exported from Sites version 6, commit `2df510a8108e791a8b61dd8e86ae57c95c0174fe`.

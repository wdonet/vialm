# Vial FE

This is built with a template for [Next.js](https://nextjs.org/) app router + [Mantine](https://mantine.dev/).
It uses the following:

- Node v20.12.2
- React v18(https://react.dev/)
- [PostCSS](https://postcss.org/) with [mantine-postcss-preset](https://mantine.dev/styles/postcss-preset)
- [TypeScript](https://www.typescriptlang.org/)
- Consumes an API at localhost:4000

## how-to run
- Clone Web app https://github.com/wdonet/vialm
  - Go to the cloned folder and run `yarn` (you might need yarn installed or use `npm i`)
  - Run `yarn dev` (or `npm run dev`)
  - Open http://localhost:3000/
- Clone API app https://github.com/wdonet/vialapi
  - Go to the cloned folder and run `npm i`
  - Run `npm start`
  - Can try directly http://localhost:4000/subjects or you might import `postman_collection.json` to your Postman

### Assumptions and design decisions on the FE
- Decided to use Next.js template for Mantine
- Tried to keep organized code by components, except a couple due to time limit
- Did not spend time on testing or storybook but the template provides a starting point which I did not remove yet
- There are opportunities to improve on TS types, UX, Styling, Testing (of course) and Clean code
- ...but tried to do my best in this short period of time

### Other scripts included with the template but not used or verified 100% yet

- TS & Linters
  - `typecheck` – checks TypeScript types
  - `lint` – runs ESLint
- Testing
  - `jest` – runs jest tests
  - `jest:watch` – starts jest watch
  - `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts
- Storybook
  - `storybook` – starts storybook dev server
  - `storybook:build` – build production storybook bundle to `storybook-static`
- Prettier
  - `prettier:check` – checks files with Prettier
  - `prettier:write` – formats all files with Prettier

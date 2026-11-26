# g7-popcorn

## Run locally

```sh
npm install
npm run dev
```

## Back4App setup

1. Create a Back4App backend app and open **App Settings → Security & Keys**.
2. Copy `.env.example` to `.env.local` if the local file does not exist.
3. Fill in `VITE_BACK4APP_APPLICATION_ID` and `VITE_BACK4APP_JAVASCRIPT_KEY` in `.env.local`.
4. Run `npm install` and `npm run dev`. Restart the dev server after changing environment variables.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

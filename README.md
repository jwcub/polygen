# polygen

[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/jwcub/polygen/build.yml)](https://github.com/jwcub/polygen/actions)
[![License](https://img.shields.io/github/license/jwcub/polygen)](https://github.com/jwcub/polygen/blob/main/LICENSE)

`polygen` is a polygon-based web game inspired by [generals.io](https://generals.io).

## Prerequisites

- [Node 20+](https://nodejs.org/)
- [Rust 1.30+](https://www.rust-lang.org/)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/)

## Development

- Copy .env file:

  ```sh
  cp .env.example .env
  ```

- Build wasm target:

  ```sh
  npm run wasm
  ```

- Install dependencies:

  ```sh
  npm install
  ```

- Setup database:

  ```sh
  npm run setup
  ```

- Start dev server:
  ```sh
  npm run dev
  ```

## License

This project is licensed under the [Unlicense](https://github.com/jwcub/polygen/blob/main/LICENSE).

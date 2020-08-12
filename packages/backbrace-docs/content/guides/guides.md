### Installation

**Backbrace** is a Javascript library for building web apps using JSON. You can start building web apps without any knowledge of
Javascript, although it is recommended.

#### NPM (recommended)

We recommend utilizing NPM or Yarn to install **Backbrace**. It will allow you to untilize special tooling, which will help when developing wep apps.

If you're using NPM:

```shell
npm i @backbrace/core
```

Or if you're using Yarn:

```shell
yarn add @backbrace/core
```

After that, you can import **Backbrace** into a script module:

```html
<body>

    <script type="module">

        import { start } from '../node_modules/@backbrace/core/dist/Backbrace.js';

        start();

    </script>

</body>
```
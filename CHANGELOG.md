<a name="0.2.5"></a>
## 0.2.5 (2021-03-04)

### Added

- ✨ Update v0.2.5 ([#49](https://github.com/backbrace/backbrace/pull/49)) [[128a933](https://github.com/backbrace/backbrace/commit/128a933c78147209958c0cdf859b9b03c50cf2e6)]

### Security

- 🔒 Fix dependency security [[7f01667](https://github.com/backbrace/backbrace/commit/7f01667bbd0313be8c5a14938524dac260e84ede)]

### Miscellaneous

- 🔨 Fix firebase not loading from &#x60;node_modules&#x60; [[214705c](https://github.com/backbrace/backbrace/commit/214705cc07671039a4b5de573e8dec02b9c812d4)]


<a name="0.2.4"></a>
## 0.2.4 (2020-08-12)

### Added

- ✨ Update devkit package [[60617ad](https://github.com/backbrace/backbrace/commit/60617ad3434a6bb89b2d53c45f97080f81f5d94b)]
- ✨ Update core package [[a06c5c5](https://github.com/backbrace/backbrace/commit/a06c5c57f0503df054974a6d26b38208921e27b7)]

### Changed

- 🍱 New branding [[98e65af](https://github.com/backbrace/backbrace/commit/98e65af5f0ae68ff399191f935d922e7692deb60)]

### Fixed

- 🐛 Fix app short name [[d1e6541](https://github.com/backbrace/backbrace/commit/d1e654145e43495a5c4072077928cd05592980de)]
- 🐛 Fix mobile mode layout issue [[bdfc283](https://github.com/backbrace/backbrace/commit/bdfc2836d9f1930b46be02d152638c092d6c72b7)]
- 🐛 Fix error when using &#x60;dist&#x60; version [[73dd63f](https://github.com/backbrace/backbrace/commit/73dd63fd5d46b3316b03adeec6adebd5b58f6eb0)]
- 🐛 Fix error when section doesn&#x27;t have a data source [[168d4f2](https://github.com/backbrace/backbrace/commit/168d4f28e99bfdc44dca16ffd850c6257b3c1794)]

### Miscellaneous

- 📝 Update copyright year [[c555905](https://github.com/backbrace/backbrace/commit/c555905becaa799398772f586eeadaf334717ed0)]
- 📝 Update docs package [[027cc4b](https://github.com/backbrace/backbrace/commit/027cc4b2e6f9893ed5a723eea6ba5dfafa13d4e7)]
- 🔨 Update build scripts [[6390095](https://github.com/backbrace/backbrace/commit/6390095762b8a6ccd712cf330ba837a0671c4cbc)]
-  feat(core): remove promise queues [#37](https://github.com/backbrace/backbrace/issues/37) [[52b173c](https://github.com/backbrace/backbrace/commit/52b173c7ccd5b5a7d80ecae06810f19391b529d6)]
-  feat(core): use monaco editor [#36](https://github.com/backbrace/backbrace/issues/36) [[7689b80](https://github.com/backbrace/backbrace/commit/7689b80b49d0914fa6514cc98dd4ab16578d5f9b)]
-  build: update to webpack-dev-server@3.10.1 [[3e6b1fd](https://github.com/backbrace/backbrace/commit/3e6b1fd0fac08ec26cc8d3f39893670eda1811e8)]
-  build(vscode): rework the tasks in vscode to match grunt tasks [[7a6f774](https://github.com/backbrace/backbrace/commit/7a6f774eaf2113a30b40645083cf0478a3c08e6a)]
-  fix(core): loading tern definition files in &#x60;EditorPage&#x60; [#34](https://github.com/backbrace/backbrace/issues/34) [[ab4d285](https://github.com/backbrace/backbrace/commit/ab4d2857739e4764de239c2b85ec9496f2a0504e)]
-  build(grunt): icons schema not generating [#33](https://github.com/backbrace/backbrace/issues/33) [[a82d9a3](https://github.com/backbrace/backbrace/commit/a82d9a3fbf4792fb689d254988dbff309b3e23f9)]


<a name="0.2.3"></a>
# [0.2.3](https://github.com/backbrace/backbrace/compare/0.2.2...0.2.3) (2019-12-13)

## Bug Fixes

* **docs:** website style fixes ([39922918](https://github.com/backbrace/backbrace/commit/39922918a568bb4b9d5c55c2a14d521b8b22eec1))

## Features

* **core:** make app `unload` function public ([4674e439](https://github.com/backbrace/backbrace/commit/4674e4394bd9b6fc828cab3514d871cbe3d4c2ed))
* **core:** update to newer material design look ([6c60b083](https://github.com/backbrace/backbrace/commit/6c60b083a6ed47eb6ea26b4e872cd810a7962786))
* **core:** add `unload` function to `app` module ([d58288f4](https://github.com/backbrace/backbrace/commit/d58288f4748a918c127c65ed54a440ff1401d2f6))
* **core:** external section components ([678de54e](https://github.com/backbrace/backbrace/commit/678de54ee3ff0bc0d081c7a00f6dd2c5355d372e))


<a name="0.2.2"></a>
# [0.2.2](https://github.com/backbrace/backbrace/compare/0.2.1...0.2.2) (2019-08-29)

## Breaking changes

* **docs:** due to [49e071be](https://github.com/backbrace/backbrace/commit/49e071be84afbf85e3026b6a76c71c67887eb385),
  removed the `sample-app` package and deprecated the npm package.
  ([49e071be](https://github.com/backbrace/backbrace/commit/49e071be84afbf85e3026b6a76c71c67887eb385))

## Bug Fixes

* **core:** routing opening too many viewers
  ([a0dd660d](https://github.com/backbrace/backbrace/commit/a0dd660d646b70c96fe70be37413aba5a1a7db87))
* **core:** fix base colors
  ([0c623700](https://github.com/backbrace/backbrace/commit/0c62370021a5f12bff2450df1cd64ef7b3746f10))
* **core:** split vendor chunks for highlight.js and clipboard
  ([b25bd922](https://github.com/backbrace/backbrace/commit/b25bd92238401f0f8210d1f83594e2760c58a3c7))
* **core:** afterUpdate event called too many times
  ([310f82c5](https://github.com/backbrace/backbrace/commit/310f82c5055fe3c96d9d568e3b3123d606f0d46f))
* **core:** remove success param from `clipboard`
  ([fffe6a11](https://github.com/backbrace/backbrace/commit/fffe6a114a5e294458eba44703f5867267183736))
* **core:** service worker not loading
  ([50b569d0](https://github.com/backbrace/backbrace/commit/50b569d0ec84de564a48e8a9277b5efa73969faa))
* **core:** remove `isDevMode` from `util`
  ([50846ea9](https://github.com/backbrace/backbrace/commit/50846ea987c09cb7314b0be2fafad0a0e019d2db))
* **core:** header shadow incorrect in md style
  ([56b832e8](https://github.com/backbrace/backbrace/commit/56b832e86964c8725fd0f6935e2a8b68532602dd))
* **core:** service worker errors on install
  ([9a29800d](https://github.com/backbrace/backbrace/commit/9a29800d330e96bf34e36e87878956b16f799b03))
* **core:** remove prefetch of chunks
  ([58ba00b9](https://github.com/backbrace/backbrace/commit/58ba00b92171ad75922794e1990cf282ea5adac6))
* **core:** remove progress meter on unload of viewer
  ([b435ea3d](https://github.com/backbrace/backbrace/commit/b435ea3ddc171204dbd342bafaba3e2094447351))
* **core:** don't wipe the `templatepage` html if there is no data
  ([3660a4a3](https://github.com/backbrace/backbrace/commit/3660a4a3963ffaf27dc749a26c2073b685a41e9c))
* **core:** remove `setZeroTimeout` function from `util` module
  ([a11c4de9](https://github.com/backbrace/backbrace/commit/a11c4de9dc70f6318a22380e55a386047e875ad9))
* **docs:** remove shadow on navbar
  ([bdf63512](https://github.com/backbrace/backbrace/commit/bdf6351278e09cd21d4dc48efb0087b6f1d2def1))
* **docs:** service worker not loading
  ([cc10b873](https://github.com/backbrace/backbrace/commit/cc10b873f2b033b9fbfc91ec79588f1abb17159a))
* **sample-app:** service worker not loading
  ([b9577132](https://github.com/backbrace/backbrace/commit/b9577132765de2a6581f32956e0acff8ef8fc159))

## Features

* **core:** component lifecycle changes
  ([8ea8700a](https://github.com/backbrace/backbrace/commit/8ea8700a82addb7f04846b66155e6aeabf3f8a2f))
* **core:** add afterUpdate event to `sectioncomponent`
  ([9a955803](https://github.com/backbrace/backbrace/commit/9a9558039bb3d45beff5a1f2797773fb831d7140))
* **core:** load modules as type="module"
  ([5e10ca51](https://github.com/backbrace/backbrace/commit/5e10ca517ba88283efda7fdb31f4d704b45a8fd7))
* **core:** add `hide-small` class to base style
  ([64dedd89](https://github.com/backbrace/backbrace/commit/64dedd8930d581d7f59586b9d99c0793aaf4f929))
* **core:** add new notify style to material design
  ([3232afb3](https://github.com/backbrace/backbrace/commit/3232afb37e666644f789322d9245186203fc6774))
* **core:** add new viewer event `afterUpdate`
  ([a7ef181a](https://github.com/backbrace/backbrace/commit/a7ef181a90a4a9c3391e2334c306ccf4a6493e60))
* **core:** add new functions to `util` - `highlightSyntax` and `clipboard`
  ([3d9362d9](https://github.com/backbrace/backbrace/commit/3d9362d975612ecdbe6e2aeea3bbac4a048b0528))
* **core:** add `alert`, `card` and `callout` styles to materialdesign
  ([e827e2e8](https://github.com/backbrace/backbrace/commit/e827e2e8b24cb047dbd90ffaf9215061aa5124f4))
* **core:** remove `addPage` and `addTable` functions
  ([c51d2514](https://github.com/backbrace/backbrace/commit/c51d2514cd01a62675f2ce017082e20145db5567))
* **core:** update jsdoc version
  ([bd5fcb22](https://github.com/backbrace/backbrace/commit/bd5fcb22b0466537301d973e0584a976dc52966e))
* **core:** add card style to material design
  ([7630ab65](https://github.com/backbrace/backbrace/commit/7630ab657e01597b1707e798754571c8558f0b8d))
* **core:** allow `editorpage` to load from a file
  ([0be96781](https://github.com/backbrace/backbrace/commit/0be96781505f9c50e3042409573fb186e99e554a))
* **core:** add `dataType` parameter to `get` function
  ([365b9fda](https://github.com/backbrace/backbrace/commit/365b9fda47d8390bca0229ce7417c76bf91e19b5))
* **core:** allow route parameters in the route page
  ([4949b491](https://github.com/backbrace/backbrace/commit/4949b4919e10cee548dcc29a086aa0b8d0c3be0d))
* **core:** add route error when a route cannot be matched
  ([885a2c81](https://github.com/backbrace/backbrace/commit/885a2c814d1db30be6c441e6a02efd78a40fc733))
* **core:** add route error
  ([936b5b64](https://github.com/backbrace/backbrace/commit/936b5b64783ba9c96dcc472d55ffa21473273139))
* **core:** add new field component `datefield`
  ([398601c0](https://github.com/backbrace/backbrace/commit/398601c0c0cc1fdd2e0d8bd307b5ff2f98ad0628))
* **core:** add a progress meter when loading a `viewer`
  ([25630315](https://github.com/backbrace/backbrace/commit/256303157305692ccd0672aed5ea381dace2247e))
* **core:** update `core` based on recommendations from the lighthouse audit #26
  ([d8a46ff4](https://github.com/backbrace/backbrace/commit/d8a46ff41c2f3b3da7dd2f6302c2f0da4b0e25c3))
* **core:** add syntax highlighting to `templatepage`
  ([3d7c22df](https://github.com/backbrace/backbrace/commit/3d7c22dfa32fad26191140092af48f41efc18a32))
* **docs:** doc app changes
  ([09e64480](https://github.com/backbrace/backbrace/commit/09e64480f6ca2f5a30aac4eafa8a8dbe8aa8bba4))
* **docs:** docs app changes
  ([ef94fc71](https://github.com/backbrace/backbrace/commit/ef94fc71eae5319d650857526407a64cf4d26c3d))
* **docs:** update code to es6
  ([0b9d6e8d](https://github.com/backbrace/backbrace/commit/0b9d6e8d128e3654e46af944ca7ab2f0a64a3625))
* **docs:** update docs app
  ([1792ec2a](https://github.com/backbrace/backbrace/commit/1792ec2a26261fb081e0c5a4c67c21d41d06306a))
* **docs:** update getting started docs
  ([27635324](https://github.com/backbrace/backbrace/commit/27635324c4f5e57d546596e3d38179278c296bc9))
* **docs:** update guides
  ([8d975cd5](https://github.com/backbrace/backbrace/commit/8d975cd52fc5c6aa6fa4860f5dc11af723e6211d))
* **docs:** add suggest edit button to guides
  ([7052fecb](https://github.com/backbrace/backbrace/commit/7052fecb25b614557ae1d5fb2dbaa53ba9e1281b))
* **docs:** add new guides
  ([1ff71459](https://github.com/backbrace/backbrace/commit/1ff7145988a53eb4851b857ff40e760a07f9dc3f))
* **docs:** move sample-app into docs #29
  ([49e071be](https://github.com/backbrace/backbrace/commit/49e071be84afbf85e3026b6a76c71c67887eb385))
* **docs:** use new route error
  ([96cbdca4](https://github.com/backbrace/backbrace/commit/96cbdca4c2ca9a6d09e4c2e4bff51b21803a27f8))
* **docs:** use new syntax highlighting in examples
  ([ad32016d](https://github.com/backbrace/backbrace/commit/ad32016d54e059a0f790bb6d783f225e924d733e))


<a name="0.2.1"></a>
# [0.2.1](https://github.com/backbrace/backbrace/compare/0.2.0...0.2.1) (2019-07-23)

## Bug Fixes

* **core:** section data source not retrieved when the page has no data source
  ([0d82fa94](https://github.com/backbrace/backbrace/commit/0d82fa9487e4a42b11c2d93801f5d715dda513fb))
* **core:** fix typography in `materialdesign` style
  ([10e2952d](https://github.com/backbrace/backbrace/commit/10e2952d8cf7eb839d4f703150afafbac513e2aa))
* **core:** fix repeater sort on `templatepage` component
  ([3b72fa16](https://github.com/backbrace/backbrace/commit/3b72fa1646443f82f8b7b11bd299e683313c5937))
* **core:** close the page if it errors on load
  ([bfdb3613](https://github.com/backbrace/backbrace/commit/bfdb36136c659dee2a9194abf442d3e44075c448))

## Features

* **core:** add `options` to `pagesectiondesign`
  ([837b369e](https://github.com/backbrace/backbrace/commit/837b369e831ea55d2454ca3c6392e9f72a27c394))
* **core:** move close button to the windows toolbar in windowed mode
  ([40727f31](https://github.com/backbrace/backbrace/commit/40727f31f5f0903d31c3dcf7fcc3a4a7f6c7f1c4))
* **core:** add new function to `promisequeue` called `error` for error handling
  ([93ecea23](https://github.com/backbrace/backbrace/commit/93ecea237efd5d390658250dc11ec6f1bc56c08f))
* **core:** update layout system #21
  ([48f6ec12](https://github.com/backbrace/backbrace/commit/48f6ec12510e20c84f3558e8255f0d28fdffeaee))
* **core:** added new properties for `pageSectionDesign`
  ([a9b15b5b](https://github.com/backbrace/backbrace/commit/a9b15b5bf29f491f3235c33d78a4fd9b90fa80e5))
* **sample-app:** add dashboard
  ([511ae0d2](https://github.com/backbrace/backbrace/commit/511ae0d2f6f9a7e8b789e67c237ba10c147ea5ea))


<a name="0.2.0"></a>
# [0.2.0](https://github.com/backbrace/backbrace/compare/0.1.0-alpha.2...0.2.0) (2019-06-05)

## Features

* **docs:** add `docs` package (#18)
  ([c97930c5](https://github.com/backbrace/backbrace/commit/c97930c50897f4f53e3a23e76dbec574c135217e))


<a name="0.1.0-alpha.2"></a>
# [0.1.0-alpha.2](https://github.com/backbrace/backbrace/compare/0.1.0-alpha.1...0.1.0-alpha.2) (2019-01-08)

## Bug Fixes

* **core:** use `rest` operator in `formatString` function (#6)
  ([a3e092ff](https://github.com/backbrace/backbrace/commit/a3e092ffbf2025ee307db3cf887c40c197bf9f2c))
* **core:** fix error when viewer table is `null`
  ([d0f9f167](https://github.com/backbrace/backbrace/commit/d0f9f1673b51d06c4bef22bcf08096abb20cba6c))
* **sample-app:** fix error when running sample app
  ([307842bc](https://github.com/backbrace/backbrace/commit/307842bc80beb11062a8793790d2bbac93b5e309))


## Features

* **core:** change library from `bb` to `backbrace`
  ([ef47a966](https://github.com/backbrace/backbrace/commit/ef47a9662f1406b3cea1dbcd2153c5d09dbc0e65))
* **core:** add `currentPage` to public api
  ([4b7493ca](https://github.com/backbrace/backbrace/commit/4b7493ca474f6d0ebe1bad4a7e763b6e46e5eb21))
* **core:** add `ace` typings
  ([7b5500a6](https://github.com/backbrace/backbrace/commit/7b5500a698509b9a6634a8a5958dbdb7f45f2f3e))
* **core:** ace and codeeditor mods
  ([45a99e04](https://github.com/backbrace/backbrace/commit/45a99e04e26082bdac3ff18cb02e018865d892c7))
* **core:** new module - `route` (#14)
  ([7be5d5a5](https://github.com/backbrace/backbrace/commit/7be5d5a5aa47b5fcd11bf1930c261bd397ff8f35))
* **core:** various mods (#13)
  ([7975497d](https://github.com/backbrace/backbrace/commit/7975497dc0ed7407cf6d194f9caa15483e86b78c))
* **core:** new component - `EditorPageComponent`
  ([97b0c821](https://github.com/backbrace/backbrace/commit/97b0c8218bb9441da35ea45e92ac59be57515753))
* **core:** types - remove aliases
  ([f2721ee9](https://github.com/backbrace/backbrace/commit/f2721ee9046cfdc220c4b2edab8908fee0a4dbc0))
* **devkit:** add tern definition generator
  ([7e14d4b0](https://github.com/backbrace/backbrace/commit/7e14d4b072486b12b0cffbd900875323d2bf73e6))
* **packages:** add `ace` to `src` folder
  ([9e8c9426](https://github.com/backbrace/backbrace/commit/9e8c942681c38db83918228100d4383f61756908))
* **packages:** add `ace-builds` package
  ([2038a962](https://github.com/backbrace/backbrace/commit/2038a9628e5f6463384c066abc1ff57f5ff995db))
* **packages:** add `jqgrid` to `src` folder
  ([013cd77c](https://github.com/backbrace/backbrace/commit/013cd77cbaf86a0829164792ec60742b5b0420f7))
* **packages:** add `ace` package
  ([d6e09628](https://github.com/backbrace/backbrace/commit/d6e09628363a5273e03f1a364fe6f57945946fb4))
* **sample-app:** add logos
  ([934be291](https://github.com/backbrace/backbrace/commit/934be291d47c764169b5823d9b624202854151d5))

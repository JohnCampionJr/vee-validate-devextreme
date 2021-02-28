const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');

const formatNameMap = {
  'vee-validate-devextreme': 'VeeValidateDevExtreme',
  'vee-validate': 'VeeValidate',
};

const pkgNameMap = {
  'vee-validate-devextreme': 'vee-validate-devextreme',
  'vee-validate': 'vee-validate',
};

const formatMap = {
  es: 'esm',
  umd: '',
};

function createConfig(pkg, format) {
  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      exclude: ['**/tests'],
    },
  });

  const version = require(path.resolve(__dirname, `../packages/${pkg}/package.json`)).version;

  const config = {
    input: {
      input: path.resolve(__dirname, `../packages/${pkg}/src/index.ts`),
      external: ['vue', 'vee-validate', 'devextreme', 'devextreme-vue/text-box'],
      plugins: [tsPlugin, replace({ __VERSION__: version })],
    },
    output: {
      banner: `/**
  * vee-validate-devextreme v${version}
  * (c) ${new Date().getFullYear()} John Campion Jr
  * @license MIT
  */`,
      format,
      name: format === 'umd' ? formatNameMap[pkg] : undefined,
      globals: {
        vue: 'Vue',
        'vee-validate': 'VeeValidate',
        'devextreme-vue/text-box': 'DxTextBox',
      },
    },
  };

  config.bundleName = `${pkgNameMap[pkg]}${formatMap[format] ? '.' + formatMap[format] : ''}.js`;

  // if (options.env) {
  //   config.input.plugins.unshift(
  //     replace({
  //       'process.env.NODE_ENV': JSON.stringify(options.env)
  //     })
  //   );
  // }

  return config;
}

module.exports = {
  formatNameMap,
  pkgNameMap,
  formatMap,
  createConfig,
};

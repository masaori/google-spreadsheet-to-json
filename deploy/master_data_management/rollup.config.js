import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'

const extensions = ['.ts', '.js']

const preventThreeShakingPlugin = () => {
  return {
    name: 'no-threeshaking',
    resolveId(id, importer) {
      if (!importer) {
        // let's not theeshake entry points, as we're not exporting anything in Apps Script files
        return { id, moduleSideEffects: 'no-treeshake' }
      }
      return null
    },
  }
}

export default {
  input: './src/entry-points/main.ts',
  output: {
    dir: './deploy/master_data_management/dist',
    format: 'esm',
  },
  plugins: [
    preventThreeShakingPlugin(),
    copy({
      targets: [
        {
          src: './deploy/master_data_management/appsscript.json',
          dest: './deploy/master_data_management/dist',
        },
      ],
    }),
    nodeResolve({
      extensions,
    }),
    babel({ extensions, babelHelpers: 'runtime' }),
  ],
}

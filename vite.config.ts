import preactRefresh from '@prefresh/vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h, Fragment } from 'preact'`,
  },
  plugins: [preactRefresh()],
}

export default config

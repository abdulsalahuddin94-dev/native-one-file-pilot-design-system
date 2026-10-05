import type { StorybookConfig } from '@storybook/react-vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-designs', '@storybook/addon-mcp'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: false },
  core: { disableTelemetry: true },
  // node_modules may be a link to another Storybook's packages: let Vite serve files from its real folder
  viteFinal: async (cfg) => {
    const nm = path.resolve(here, '../node_modules');
    const real = fs.existsSync(nm) ? fs.realpathSync(nm) : nm;
    cfg.server = { ...(cfg.server || {}), fs: { ...(cfg.server?.fs || {}), allow: [...(cfg.server?.fs?.allow || []), path.resolve(here, '..'), real] } };
    return cfg;
  },
};
export default config;

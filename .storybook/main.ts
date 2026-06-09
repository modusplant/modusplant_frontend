import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'node:path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.plugins = [
      ...(config.plugins ?? []),
      {
        name: 'modusplant-storybook-public-post-image-resolver',
        enforce: 'pre',
        resolveId(source) {
          const match = source.match(/image_(0[1-4])\.png(?:\?ignore)?$/);
          if (!match || !source.includes('public')) {
            return null;
          }

          return path.resolve(
            process.cwd(),
            `public/post/image_${match[1]}.png`
          );
        },
      },
    ];

    return config;
  },
};
export default config;

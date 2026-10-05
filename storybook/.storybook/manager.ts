import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Native One File Pilot - Mobile Adaptive Design System',
    brandUrl: 'https://www.figma.com/design/a2EAdCeKeaXN679TMNlIev',
    colorPrimary: '#A36600',
    colorSecondary: '#A36600',
  }),
  sidebar: { showRoots: true },
});

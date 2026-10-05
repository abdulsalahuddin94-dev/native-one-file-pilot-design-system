import type { Preview } from '@storybook/react-vite';
import '../src/tokens/tokens.css';
import '../src/styles/text-styles.css';
import '../src/styles/effects.css';
import '../src/styles/components.css';
import { modeGlobalTypes, modeInitialGlobals, withModes, ModesDocsContainer } from '../src/docs/Modes';

// Toolbars are generated from the Figma variable collections with more than one mode, with the exact Figma names:
// Platform (OS: iOS / Android), Color (Light / Dark), Language (EN / AR). Stories and docs pages follow them.
const preview: Preview = {
  decorators: [withModes as any],
  globalTypes: modeGlobalTypes,
  initialGlobals: modeInitialGlobals,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'none' },
    backgrounds: { disable: true },
    docs: { container: ModesDocsContainer },
    options: {
      storySort: {
        order: [
          'Welcome',
          'Foundations', ['Colors', 'Typography', 'Sizing', 'Effects', 'Icons', 'Code'],
          'Form Elements', ['Toggle', 'Checkbox', 'Text Field'],
          'Navigation', ['Button', 'Icon Button', 'Segment', 'Segmented Control', 'Top App Bar'],
          'Data Display', ['List Item'],
          'Patterns',
        ],
      },
    },
    a11y: { test: 'todo' },
  },
};
export default preview;

// Patterns - the Figma "Pattern/Settings Screen" (page ➜ Settings), assembled only from the DS components with the
// same instance overrides as Figma. One screen: the Platform, Color and Language switches turn it into iOS / Android,
// Light / Dark and EN / AR, exactly like the mode frames in Figma.
import React from 'react';
import { TopAppBar, SegmentedControl, Button } from './Navigation';
import { TextField } from './FormElements';
import { ListItem } from './DataDisplay';

export type SettingsScreenProps = Record<string, never>;
export function SettingsScreen(_: SettingsScreenProps) {
  return (
    <div className="screen">
      <TopAppBar Title="Settings" {...{ 'Large Title': true, 'Show Action': false, 'Show Inline Title': false, 'Show Back': false }} />
      <div className="screen__section screen__pad" style={{ gap: 'var(--spacing-section-gap)' }}>
        <TextField Label="Display name" Value="Abdul" {...{ 'Leading Icon': true, 'Leading Icon Swap': 'Icon/Person' }} />
        <SegmentedControl labels={['Light', 'Dark', 'Auto', 'Year']} {...{ 'Show Segment 3': true, 'Show Segment 4': false }} />
      </div>
      <section className="screen__section">
        <div className="screen__caption ts-footnote">Preferences</div>
        <div className="list-group">
          <ListItem Title="Notifications" Trailing="Toggle" {...{ 'Leading Icon Swap': 'Icon/Notifications' }} />
          <ListItem Title="Dark mode" Trailing="Toggle" on={false} {...{ 'Leading Icon Swap': 'Icon/Moon' }} />
          <ListItem Title="Language" Trailing="Value" Value="English" {...{ 'Leading Icon Swap': 'Icon/Globe', 'Show Separator': false }} />
        </div>
      </section>
      <section className="screen__section">
        <div className="screen__caption ts-footnote">Account</div>
        <div className="list-group">
          <ListItem Title="Profile" Trailing="Chevron" {...{ 'Leading Icon Swap': 'Icon/Person' }} />
          <ListItem Title="Privacy" Trailing="Chevron" {...{ 'Leading Icon Swap': 'Icon/Lock', 'Show Separator': false }} />
        </div>
      </section>
      <div className="screen__pad" style={{ display: 'flex' }}>
        <div style={{ flex: 1, display: 'flex' }} className="screen__full-btn"><Button Label="Save changes" /></div>
      </div>
    </div>
  );
}

// ⭐Data Display - working replica of the Native One File Pilot List Item. Props use the Figma property and variant
// names exactly, with the Figma defaults. The chevron and the inset separator are iOS-only parts (Figma visibility
// bound to Platform/Is iOS); Android uses the whole row as the target. RTL mirrors through dir.
import React from 'react';
import { Icon } from '../lib/Icon';
import { useFlag } from './Navigation';
import { Toggle, Checkbox } from './FormElements';

export type ListItemProps = {
  Trailing?: 'Chevron' | 'Value' | 'Toggle' | 'Checkbox' | 'None';
  Title?: string; 'Supporting Text'?: string; 'Show Supporting Text'?: boolean; Value?: string;
  'Leading Icon'?: boolean; 'Leading Icon Swap'?: string; 'Show Separator'?: boolean;
  on?: boolean; onClick?: () => void;
};
export function ListItem({
  Trailing = 'Chevron', Title = 'Title', 'Supporting Text': support = 'Supporting text', 'Show Supporting Text': showSupport = false,
  Value = 'English', 'Leading Icon': leading = true, 'Leading Icon Swap': leadingIcon = 'Icon/Settings', 'Show Separator': separator = true, on, onClick,
}: ListItemProps) {
  const ios = useFlag('Platform/Is iOS');
  const navigates = Trailing === 'Chevron' || Trailing === 'Value';
  const body = (
    <>
      {leading && <Icon name={leadingIcon} />}
      <span className="list-item__text">
        <span className="list-item__title ts-body">{Title}</span>
        {showSupport && <span className="list-item__support ts-subhead">{support}</span>}
      </span>
      {Trailing === 'Value' && <span className="list-item__value ts-body">{Value}</span>}
      {navigates && ios && <span className="list-item__chevron"><Icon name="Icon/Chevron Right" /></span>}
      {Trailing === 'Toggle' && <Toggle Value={on === false ? 'Off' : 'On'} label={Title} />}
      {Trailing === 'Checkbox' && <Checkbox Value={on === false ? 'Unchecked' : 'Checked'} label={Title} />}
    </>
  );
  return (
    <div className="list-item">
      {navigates ? <button type="button" className="list-item__row" onClick={onClick}>{body}</button> : <div className="list-item__row">{body}</div>}
      {/* Separator Container: visible on Platform/Is iOS; the line follows Show Separator */}
      {ios && separator && <div className="list-item__sep"><span /></div>}
    </div>
  );
}

/** In use: a settings group, rows stacked with no gap, the last row without a separator. */
export function ListGroupInUse() {
  return (
    <div className="screen-surface flush" style={{ paddingBlock: 'var(--spacing-section-gap)' }}>
      <div className="list-group">
        <ListItem Title="Notifications" Trailing="Toggle" {...{ 'Leading Icon Swap': 'Icon/Notifications' }} />
        <ListItem Title="Dark mode" Trailing="Toggle" on={false} {...{ 'Leading Icon Swap': 'Icon/Moon' }} />
        <ListItem Title="Language" Trailing="Value" Value="English" {...{ 'Leading Icon Swap': 'Icon/Globe' }} />
        <ListItem Title="Privacy" Trailing="Chevron" {...{ 'Leading Icon Swap': 'Icon/Lock', 'Show Separator': false }} />
      </div>
    </div>
  );
}

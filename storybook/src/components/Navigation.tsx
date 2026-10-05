// ⭐Navigation - working replicas of the Native One File Pilot Figma components. Props use the Figma property and
// variant names exactly, with the Figma defaults. One component per Figma component: the iOS or Android look comes
// from the OS mode (Platform toolbar), never from a platform prop - the same rule as the Figma file.
import React from 'react';
import { Icon } from '../lib/Icon';
import { isTrue, useToken } from '../docs/Modes';

/** Figma visibility bound to a boolean variable (Platform/Is iOS, Platform/Is Android). */
export const useFlag = (name: string) => isTrue(useToken(name));

// ---------- Button (Atom) ----------
export type ButtonProps = {
  Variant?: 'Primary' | 'Secondary' | 'Text'; State?: 'Default' | 'Pressed' | 'Disabled';
  Label?: string; 'Leading Icon'?: boolean; Icon?: string; onClick?: () => void;
};
export function Button({ Variant = 'Primary', State = 'Default', Label = 'Button', 'Leading Icon': leading = false, Icon: icon = 'Icon/Check', onClick }: ButtonProps) {
  return (
    <button type="button" className="btn ts-button-label" data-variant={Variant} data-state={State} disabled={State === 'Disabled'} onClick={onClick}>
      {leading && <Icon name={icon} />}
      <span>{Label}</span>
    </button>
  );
}

// ---------- Icon Button (Atom) ----------
export type IconButtonProps = { Variant?: 'Standard' | 'Filled'; State?: 'Default' | 'Pressed' | 'Disabled'; Icon?: string; label?: string; onClick?: () => void };
export function IconButton({ Variant = 'Standard', State = 'Default', Icon: icon = 'Icon/Settings', label, onClick }: IconButtonProps) {
  return (
    <button type="button" className="icon-btn" data-variant={Variant} data-state={State} disabled={State === 'Disabled'} aria-label={label || icon.replace(/^Icon\//, '')} onClick={onClick}>
      <Icon name={icon} />
    </button>
  );
}

// ---------- Segment (Atom, only inside Segmented Control) ----------
export type SegmentProps = { Selected?: 'Yes' | 'No'; Label?: string; onSelect?: () => void; solo?: boolean };
export function Segment({ Selected = 'Yes', Label = 'Segment', onSelect, solo = true }: SegmentProps) {
  const android = useFlag('Platform/Is Android');
  const on = Selected === 'Yes';
  return (
    <button type="button" role="radio" aria-checked={on} className={`segment ts-subhead${solo ? ' segment-solo' : ''}`} onClick={onSelect}>
      {/* Selected Icon: visible on Platform/Is Android (M3 selected check), hidden on iOS */}
      {on && android && <Icon name="Icon/Check" />}
      <span>{Label}</span>
    </button>
  );
}

// ---------- Segmented Control (Molecule) ----------
export type SegmentedControlProps = { 'Show Segment 3'?: boolean; 'Show Segment 4'?: boolean; labels?: string[]; selected?: number; onChange?: (i: number) => void };
export function SegmentedControl({ 'Show Segment 3': s3 = true, 'Show Segment 4': s4 = false, labels = ['Segment', 'Segment', 'Segment', 'Segment'], selected = 0, onChange }: SegmentedControlProps) {
  const [value, setValue] = React.useState(selected);
  React.useEffect(() => setValue(selected), [selected]);
  const shown = [true, true, s3, s4];
  return (
    <div className="segmented" role="radiogroup">
      {labels.map((l, i) => shown[i] && (
        <Segment key={i} solo={false} Label={l} Selected={value === i ? 'Yes' : 'No'} onSelect={() => { setValue(i); onChange?.(i); }} />
      ))}
    </div>
  );
}
export function SegmentedControlInUse() {
  const [i, setI] = React.useState(0);
  const views = ['Day', 'Week', 'Month'];
  return (
    <div className="screen-surface sb-col" style={{ gap: 'var(--spacing-stack-gap)' }}>
      <SegmentedControl labels={views} selected={i} onChange={setI} />
      <div className="ts-subhead" style={{ color: 'var(--label-secondary)' }}>Showing: {views[i]}</div>
    </div>
  );
}

// ---------- Top App Bar (Organism) ----------
// Figma: a wrapper around the private set _Top App Bar Platform, whose Platform variant is bound to OS::Platform/Name.
export type TopAppBarProps = {
  Title?: string; 'Show Back'?: boolean; 'Back Label'?: string; 'Show Action'?: boolean; 'Large Title'?: boolean; 'Show Inline Title'?: boolean;
  Action?: string;
};
export function TopAppBar({ Title = 'Title', 'Show Back': showBack = true, 'Back Label': backLabel = 'Back', 'Show Action': showAction = true, 'Large Title': large = false, 'Show Inline Title': inline = true, Action = 'Icon/Settings' }: TopAppBarProps) {
  const platform = String(useToken('Platform/Name') || 'iOS');
  if (platform === 'Android') {
    return (
      <header className="top-bar" data-platform="Android">
        <div className="top-bar__bar">
          {showBack && <IconButton Icon="Icon/Back" label="Back" />}
          <div className="top-bar__title-android ts-title">{Title}</div>
          {showAction && <IconButton Icon={Action} />}
        </div>
      </header>
    );
  }
  return (
    <header className="top-bar" data-platform="iOS">
      <div className="top-bar__bar">
        <div className="top-bar__start">
          {showBack && (
            <button type="button" className="top-bar__back ts-body"><Icon name="Icon/Back" /><span>{backLabel}</span></button>
          )}
        </div>
        {inline && <div className="top-bar__title-ios ts-headline">{Title}</div>}
        <div className="top-bar__end">{showAction && <IconButton Icon={Action} />}</div>
      </div>
      {large && <div className="top-bar__large ts-large-title">{Title}</div>}
    </header>
  );
}

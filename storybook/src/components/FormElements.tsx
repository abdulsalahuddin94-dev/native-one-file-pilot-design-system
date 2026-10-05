// ⭐Form Elements - working replicas of the Native One File Pilot Figma components. Props use the Figma property and
// variant names exactly, with the Figma defaults. Toggling, checking and typing work; State forces a Figma state.
import React from 'react';
import { Icon } from '../lib/Icon';
import { useFlag } from './Navigation';

// ---------- Toggle (Atom) ----------
export type ToggleProps = { Value?: 'On' | 'Off'; State?: 'Default' | 'Disabled'; label?: string; onChange?: (on: boolean) => void };
export function Toggle({ Value = 'On', State = 'Default', label = 'Setting', onChange }: ToggleProps) {
  const [on, setOn] = React.useState(Value === 'On');
  React.useEffect(() => setOn(Value === 'On'), [Value]);
  return (
    <button
      type="button" role="switch" aria-checked={on} aria-label={label} className="toggle" data-state={State} disabled={State === 'Disabled'}
      onClick={() => { setOn(!on); onChange?.(!on); }}
    >
      <span className="toggle__thumb" />
    </button>
  );
}

// ---------- Checkbox (Atom) ----------
export type CheckboxProps = { Value?: 'Checked' | 'Unchecked'; State?: 'Default' | 'Disabled'; label?: string; onChange?: (checked: boolean) => void };
export function Checkbox({ Value = 'Checked', State = 'Default', label = 'Option', onChange }: CheckboxProps) {
  const [on, setOn] = React.useState(Value === 'Checked');
  React.useEffect(() => setOn(Value === 'Checked'), [Value]);
  return (
    <button
      type="button" role="checkbox" aria-checked={on} aria-label={label} className="checkbox" data-state={State} disabled={State === 'Disabled'}
      onClick={() => { setOn(!on); onChange?.(!on); }}
    >
      {on && <Icon name="Icon/Check" size={undefined} />}
    </button>
  );
}

// ---------- Text Field (Molecule) ----------
export type TextFieldProps = {
  State?: 'Default' | 'Focused' | 'Error' | 'Disabled';
  Label?: string; Value?: string; 'Helper Text'?: string; 'Show Helper Text'?: boolean;
  'Leading Icon'?: boolean; 'Leading Icon Swap'?: string; 'Trailing Icon'?: boolean; 'Trailing Icon Swap'?: string;
};
export function TextField({
  State = 'Default', Label = 'Display name', Value = 'Abdul', 'Helper Text': helper = 'Shown on your profile', 'Show Helper Text': showHelper = true,
  'Leading Icon': leading = false, 'Leading Icon Swap': leadingIcon = 'Icon/Person', 'Trailing Icon': trailing = true, 'Trailing Icon Swap': trailingIcon = 'Icon/Close',
}: TextFieldProps) {
  const ios = useFlag('Platform/Is iOS');
  const android = useFlag('Platform/Is Android');
  const [value, setValue] = React.useState(Value);
  React.useEffect(() => setValue(Value), [Value]);
  const id = React.useId();
  return (
    <div className="field" data-state={State}>
      {/* Label Row: visible on Platform/Is iOS (label above the field) */}
      {ios && <label htmlFor={id} className="field__label ts-footnote">{Label}</label>}
      <div className="field__box">
        {/* Floating Label: visible on Platform/Is Android (label on the outline) */}
        {android && <label htmlFor={id} className="field__floating ts-caption">{Label}</label>}
        {leading && <Icon name={leadingIcon} />}
        <input id={id} className="field__input ts-body" value={value} disabled={State === 'Disabled'} aria-invalid={State === 'Error' || undefined} onChange={(e) => setValue(e.target.value)} />
        {trailing && (
          <button type="button" className="field__clear" aria-label="Clear" disabled={State === 'Disabled'} onClick={() => setValue('')}><Icon name={trailingIcon} /></button>
        )}
      </div>
      {showHelper && <div className="field__helper ts-footnote">{helper}</div>}
    </div>
  );
}

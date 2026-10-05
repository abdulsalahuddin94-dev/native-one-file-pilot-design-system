"""Pilot token spec -> data/source/tokens-spec.json and figma/01_variables.figma.js.
Run from the Root: python "My Projects/Native_One_File_Pilot/data/source/build_spec.py"
"""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
PROJ = HERE.parent.parent
AR_FONT = 'Noto Sans Arabic'  # Abdul 2026-10-05 (IBM Plex Sans Arabic not installed)
ramp = json.loads((HERE / 'brand-ramp.json').read_text())['ramp']


def camel(s):
    parts = s.replace('/', ' ').replace('-', ' ').split()
    return parts[0].lower() + ''.join(p[:1].upper() + p[1:] for p in parts[1:])


# ---------- Primitives (one mode) ----------
NEUTRAL = {'0': '#FFFFFF', '50': '#F2F2F7', '100': '#E5E5EA', '200': '#D1D1D6', '300': '#C7C7CC', '400': '#AEAEB2',
           '500': '#8E8E93', '600': '#636366', '700': '#48484A', '800': '#3A3A3C', '850': '#2C2C2E', '900': '#1C1C1E',
           '950': '#111113', '1000': '#000000'}
RED = {'50': '#FEF2F2', '400': '#F87171', '600': '#DC2626', '700': '#B91C1C'}
GREEN = {'50': '#F0FDF4', '400': '#4ADE80', '600': '#16A34A', '700': '#15803D'}
prims = []
for k, v in ramp.items():
    prims.append({'name': f'Color/Brand/{k}', 'type': 'COLOR', 'value': v})
for k, v in NEUTRAL.items():
    prims.append({'name': f'Color/Neutral/{k}', 'type': 'COLOR', 'value': v})
for k, v in RED.items():
    prims.append({'name': f'Color/Red/{k}', 'type': 'COLOR', 'value': v})
for k, v in GREEN.items():
    prims.append({'name': f'Color/Green/{k}', 'type': 'COLOR', 'value': v})
prims += [{'name': 'Color/Black Alpha/20', 'type': 'COLOR', 'value': '#000000', 'alpha': 0.2},
          {'name': 'Color/Black Alpha/40', 'type': 'COLOR', 'value': '#000000', 'alpha': 0.4},
          {'name': 'Color/Transparent', 'type': 'COLOR', 'value': '#000000', 'alpha': 0}]
NUMS = [0, 1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 16, 18, 20, 22, 24, 27, 28, 31, 32, 35, 36, 40, 44, 48, 50, 51, 52, 56, 64, 999]
for n in NUMS:
    prims.append({'name': f'Number/{n}', 'type': 'FLOAT', 'value': n})
for p in prims:
    p['scopes'] = []

# ---------- Color (Light, Dark) ----------
# name: (light, dark, scopes, iOS code, Android code)
BG = ['FRAME_FILL', 'SHAPE_FILL']
TX = ['TEXT_FILL']
ST = ['STROKE_COLOR']
IC = ['SHAPE_FILL', 'STROKE_COLOR']
SEM = {
    'Background/Primary': ('Neutral/0', 'Neutral/1000', BG, 'Color(.systemBackground)', 'MaterialTheme.colorScheme.surface'),
    'Background/Grouped': ('Neutral/50', 'Neutral/1000', BG, 'Color(.systemGroupedBackground)', 'MaterialTheme.colorScheme.surfaceContainerLowest'),
    'Background/Elevated': ('Neutral/0', 'Neutral/900', BG, 'Color(.secondarySystemGroupedBackground)', 'MaterialTheme.colorScheme.surfaceContainerLow'),
    'Surface/Container': ('Neutral/50', 'Neutral/900', BG, 'Color(.secondarySystemBackground)', 'MaterialTheme.colorScheme.surfaceContainer'),
    'Surface/Container High': ('Neutral/100', 'Neutral/850', BG, 'Color(.tertiarySystemBackground)', 'MaterialTheme.colorScheme.surfaceContainerHigh'),
    'Label/Primary': ('Neutral/1000', 'Neutral/0', TX, 'Color(.label)', 'MaterialTheme.colorScheme.onSurface'),
    'Label/Secondary': ('Neutral/600', 'Neutral/400', TX, 'Color(.secondaryLabel)', 'MaterialTheme.colorScheme.onSurfaceVariant'),
    'Label/Tertiary': ('Neutral/500', 'Neutral/500', TX, 'Color(.tertiaryLabel)', 'MaterialTheme.colorScheme.outline'),
    'Label/Disabled': ('Neutral/300', 'Neutral/700', TX, 'Color(.quaternaryLabel)', 'MaterialTheme.colorScheme.onSurface.copy(alpha = 0.38f)'),
    'Label/On Accent': ('Neutral/950', 'Neutral/950', TX, 'Color("OnAccent")', 'MaterialTheme.colorScheme.onPrimary'),
    'Label/Accent': ('Brand/700', 'Brand/400', TX, 'Color.accentColor', 'MaterialTheme.colorScheme.primary'),
    'Label/Error': ('Red/700', 'Red/400', TX, 'Color(.systemRed)', 'MaterialTheme.colorScheme.error'),
    'Fill/Accent': ('Brand/400', 'Brand/400', BG, 'Color("AccentFill")', 'MaterialTheme.colorScheme.primaryContainer'),
    'Fill/Accent Pressed': ('Brand/500', 'Brand/300', BG, 'Color("AccentFillPressed")', 'MaterialTheme.colorScheme.primaryContainer'),
    'Fill/Secondary': ('Neutral/100', 'Neutral/850', BG, 'Color(.secondarySystemFill)', 'MaterialTheme.colorScheme.secondaryContainer'),
    'Fill/Secondary Pressed': ('Neutral/200', 'Neutral/800', BG, 'Color(.systemFill)', 'MaterialTheme.colorScheme.secondaryContainer'),
    'Fill/Disabled': ('Neutral/100', 'Neutral/850', BG, 'Color(.quaternarySystemFill)', 'MaterialTheme.colorScheme.onSurface.copy(alpha = 0.12f)'),
    'Fill/Track Off': ('Neutral/100', 'Neutral/800', BG, 'Color(.systemFill)', 'MaterialTheme.colorScheme.surfaceContainerHighest'),
    'Fill/Thumb': ('Neutral/0', 'Neutral/0', BG, 'Color.white', 'MaterialTheme.colorScheme.onPrimary'),
    'Fill/Thumb Off': ('Neutral/500', 'Neutral/500', BG, 'Color.white', 'MaterialTheme.colorScheme.outline'),
    'Fill/On Accent': ('Neutral/950', 'Neutral/950', BG, 'Color("OnAccent")', 'MaterialTheme.colorScheme.onPrimaryContainer'),
    'Fill/Accent Subtle': ('Brand/100', 'Brand/900', BG, 'Color.accentColor.opacity(0.15)', 'MaterialTheme.colorScheme.secondaryContainer'),
    'Fill/Transparent': ('Transparent', 'Transparent', BG, 'Color.clear', 'Color.Transparent'),
    'Fill/Segment Selected': ('Neutral/0', 'Neutral/700', BG, 'Color(.systemBackground)', 'MaterialTheme.colorScheme.secondaryContainer'),
    'Icon/Primary': ('Neutral/1000', 'Neutral/0', IC, 'Color(.label)', 'MaterialTheme.colorScheme.onSurface'),
    'Icon/Secondary': ('Neutral/500', 'Neutral/500', IC, 'Color(.secondaryLabel)', 'MaterialTheme.colorScheme.onSurfaceVariant'),
    'Icon/Accent': ('Brand/700', 'Brand/400', IC, 'Color.accentColor', 'MaterialTheme.colorScheme.primary'),
    'Icon/On Accent': ('Neutral/950', 'Neutral/950', IC, 'Color("OnAccent")', 'MaterialTheme.colorScheme.onPrimaryContainer'),
    'Icon/Disabled': ('Neutral/300', 'Neutral/700', IC, 'Color(.quaternaryLabel)', 'MaterialTheme.colorScheme.onSurface.copy(alpha = 0.38f)'),
    'Border/Default': ('Neutral/200', 'Neutral/700', ST, 'Color(.separator)', 'MaterialTheme.colorScheme.outlineVariant'),
    'Border/Strong': ('Neutral/500', 'Neutral/500', ST, 'Color(.opaqueSeparator)', 'MaterialTheme.colorScheme.outline'),
    'Border/Focus': ('Brand/700', 'Brand/400', ST, 'Color.accentColor', 'MaterialTheme.colorScheme.primary'),
    'Border/Error': ('Red/600', 'Red/400', ST, 'Color(.systemRed)', 'MaterialTheme.colorScheme.error'),
    'Separator/Default': ('Neutral/200', 'Neutral/800', ST + ['FRAME_FILL', 'SHAPE_FILL'], 'Color(.separator)', 'MaterialTheme.colorScheme.outlineVariant'),
    'Shadow/Default': ('Black Alpha/20', 'Black Alpha/40', ['EFFECT_COLOR'], 'Color.black.opacity(0.2)', 'MaterialTheme.colorScheme.shadow'),
    'Shadow/None': ('Transparent', 'Transparent', ['EFFECT_COLOR'], 'Color.clear', 'Color.Transparent'),
}
color = [{'name': k, 'type': 'COLOR', 'modes': {'Light': 'Color/' + v[0], 'Dark': 'Color/' + v[1]}, 'scopes': v[2],
          'code': {'iOS': v[3], 'ANDROID': v[4]}} for k, v in SEM.items()]

# ---------- Language (EN, AR) ----------
IOS_TYPE = {'Large Title': 34, 'Title 2': 22, 'Headline': 17, 'Body': 17, 'Subheadline': 15, 'Footnote': 13, 'Caption 1': 12}
IOS_LH = {'Large Title': 41, 'Title 2': 28, 'Headline': 22, 'Body': 22, 'Subheadline': 20, 'Footnote': 18, 'Caption 1': 16}
AND_TYPE = {'Headline Small': (24, 32), 'Title Large': (22, 28), 'Title Medium': (16, 24), 'Body Large': (16, 24),
            'Body Medium': (14, 20), 'Label Large': (14, 20), 'Body Small': (12, 16), 'Label Small': (11, 16)}
lang = [
    {'name': 'Font Family/iOS', 'type': 'STRING', 'modes': {'EN': 'SF Pro', 'AR': AR_FONT}, 'scopes': ['FONT_FAMILY'],
     'code': {'iOS': 'Font.Design.default', 'ANDROID': '-'}},
    {'name': 'Font Family/Android', 'type': 'STRING', 'modes': {'EN': 'Roboto', 'AR': AR_FONT}, 'scopes': ['FONT_FAMILY'],
     'code': {'iOS': '-', 'ANDROID': 'FontFamily.Default'}},
]


def ar_lh(size, lh):
    return max(lh, round(size * 1.5 / 2) * 2)


for r, s in IOS_TYPE.items():
    lang.append({'name': f'iOS/{r}/Size', 'type': 'FLOAT', 'modes': {'EN': s, 'AR': s}, 'scopes': ['FONT_SIZE'],
                 'code': {'iOS': f'Font.TextStyle.{camel(r)}', 'ANDROID': '-'}})
    lang.append({'name': f'iOS/{r}/Line Height', 'type': 'FLOAT', 'modes': {'EN': IOS_LH[r], 'AR': ar_lh(s, IOS_LH[r])},
                 'scopes': ['LINE_HEIGHT'], 'code': {'iOS': f'Font.TextStyle.{camel(r)}.lineHeight', 'ANDROID': '-'}})
for r, (s, lh) in AND_TYPE.items():
    k = r.lower().replace(' ', '-')
    lang.append({'name': f'Android/{r}/Size', 'type': 'FLOAT', 'modes': {'EN': s, 'AR': s}, 'scopes': ['FONT_SIZE'],
                 'code': {'iOS': '-', 'ANDROID': f'md.sys.typescale.{k}.size'}})
    lang.append({'name': f'Android/{r}/Line Height', 'type': 'FLOAT', 'modes': {'EN': lh, 'AR': ar_lh(s, lh)},
                 'scopes': ['LINE_HEIGHT'], 'code': {'iOS': '-', 'ANDROID': f'md.sys.typescale.{k}.line-height'}})
lang += [
    {'name': 'Direction/Is LTR', 'type': 'BOOLEAN', 'modes': {'EN': True, 'AR': False}, 'scopes': [],
     'code': {'iOS': 'layoutDirection == .leftToRight', 'ANDROID': 'LocalLayoutDirection.current == LayoutDirection.Ltr'}},
    {'name': 'Direction/Is RTL', 'type': 'BOOLEAN', 'modes': {'EN': False, 'AR': True}, 'scopes': [],
     'code': {'iOS': 'layoutDirection == .rightToLeft', 'ANDROID': 'LocalLayoutDirection.current == LayoutDirection.Rtl'}},
]
for v in lang:
    if v['type'] == 'FLOAT':
        v['scopes'] = []  # type primitives: only the OS tokens are pickable

# ---------- OS (iOS, Android) ----------
# Type roles: (iOS role, Android role, weight iOS, weight Android)
ROLES = {
    'Large Title': ('Large Title', 'Headline Small', 700, 400),
    'Title': ('Title 2', 'Title Large', 700, 400),
    'Headline': ('Headline', 'Title Medium', 600, 500),
    'Body': ('Body', 'Body Large', 400, 400),
    'Subhead': ('Subheadline', 'Body Medium', 400, 400),
    'Footnote': ('Footnote', 'Body Small', 400, 400),
    'Caption': ('Caption 1', 'Label Small', 400, 500),
    'Button Label': ('Headline', 'Label Large', 600, 500),
}
os_vars = [
    {'name': 'Platform/Is iOS', 'type': 'BOOLEAN', 'modes': {'iOS': True, 'Android': False}, 'scopes': [],
     'code': {'iOS': 'true', 'ANDROID': 'false'}},
    {'name': 'Platform/Is Android', 'type': 'BOOLEAN', 'modes': {'iOS': False, 'Android': True}, 'scopes': [],
     'code': {'iOS': 'false', 'ANDROID': 'true'}},
    {'name': 'Platform/Name', 'type': 'STRING', 'modes': {'iOS': 'iOS', 'Android': 'Android'}, 'scopes': [],
     'code': {'iOS': 'iOS', 'ANDROID': 'Android'}},
    {'name': 'Font Family', 'type': 'STRING', 'modes': {'iOS': '@Language:Font Family/iOS', 'Android': '@Language:Font Family/Android'},
     'scopes': ['FONT_FAMILY'], 'code': {'iOS': 'Font.system', 'ANDROID': 'md.sys.typescale.font'}},
]
for role, (ir, ar, iw, aw) in ROLES.items():
    ik, ak = camel(ir), ar.lower().replace(' ', '-')
    os_vars.append({'name': f'Font Size/{role}', 'type': 'FLOAT',
                    'modes': {'iOS': f'@Language:iOS/{ir}/Size', 'Android': f'@Language:Android/{ar}/Size'},
                    'scopes': ['FONT_SIZE'], 'code': {'iOS': f'.font(.{ik})', 'ANDROID': f'md.sys.typescale.{ak}.size'}})
    os_vars.append({'name': f'Line Height/{role}', 'type': 'FLOAT',
                    'modes': {'iOS': f'@Language:iOS/{ir}/Line Height', 'Android': f'@Language:Android/{ar}/Line Height'},
                    'scopes': ['LINE_HEIGHT'], 'code': {'iOS': f'Font.TextStyle.{ik}.lineHeight', 'ANDROID': f'md.sys.typescale.{ak}.line-height'}})
    os_vars.append({'name': f'Font Weight/{role}', 'type': 'FLOAT', 'modes': {'iOS': iw, 'Android': aw},
                    'scopes': ['FONT_WEIGHT'], 'code': {'iOS': f'Font.Weight({iw})', 'ANDROID': f'md.sys.typescale.{ak}.weight'}})


def num(name, i, a, scopes, ic, ac):
    os_vars.append({'name': name, 'type': 'FLOAT', 'modes': {'iOS': f'@Primitives:Number/{i}', 'Android': f'@Primitives:Number/{a}'},
                    'scopes': scopes, 'code': {'iOS': ic, 'ANDROID': ac}})


GAP, PAD, RAD, WH = ['GAP'], ['GAP'], ['CORNER_RADIUS'], ['WIDTH_HEIGHT']
num('Spacing/Screen Margin', 16, 16, GAP, 'Spacing.screenMargin', 'Spacing.ScreenMargin')
num('Spacing/Stack Gap', 8, 8, GAP, 'Spacing.stack', 'Spacing.Stack')
num('Spacing/Inline Gap', 12, 16, GAP, 'Spacing.inline', 'Spacing.Inline')
num('Spacing/Section Gap', 35, 24, GAP, 'Spacing.section', 'Spacing.Section')
num('Spacing/List Item Padding X', 16, 16, PAD, 'Spacing.listItemX', 'Spacing.ListItemX')
num('Spacing/List Item Padding Y', 11, 12, PAD, 'Spacing.listItemY', 'Spacing.ListItemY')
num('Spacing/Button Padding X', 20, 24, PAD, 'Spacing.buttonX', 'Spacing.ButtonX')
num('Spacing/Field Padding X', 16, 16, PAD, 'Spacing.fieldX', 'Spacing.FieldX')
num('Radius/Button', 12, 999, RAD, 'Radius.button', 'MaterialTheme.shapes.extraLarge')
num('Spacing/List Inset', 16, 0, GAP, 'Spacing.listInset', 'Spacing.ListInset')
num('Radius/List Group', 10, 0, RAD, 'Radius.listGroup', 'RectangleShape')
num('Spacing/Bar Padding X', 8, 4, GAP, 'Spacing.barX', 'TopAppBarDefaults.ContentPadding')
num('Spacing/Bar Title Inset', 0, 12, GAP, 'Spacing.barTitleInset', 'TopAppBarDefaults.TitleInset')
num('Spacing/Tight', 2, 2, GAP, 'Spacing.tight', 'Spacing.Tight')
num('Spacing/Label Padding', 4, 4, GAP, 'Spacing.labelPadding', 'OutlinedTextFieldDefaults.LabelPadding')
num('Radius/Card', 10, 12, RAD, 'Radius.card', 'MaterialTheme.shapes.medium')
num('Radius/Field', 10, 4, RAD, 'Radius.field', 'MaterialTheme.shapes.extraSmall')
num('Height/Button', 50, 40, WH, 'Size.button', 'ButtonDefaults.MinHeight')
num('Height/Icon Button', 44, 48, WH, 'Size.iconButton', 'IconButtonDefaults.Size')
num('Height/List Item', 44, 56, WH, 'Size.listItem', 'ListItemDefaults.MinHeight')
num('Height/Text Field', 44, 56, WH, 'Size.textField', 'TextFieldDefaults.MinHeight')
num('Height/Top Bar', 44, 64, WH, 'Size.navigationBar', 'TopAppBarDefaults.TopAppBarExpandedHeight')
num('Size/Icon', 22, 24, WH, 'Size.icon', 'Size.Icon')
num('Segmented Control/Radius Outer', 9, 999, RAD, 'SegmentedControl.radiusOuter', 'SegmentedButtonDefaults.Shape')
num('Segmented Control/Radius Inner', 7, 0, RAD, 'SegmentedControl.radiusInner', 'SegmentedButtonDefaults.Shape')
num('Segmented Control/Height', 32, 40, WH, 'SegmentedControl.height', 'SegmentedButtonDefaults.MinHeight')
num('Segmented Control/Padding', 2, 0, PAD, 'SegmentedControl.padding', 'SegmentedButtonDefaults.Padding')
num('Toggle/Track Width', 51, 52, WH, 'Toggle.trackWidth', 'SwitchDefaults.TrackWidth')
num('Toggle/Track Height', 31, 32, WH, 'Toggle.trackHeight', 'SwitchDefaults.TrackHeight')
num('Toggle/Thumb Size Off', 27, 16, WH, 'Toggle.thumbOff', 'SwitchDefaults.UncheckedThumbDiameter')
num('Toggle/Thumb Size On', 27, 24, WH, 'Toggle.thumbOn', 'SwitchDefaults.CheckedThumbDiameter')
num('Toggle/Track Border', 0, 2, ['STROKE_FLOAT'], 'Toggle.trackBorder', 'SwitchDefaults.TrackOutlineWidth')
num('Toggle/Thumb Inset Off', 2, 8, PAD, 'Toggle.thumbInset', 'SwitchDefaults.UncheckedThumbInset')
num('Toggle/Thumb Inset On', 2, 4, PAD, 'Toggle.thumbInset', 'SwitchDefaults.CheckedThumbInset')
num('Radius/Full', 999, 999, RAD, 'Capsule()', 'CircleShape')
num('Segmented Control/Border', 0, 1, ['STROKE_FLOAT'], 'SegmentedControl.border', 'SegmentedButtonDefaults.BorderWidth')
num('Checkbox/Glyph', 16, 18, WH, 'Checkbox.glyph', 'CheckboxDefaults.IconSize')
num('Checkbox/Size', 22, 18, WH, 'Checkbox.size', 'CheckboxDefaults.Size')
num('Checkbox/Radius', 999, 2, RAD, 'Checkbox.radius', 'CheckboxDefaults.Shape')
for name, i, a, sc, ic, ac in [
    ('Surface/Screen', 'Background/Grouped', 'Background/Primary', BG, 'Color(.systemGroupedBackground)', 'MaterialTheme.colorScheme.surface'),
    ('Surface/List', 'Background/Elevated', 'Background/Primary', BG, 'Color(.secondarySystemGroupedBackground)', 'MaterialTheme.colorScheme.surface'),
    ('Surface/Top Bar', 'Background/Grouped', 'Background/Primary', BG, 'Color(.systemGroupedBackground)', 'MaterialTheme.colorScheme.surface'),
    ('Shadow/Elevation 1', 'Shadow/None', 'Shadow/Default', ['EFFECT_COLOR'], 'Color.clear', 'MaterialTheme.colorScheme.shadow'),
    ('Toggle/Thumb Off', 'Fill/Thumb', 'Fill/Thumb Off', BG, 'Color.white', 'MaterialTheme.colorScheme.outline'),
    ('Toggle/Track Border Color', 'Shadow/None', 'Border/Strong', ST, 'Color.clear', 'MaterialTheme.colorScheme.outline'),
]:
    os_vars.append({'name': name, 'type': 'COLOR', 'modes': {'iOS': f'@Color:{i}', 'Android': f'@Color:{a}'}, 'scopes': sc,
                    'code': {'iOS': ic, 'ANDROID': ac}})

os_vars.append({'name': 'State/Disabled Opacity', 'type': 'FLOAT', 'modes': {'iOS': 40, 'Android': 38}, 'scopes': ['OPACITY'],
                'code': {'iOS': '.opacity(0.4)', 'ANDROID': 'ContentAlpha.disabled (0.38f)'}})
os_vars.append({'name': 'Checkbox/Border', 'type': 'FLOAT', 'modes': {'iOS': 1.5, 'Android': 2}, 'scopes': ['STROKE_FLOAT'],
                'code': {'iOS': 'Checkbox.border', 'ANDROID': 'CheckboxDefaults.StrokeWidth'}})
os_vars.append({'name': 'Text Field/Label Inset', 'type': 'FLOAT', 'modes': {'iOS': '@Primitives:Number/12', 'Android': '@Primitives:Number/12'}, 'scopes': ['GAP'],
                'code': {'iOS': 'TextField.labelInset', 'ANDROID': 'OutlinedTextFieldDefaults.LabelInset'}})
os_vars.append({'name': 'Text Field/Border', 'type': 'FLOAT', 'modes': {'iOS': 0, 'Android': 1}, 'scopes': ['STROKE_FLOAT'],
                'code': {'iOS': 'TextField.border', 'ANDROID': 'OutlinedTextFieldDefaults.UnfocusedBorderThickness'}})
os_vars.append({'name': 'Text Field/Border Focused', 'type': 'FLOAT', 'modes': {'iOS': 0, 'Android': 2}, 'scopes': ['STROKE_FLOAT'],
                'code': {'iOS': 'TextField.borderFocused', 'ANDROID': 'OutlinedTextFieldDefaults.FocusedBorderThickness'}})
for name, i, a, sc, ic, ac in [
    ('Toggle/Thumb On', 'Fill/Thumb', 'Fill/On Accent', BG, 'Color.white', 'MaterialTheme.colorScheme.onPrimaryContainer'),
    ('Segmented Control/Track', 'Fill/Secondary', 'Fill/Transparent', BG, 'Color(.secondarySystemFill)', 'Color.Transparent'),
    ('Segmented Control/Selected Fill', 'Fill/Segment Selected', 'Fill/Accent Subtle', BG, 'Color(.systemBackground)', 'MaterialTheme.colorScheme.secondaryContainer'),
    ('Text Field/Fill', 'Fill/Secondary', 'Fill/Transparent', BG, 'Color(.secondarySystemFill)', 'Color.Transparent'),
]:
    os_vars.append({'name': name, 'type': 'COLOR', 'modes': {'iOS': f'@Color:{i}', 'Android': f'@Color:{a}'}, 'scopes': sc,
                    'code': {'iOS': ic, 'ANDROID': ac}})

# ---------- Component Specific (one mode): aliases OS; OS keeps the raw platform values under Components/ (hidden) ----------
CS = {'Button/Height': 'Height/Button', 'Button/Radius': 'Radius/Button', 'Button/Padding X': 'Spacing/Button Padding X',
      'Icon Button/Size': 'Height/Icon Button', 'Icon/Size': 'Size/Icon',
      'List Item/Min Height': 'Height/List Item', 'List Item/Padding X': 'Spacing/List Item Padding X',
      'List Item/Padding Y': 'Spacing/List Item Padding Y', 'List Item/Fill': 'Surface/List',
      'List Group/Inset': 'Spacing/List Inset', 'List Group/Radius': 'Radius/List Group',
      'Text Field/Height': 'Height/Text Field', 'Text Field/Radius': 'Radius/Field', 'Text Field/Padding X': 'Spacing/Field Padding X',
      'Text Field/Label Padding': 'Spacing/Label Padding',
      'Top App Bar/Height': 'Height/Top Bar', 'Top App Bar/Padding X': 'Spacing/Bar Padding X',
      'Top App Bar/Title Inset': 'Spacing/Bar Title Inset', 'Top App Bar/Fill': 'Surface/Top Bar'}
for v in os_vars:
    if v['name'].split('/')[0] in ('Segmented Control', 'Toggle', 'Checkbox', 'Text Field'):
        CS.setdefault(v['name'], v['name'])
cs_vars, os_by = [], {v['name']: v for v in os_vars}
RENAMES = {}
for cs_name, os_name in CS.items():
    ov = os_by[os_name]
    new = 'Components/' + cs_name
    RENAMES[os_name] = new
    cs_vars.append({'name': cs_name, 'type': ov['type'], 'modes': {'Value': '@OS:' + new}, 'scopes': ov['scopes'], 'code': ov['code']})
    ov['name'] = new
    ov['scopes'] = []
(HERE / 'renames.json').write_text(json.dumps(RENAMES, indent=1))

spec = {'collections': [
    {'name': 'Primitives', 'modes': ['Value'], 'vars': [{**p, 'modes': {'Value': p['value']}} for p in prims]},
    {'name': 'Color', 'modes': ['Light', 'Dark'], 'vars': [{**c, 'modes': {m: '@Primitives:' + r for m, r in c['modes'].items()}} for c in color]},
    {'name': 'Language', 'modes': ['EN', 'AR'], 'vars': lang},
    {'name': 'OS', 'modes': ['iOS', 'Android'], 'vars': os_vars},
    {'name': 'Component Specific', 'modes': ['Value'], 'vars': cs_vars},
]}
(HERE / 'tokens-spec.json').write_text(json.dumps(spec, indent=1))
counts = {c['name']: len(c['vars']) for c in spec['collections']}
print(counts, sum(counts.values()))

js = (HERE / '01_variables.template.js').read_text().replace('__SPEC__', json.dumps(spec))
out = PROJ / 'figma'
out.mkdir(exist_ok=True)
(out / '01_variables.figma.js').write_text(js)

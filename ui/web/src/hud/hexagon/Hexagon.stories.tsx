import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, SurfaceVariant } from '@ui';
import { Text } from '../../typography';
import { Hexagon } from './Hexagon';

const meta = { title: 'Hud/Hexagon', component: Hexagon } satisfies Meta<typeof Hexagon>;
export default meta;
type Story = StoryObj<typeof meta>;

const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const variants: SurfaceVariant[] = ['ghost', 'fill', 'fill-inverse', 'fill-translucent', 'outline', 'inset'];
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 16 } as const;

export const Default: Story = { args: { color: 'primary', variant: 'fill-translucent', size: 'md', children: <Text>Preview</Text> } };

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 24 }}>
            {variants.map((variant) => (
                <section key={variant} style={{ display: 'grid', gap: 10 }}>
                    <strong>{variant}</strong>
                    <div style={gridStyle}>{colors.map((color) => <Hexagon key={color} color={color} variant={variant}><Text>{color}</Text></Hexagon>)}</div>
                </section>
            ))}
        </div>
    ),
};

export const SizesAndShapes: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 24 }}>
            {(['pointy-top', 'flat-top'] as const).map((shape) => (
                <section key={shape} style={{ display: 'grid', gap: 10 }}>
                    <strong>{shape}</strong>
                    <div style={gridStyle}>{(['xs', 'sm', 'md'] as SizeVariant[]).map((size) => <Hexagon key={size} shape={shape} size={size} color="tertiary"><Text>{size}</Text></Hexagon>)}</div>
                </section>
            ))}
            <section style={{ display: 'grid', gap: 10 }}><strong>Stroke width</strong><div style={gridStyle}>{[1, 3, 5].map((strokeWidth) => <Hexagon key={strokeWidth} strokeWidth={strokeWidth} color="primary" style={{ width: 100 }}><Text>{strokeWidth}px</Text></Hexagon>)}</div></section>
        </div>
    ),
};

export const InteractiveGlow: Story = {
    render: () => <div style={gridStyle}><Hexagon interactive color="primary" style={{ width: 100 }}><Text>Default glow</Text></Hexagon><Hexagon interactive glowStyle="glow" color="secondary" style={{ width: 100 }}><Text>Glow</Text></Hexagon><Hexagon interactive glowStyle="animate-borders-glow" color="tertiary" style={{ width: 100 }}><Text>Borders</Text></Hexagon></div>,
};

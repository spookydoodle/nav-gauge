import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SurfaceFillVariant } from '@ui';
import { Text } from '../../typography';
import { BevelPanel } from './BevelPanel';

const meta = { title: 'Hud/BevelPanel', component: BevelPanel } satisfies Meta<typeof BevelPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const variants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 } as const;

export const Default: Story = { args: { color: 'primary', variant: 'fill-translucent', padding: 'md', children: <Text>Preview</Text> } };
export const Variants: Story = { render: () => <div style={{ display: 'grid', gap: 24 }}>{variants.map((variant) => <section key={variant} style={{ display: 'grid', gap: 10 }}><strong>{variant}</strong><div style={gridStyle}>{colors.map((color) => <BevelPanel key={color} color={color} variant={variant} padding="md"><Text>{color}</Text></BevelPanel>)}</div></section>)}</div> };
export const InteractiveGlow: Story = { render: () => <div style={gridStyle}><BevelPanel interactive color="primary" padding="md"><Text>Default glow</Text></BevelPanel><BevelPanel interactive glowStyle="glow" color="secondary" padding="md"><Text>Glow</Text></BevelPanel><BevelPanel interactive glowStyle="animate-borders-glow" color="tertiary" padding="md"><Text>Borders</Text></BevelPanel></div> };

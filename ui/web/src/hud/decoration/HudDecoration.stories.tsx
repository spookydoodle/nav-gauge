import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, GlowStyle, HudDecorationCorner, SizeVariant, TabstripOption } from '@ui';
import { HudDecoration } from './HudDecoration';
import { Panel } from '../panel';
import { Tabstrip } from '../tabstrip';

const options: TabstripOption[] = [
    { value: 'route', label: 'Route' },
    { value: 'terrain', label: 'Terrain' },
];

const meta = { title: 'Hud/HudDecoration' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Brackets: Story = {
    render: () => {
        const [value, setValue] = useState('route');
        return (
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <HudDecoration color="secondary" size="md" glowStyle="glow">
                    <Panel variant="fill-inverse" padding="md">Decorated panel</Panel>
                </HudDecoration>
                <HudDecoration corners={['top-right', 'bottom-left']}>
                    <div style={{ width: 220 }}>
                        <Tabstrip options={options} value={value} onChange={setValue} highlightColor="primary" overflowAccessibilityLabel="More tabs">
                            Active: {value}
                        </Tabstrip>
                    </div>
                </HudDecoration>
            </div>
        );
    },
};

export const AllDecorations: Story = {
    render: () => {
        const corners: HudDecorationCorner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const sizes: SizeVariant[] = ['xs', 'sm', 'md'];
        const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
        const glowStyles: GlowStyle[] = ['none', 'glow', 'animate-borders-glow'];

        return (
            <div style={{ display: 'grid', gap: 24 }}>
                <h2 style={{ margin: 0 }}>Bracket corners</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24 }}>
                    {corners.map((corner) => (
                        <div key={corner} style={{ display: 'grid', gap: 10 }}>
                            <strong>{corner}</strong>
                            <HudDecoration corners={[corner]}>
                                <Panel variant="fill-inverse" padding="sm">Preview</Panel>
                            </HudDecoration>
                        </div>
                    ))}
                </div>
                <h2 style={{ margin: 0 }}>Sizes and colors by glow mode</h2>
                {glowStyles.map((glowStyle) => (
                    <section key={glowStyle} style={{ display: 'grid', gap: 16 }}>
                        <h3 style={{ margin: 0 }}>{glowStyle}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20 }}>
                            {sizes.flatMap((size) => colors.map((color) => (
                                <div key={`${size}-${color}`} style={{ display: 'grid', gap: 10 }}>
                                    <strong>{size} / {color}</strong>
                                    <HudDecoration size={size} color={color} glowStyle={glowStyle} corners={corners}>
                                        <Panel variant="fill-inverse" color={color} padding="sm">Preview</Panel>
                                    </HudDecoration>
                                </div>
                            )))}
                        </div>
                    </section>
                ))}
            </div>
        );
    },
};

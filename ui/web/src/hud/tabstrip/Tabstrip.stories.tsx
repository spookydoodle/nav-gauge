import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, TabstripOption, TabstripVariant } from '@ui';
import { Tabstrip } from './Tabstrip';

const options: TabstripOption[] = [
    { value: 'route', label: 'Route' },
    { value: 'waypoints', label: 'Waypoints' },
    { value: 'terrain', label: 'Terrain' },
    { value: 'weather', label: 'Weather' },
    { value: 'telemetry', label: 'Telemetry' },
    { value: 'export', label: 'Export' },
];

const content: Record<string, string> = {
    route: 'Configure the route line, direction, and playback behavior.',
    waypoints: 'Review waypoint labels and marker visibility.',
    terrain: 'Adjust terrain exaggeration and contour details.',
    weather: 'Inspect wind, cloud, and precipitation overlays.',
    telemetry: 'Monitor speed, elevation, and recording statistics.',
    export: 'Export the finished route story.',
};

const meta = { title: 'Hud/Tabstrip' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {
    render: () => {
        const [value, setValue] = useState('export');
        return (
            <div style={{ width: 260 }}>
                <Tabstrip options={options} value={value} onChange={setValue} highlightColor="primary" overflowAccessibilityLabel="More tabs">
                    {content[value]}
                </Tabstrip>
            </div>
        );
    },
};

export const Spread: Story = {
    render: () => {
        const [value, setValue] = useState('route');
        return (
            <div style={{ width: 420 }}>
                <Tabstrip spread options={options.slice(0, 3)} value={value} onChange={setValue} highlightColor="primary" overflowAccessibilityLabel="More tabs">
                    {content[value]}
                </Tabstrip>
            </div>
        );
    },
};

export const VariantsAndColors: Story = {
    render: () => {
        const [value, setValue] = useState('route');
        const variants: TabstripVariant[] = ['fill-inverse', 'fill-translucent', 'outline'];
        const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
        return (
            <div style={{ display: 'grid', gap: 20 }}>
                {variants.flatMap((variant) => colors.map((color) => (
                    <section key={`${variant}-${color}`}>
                        <h3 style={{ margin: '0 0 6px' }}>{variant}, {color}</h3>
                        <Tabstrip options={options.slice(0, 3)} value={value} onChange={setValue} variant={variant} color={color} highlightColor={color} overflowAccessibilityLabel="More tabs">
                            {content[value]}
                        </Tabstrip>
                    </section>
                )))}
            </div>
        );
    },
};

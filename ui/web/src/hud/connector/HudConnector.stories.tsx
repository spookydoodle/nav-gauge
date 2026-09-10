import { useRef } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { HudDecoration } from '../decoration';
import { Panel } from '../panel';
import { HudConnector } from './HudConnector';

const meta = { title: 'Hud/HudConnector' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Anchors: Story = {
    render: () => {
        const fromRef = useRef<HTMLDivElement>(null);
        const toRef = useRef<HTMLDivElement>(null);
        return (
            <HudConnector fromRef={fromRef} toRef={toRef} fromAnchor="right" toAnchor="left" color="secondary" glowStyle="glow">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 420, padding: 32 }}>
                    <div ref={fromRef}><HudDecoration><Panel variant="fill-inverse" padding="md">Navigation</Panel></HudDecoration></div>
                    <div ref={toRef}><HudDecoration corners={['top-right', 'bottom-left']}><Panel variant="fill-inverse" padding="md">Telemetry</Panel></HudDecoration></div>
                </div>
            </HudConnector>
        );
    },
};

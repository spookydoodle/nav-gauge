import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Button } from '../../button';
import { Text } from '../../typography';
import { NotchedPanel } from './NotchedPanel';

const meta = { title: 'Hud/NotchedPanel', component: NotchedPanel } satisfies Meta<typeof NotchedPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NoHeader: Story = {
    args: { color: 'primary', variant: 'fill-translucent', padding: 'md', children: <Text>Responsive navigation telemetry surface.</Text> },
};

export const Header: Story = {
    args: { color: 'neutral', highlightColor: 'secondary', header: <Text>WARNING</Text>, padding: 'md', children: <Text>Route data contains unresolved segments.</Text> },
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <NotchedPanel color="primary" variant="fill" header={<Text>FILL</Text>} padding="sm"><Text>Primary</Text></NotchedPanel>
            <NotchedPanel color="secondary" variant="fill-inverse" header={<Text>INVERSE</Text>} padding="sm" glowStyle="glow"><Text>Secondary</Text></NotchedPanel>
            <NotchedPanel color="tertiary" variant="fill-translucent" header={<Text>TRANSLUCENT</Text>} padding="sm" glowStyle="animate-borders-glow"><Text>Tertiary</Text></NotchedPanel>
        </div>
    ),
};

export const Confirmation: Story = {
    render: () => (
        <NotchedPanel role="alertdialog" aria-labelledby="notched-confirm-title" color="neutral" highlightColor="primary" header={<Text id="notched-confirm-title">CONFIRM ROUTE DELETION</Text>} padding="md" style={{ maxWidth: 440 }}>
            <Text>This removes the selected route from local storage.</Text>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                <Button variant="ghost">Cancel</Button>
                <Button color="primary" variant="fill">Delete route</Button>
            </div>
        </NotchedPanel>
    ),
};

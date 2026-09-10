import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';

const meta = {
    title: 'Menu',
    component: Menu,
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const colors = ['primary', 'secondary', 'tertiary', 'neutral'] as const;

export const MenuColors: Story = {
    render: () => (
        <div>
            {colors.map((color) => (
                <div key={color}>
                    <p>color="{color}"</p>
                    <div style={{ margin: '0 auto', width: 'max-content' }}>
                        <Menu color={color} triggerAccessibilityLabel="Open menu">
                            <MenuItem key={1} type="button" onClick={() => console.info("Option 1")}>Option 1</MenuItem>
                            <MenuItem key={2} type="button" onClick={() => console.info("Option 2")}>Option 2</MenuItem>
                        </Menu>
                    </div>
                </div>
            ))}
        </div>
    ),
};

export const MenuPlacements: Story = {
    render: () => (
        <div>
            <p>Requested placements flip automatically when a menu would overflow the viewport.</p>
            <p>placement="bottom-right" (default)</p>
            <div style={{ margin: '0 auto', width: 'max-content' }}>
                <Menu placement="bottom-right">
                    <MenuItem key={1} type="button" onClick={() => console.info("Option 1")} >Option 1</MenuItem>
                    <MenuItem key={2} type="button" onClick={() => console.info("Option 2")} >Option 2</MenuItem>
                </Menu>
            </div>

            <p>placement="bottom-left"</p>
            <div style={{ margin: '0 auto', width: 'max-content' }}>
                <Menu placement="bottom-left">
                    <MenuItem key={1} type="button" onClick={() => console.info("Option 1")}>Option 1</MenuItem>
                    <MenuItem key={2} type="button" onClick={() => console.info("Option 2")}>Option 2</MenuItem>
                </Menu>
            </div>

            <p>placement="top-right"</p>
            <div style={{ margin: '0 auto', width: 'max-content' }}>
                <Menu placement="top-right">
                    <MenuItem key={1} type="button" onClick={() => console.info("Option 1")} >Option 1</MenuItem>
                    <MenuItem key={2} type="button" onClick={() => console.info("Option 2")} >Option 2</MenuItem>
                </Menu>
            </div>

            <p>placement="top-left"</p>
            <div style={{ margin: '0 auto', width: 'max-content' }}>
                <Menu placement="top-left">
                    <MenuItem key={1} type="button" onClick={() => console.info("Option 1")} >Option 1</MenuItem>
                    <MenuItem key={2} type="button" onClick={() => console.info("Option 2")} >Option 2</MenuItem>
                </Menu>
            </div>
        </div>
    ),
};

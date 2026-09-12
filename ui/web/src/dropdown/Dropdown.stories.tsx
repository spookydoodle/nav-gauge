import type { Meta } from 'storybook-react-rsbuild';
import { ColorVariant, Icons, SizeVariant, SurfaceFillVariant } from '@ui';
import { Dropdown } from './Dropdown';
import { useState } from 'react';
import { Popup } from '../popup';

const meta = {
    title: 'Dropdown',
    component: Dropdown,
} satisfies Meta<typeof Dropdown>;

export default meta;

const options = [
    { value: 'brass', label: 'Brass Cog', icon: Icons.Beaker },
    { value: 'copper', label: 'Copper Valve', icon: Icons.Beaker },
    { value: 'steam', label: 'Steam Pipe', icon: Icons.Beaker },
    { value: 'gear', label: 'Gear Assembly', icon: Icons.Beaker },
];

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const SelectVariants = {
    render: () => {
        const [size, setSize] = useState<SizeVariant>('md');
        const [color, setColor] = useState<ColorVariant>('neutral');
        const [variant, setVariant] = useState<SurfaceFillVariant>('fill-inverse');
        const [value, setValue] = useState('brass');

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
                <Dropdown<string>
                    ariaLabel="Select material"
                    size={size}
                    color={color}
                    variant={variant}
                    value={value}
                    options={options}
                    onChange={setValue}
                />

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <fieldset>
                        <legend>Size</legend>
                        {allSizes.map(s => (
                            <label key={s} style={{ marginRight: 8 }}>
                                <input type="radio" name="size" checked={size === s} onChange={() => setSize(s)} />
                                {s}
                            </label>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Color</legend>
                        {allColors.map(c => (
                            <label key={c} style={{ marginRight: 8 }}>
                                <input type="radio" name="color" checked={color === c} onChange={() => setColor(c)} />
                                {c}
                            </label>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Variant</legend>
                        {allVariants.map(v => (
                            <label key={v} style={{ marginRight: 8 }}>
                                <input type="radio" name="variant" checked={variant === v} onChange={() => setVariant(v)} />
                                {v}
                            </label>
                        ))}
                    </fieldset>
                </div>
            </div>
        );
    },
};

export const InClippedPopup = {
    render: () => {
        const [value, setValue] = useState('brass');
        return (
            <Popup visible position={{ x: 24, y: 24 }} onClose={() => undefined}>
                <div style={{ width: 240, height: 80, overflow: 'hidden' }}>
                    <Dropdown ariaLabel="Select material" color="primary" highlightColor="tertiary" variant="fill-translucent" value={value} options={options} onChange={setValue} />
                </div>
            </Popup>
        );
    },
};

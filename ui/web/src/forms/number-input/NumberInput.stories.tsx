import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { NumberInput } from './NumberInput';
import { Fieldset } from '../fieldset';
import { Text } from '../../typography';
import { ColorVariant, SizeVariant, SurfaceFillVariant } from '@ui';

const meta = {
    title: 'Forms/NumberInput',
    component: NumberInput,
} satisfies Meta<typeof NumberInput>;

export default meta;

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const NumberInputInteractive = {
    render: () => {
        const [value, setValue] = useState(50);
        const [color, setColor] = useState<ColorVariant>('neutral');
        const [size, setSize] = useState<SizeVariant>('sm');
        const [variant, setVariant] = useState<SurfaceFillVariant>('fill-inverse');
        const [disabled, setDisabled] = useState(false);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, maxWidth: 320 }}>
                <NumberInput
                    id="interactive"
                    label="Value"
                    value={value}
                    onChange={setValue}
                    color={color}
                    size={size}
                    variant={variant}
                    disabled={disabled}
                    unit="px"
                />
                <NumberInput label="Fractional step" value={value} step={0.1} onChange={setValue} />

                <Fieldset label="Color">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {allColors.map(c => (
                            <label key={c}>
                                <input type="radio" name="color" checked={color === c} onChange={() => setColor(c)} />
                                {c}
                            </label>
                        ))}
                    </div>
                </Fieldset>

                <Fieldset label="Size">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {allSizes.map(s => (
                            <label key={s}>
                                <input type="radio" name="size" checked={size === s} onChange={() => setSize(s)} />
                                {s}
                            </label>
                        ))}
                    </div>
                </Fieldset>

                <Fieldset label="Variant">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {allVariants.map(v => (
                            <label key={v}>
                                <input type="radio" name="variant" checked={variant === v} onChange={() => setVariant(v)} />
                                {v}
                            </label>
                        ))}
                    </div>
                </Fieldset>

                <label>
                    <input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />
                    Disabled
                </label>

                <Fieldset label="All colors">
                    {allColors.map(c => (
                        <NumberInput key={c} id={`color-${c}`} label={c} value={42} onChange={() => { }} color={c} size={size} />
                    ))}
                </Fieldset>

                <Fieldset label="All sizes">
                    {allSizes.map(s => (
                        <NumberInput key={s} id={`size-${s}`} label={s} value={42} onChange={() => { }} size={s} />
                    ))}
                </Fieldset>

                <Text>Current value: {value}</Text>
            </div>
        );
    },
};

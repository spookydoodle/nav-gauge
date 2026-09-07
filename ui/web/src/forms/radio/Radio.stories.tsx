import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { Radio } from './Radio';
import { Text } from '../../typography';
import { ColorVariant, SizeVariant } from '@ui';

const meta = {
    title: 'Forms/Radio',
    component: Radio,
} satisfies Meta<typeof Radio>;

export default meta;

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const RadioVariants = {
    render: () => {
        const [option, setOption] = useState('first');
        const [size, setSize] = useState<SizeVariant>('sm');
        const [color, setColor] = useState<ColorVariant>('primary');

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Radio
                        size={size}
                        color={color}
                        checked={option === 'first'}
                        onChange={() => setOption('first')}
                    >
                        First option
                    </Radio>
                    <Radio
                        size={size}
                        color={color}
                        checked={option === 'second'}
                        onChange={() => setOption('second')}
                    >
                        Second option
                    </Radio>
                </div>

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
                </div>

                <Text style={{ fontWeight: 700, marginTop: 16 }}>All combinations (checked)</Text>
                {allSizes.map(s => (
                    <div key={s} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Text style={{ width: 40 }}>{s}</Text>
                        {allColors.map(c => (
                            <Radio key={c} size={s} color={c} checked onChange={() => { }}>
                                {c}
                            </Radio>
                        ))}
                    </div>
                ))}

                <Text style={{ fontWeight: 700, marginTop: 16 }}>All combinations (unchecked)</Text>
                {allSizes.map(s => (
                    <div key={s} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Text style={{ width: 40 }}>{s}</Text>
                        {allColors.map(c => (
                            <Radio key={c} size={s} color={c} checked={false} onChange={() => { }}>
                                {c}
                            </Radio>
                        ))}
                    </div>
                ))}
            </div>
        );
    },
};
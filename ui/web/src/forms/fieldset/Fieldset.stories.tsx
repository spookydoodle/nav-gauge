import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { Fieldset } from './Fieldset';
import { Text } from '../../typography';
import { ColorVariant, SizeVariant, SurfaceFillVariant } from '@ui';

const meta = {
    title: 'Forms/Fieldset',
    component: Fieldset,
} satisfies Meta<typeof Fieldset>;

export default meta;

const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allSizes: SizeVariant[] = ['xs', 'sm', 'md'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const Default = {
    render: () => (
        <Fieldset label="Default Fieldset">
            <Text>This is a basic fieldset with no color prop.</Text>
        </Fieldset>
    ),
};

export const Colors = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
            {allColors.map(color => (
                <Fieldset key={color} label={color} color={color}>
                    <Text>Bordered with {color} outline</Text>
                </Fieldset>
            ))}
        </div>
    ),
};

export const Variants = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
            {allVariants.map(variant => (
                <Fieldset key={variant} label={variant} color="neutral" variant={variant}>
                    <Text>Neutral {variant} fieldset</Text>
                </Fieldset>
            ))}
        </div>
    ),
};

export const Sizes = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
            {allSizes.map(size => (
                <Fieldset key={size} label={`Size: ${size}`} size={size}>
                    <Text>Content inside a {size} fieldset</Text>
                </Fieldset>
            ))}
        </div>
    ),
};

export const Expandable = {
    render: () => {
        const [expanded, setExpanded] = useState(true);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, maxWidth: 320 }}>
                <Fieldset
                    label="Expandable"
                    expandable
                    expanded={expanded}
                    onExpandedChange={setExpanded}
                    color="primary"
                >
                    <Text>Toggle the legend to expand/collapse this section.</Text>
                </Fieldset>

                <Text>Expanded: {expanded ? 'Yes' : 'No'}</Text>
            </div>
        );
    },
};

export const WithPrepend = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
            <Fieldset
                label="With Icon"
                prepend={<span style={{ fontSize: 16 }}>&#9881;</span>}
                color="secondary"
            >
                <Text>Fieldset with a prepend icon element.</Text>
            </Fieldset>
        </div>
    ),
};

export const Interactive = {
    render: () => {
        const [color, setColor] = useState<ColorVariant>('neutral');
        const [size, setSize] = useState<SizeVariant>('md');

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, maxWidth: 320 }}>
                <Fieldset label="Preview" color={color} size={size}>
                    <Text>Current: color={color}, size={size}</Text>
                </Fieldset>

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
            </div>
        );
    },
};

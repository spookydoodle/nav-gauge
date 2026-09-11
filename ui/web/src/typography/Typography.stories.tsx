import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { FontType, ColorVariant } from '@ui';
import { H1, H2, H3, H4, H5, H6, Label, P, Span, Text } from './';

const colors: (ColorVariant | undefined)[] = [undefined, 'primary', 'secondary', 'tertiary', 'neutral'];
const variantLabels = ['Default', 'Primary', 'Secondary', 'Tertiary', 'Neutral'];

const meta = {
    title: 'Typography',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextStory = {
    name: 'Text',
    args: {
        variant: 'body' as const,
        fontType: FontType.Default,
        children: 'The management of the dead planet wishes you a very fine day.',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['header', 'body', 'caption'],
        },
        as: {
            control: 'select',
            options: ['(auto)', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            mapping: { '(auto)': undefined },
        },
        color: {
            control: 'select',
            options: ['(default)', 'primary', 'secondary', 'tertiary', 'neutral'],
            mapping: { '(default)': undefined },
        },
        fontType: {
            control: 'select',
            options: Object.values(FontType),
        },
    },
    render: (args: Record<string, unknown>) => (
        <Text
            variant={args.variant as 'header' | 'body' | 'caption'}
            as={args.as as 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | undefined}
            color={args.color as 'primary' | 'secondary' | 'tertiary' | 'neutral' | undefined}
            fontType={args.fontType as FontType}
        >
            {args.children as string}
        </Text>
    ),
} satisfies StoryObj;

export const Labels: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 8 }}>
            <Label>Enabled label</Label>
            <Label disabled>Disabled label</Label>
        </div>
    ),
};

export const All = {
    render: () => {
        const [fontType, setFontType] = useState<FontType>(FontType.Default);

        return (
            <div>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label htmlFor="font-select" style={{ fontWeight: 700 }}>Font Type:</label>
                    <select
                        id="font-select"
                        value={fontType}
                        onChange={(e) => setFontType(e.target.value as FontType)}
                        style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--color-border)', fontSize: 14 }}
                    >
                        {Object.values(FontType).map((ft) => (
                            <option key={ft} value={ft}>
                                {ft}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${colors.length}, max-content)`,
                    gap: '16px 32px',
                    alignItems: 'center',
                }}>
                    {colors.map((color, i) => (
                        <h5 key={color} style={{ margin: 0 }}>{variantLabels[i]}</h5>
                    ))}
                    {(['P', 'Span', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'] as const).map((Tag) => (
                        colors.map((color) => {
                            const Component = { P, Span, H1, H2, H3, H4, H5, H6 }[Tag];

                            return (
                                <Component key={`${Tag}-${color}`} color={color} fontType={fontType}>
                                    {Tag}{color ? ` (${color})` : ''}
                                </Component>
                            );
                        })
                    ))}
                </div>
            </div>
        );
    },
} satisfies Story;

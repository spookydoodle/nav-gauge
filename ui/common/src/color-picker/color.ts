import { Theme } from "../theme/theme";
import { ColorShade, DesignSystemColor } from "../theme/model";

export interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export const toCssColor = ({ r, g, b, a }: RgbaColor): string =>
    a >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;

export const toHexColor = ({ r, g, b }: RgbaColor): string =>
    '#' + [r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('');

export const parseColor = (value: string): RgbaColor => {
    const rgbMatch = value.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/);
    if (rgbMatch) {
        return {
            r: Number(rgbMatch[1]),
            g: Number(rgbMatch[2]),
            b: Number(rgbMatch[3]),
            a: rgbMatch[4] === undefined ? 1 : Number(rgbMatch[4]),
        };
    }

    const hexMatch = value.trim().match(/^#([0-9a-f]{6})$/i);
    if (hexMatch) {
        return {
            r: parseInt(hexMatch[1].slice(0, 2), 16),
            g: parseInt(hexMatch[1].slice(2, 4), 16),
            b: parseInt(hexMatch[1].slice(4, 6), 16),
            a: 1,
        };
    }

    return { r: 0, g: 0, b: 0, a: 1 };
};

export interface HslColor {
    h: number;
    s: number;
    l: number;
}

export const rgbToHsl = ({ r, g, b }: RgbaColor): HslColor => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    const l = (max + min) / 2;

    if (delta === 0) {
        return { h: 0, s: 0, l: Math.round(l * 100) };
    }

    const s = delta / (1 - Math.abs(2 * l - 1));
    let h: number;
    if (max === rn) {
        h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
        h = (bn - rn) / delta + 2;
    } else {
        h = (rn - gn) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }

    return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const hslToRgb = ({ h, s, l }: HslColor): RgbaColor => {
    const hn = ((h % 360) + 360) % 360 / 360;
    const sn = s / 100;
    const ln = l / 100;
    const c = (1 - Math.abs(2 * ln - 1)) * sn;
    const x = c * (1 - Math.abs((hn * 6) % 2 - 1));
    const m = ln - c / 2;

    let rgb: [number, number, number];
    const sextant = Math.floor(hn * 6);
    switch (sextant) {
        case 0: rgb = [c, x, 0]; break;
        case 1: rgb = [x, c, 0]; break;
        case 2: rgb = [0, c, x]; break;
        case 3: rgb = [0, x, c]; break;
        case 4: rgb = [x, 0, c]; break;
        default: rgb = [c, 0, x]; break;
    }

    return {
        r: Math.round((rgb[0] + m) * 255),
        g: Math.round((rgb[1] + m) * 255),
        b: Math.round((rgb[2] + m) * 255),
        a: 1,
    };
};

const swatchDesignSystemColors: DesignSystemColor[] = ['primary', 'secondary', 'tertiary', 'neutral'];
const swatchShades: ColorShade[] = [300, 500, 700];

export const getThemeColorSwatches = (theme: Theme): { label: string; color: string }[] =>
    swatchDesignSystemColors.flatMap((name) =>
        swatchShades.map((shade) => ({
            label: `${name} ${shade}`,
            color: toCssColor({ ...theme.colors[name][shade], a: 1 }),
        })),
    );
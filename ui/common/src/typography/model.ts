import { ColorVariant, SpacingVariant } from "../model";

/**
 * Fonts available for typography components. Usage and role:
 *
 * - `Space Grotesk` — Default UI; texts, buttons, alerts, notices
 * - `Ubuntu Mono` — HUD elements; infrastructure, telemetry, timestamps, charts, tables, numeric elements, backend processing alerts
 * - `Syne Mono` — Special Messaging; psychological tone, propaganda
 * - `Sixtyfour` — Rare usage for neon headers; special graphics
 * - `Bitcount Single` — Rare usage for neon text; special graphics
 */
export type FontFamilyName =
    | 'Space Grotesk'
    | 'Ubuntu Mono'
    | 'Syne Mono'
    | 'Sixtyfour'
    | 'Bitcount Single';

export enum FontType {
    Default = 'default',
    Numeric = 'numeric',
    SpecialMessaging = 'special-messaging',
    NeonHeader = 'neon-header',
    NeonText = 'neon-text',
}

export interface TypographyProps {
    color?: ColorVariant;
    fontType?: FontType;
    align?: 'left' | 'right';
    nowrap?: boolean;
    shadow?: boolean;
    bold?: boolean;
    tabular?: boolean;
    /**
     * Margin (all sides)
     */
    m?: SpacingVariant;
    /**
     * Margin horizontal (left & right)
     */
    mh?: SpacingVariant;
    /**
     * Margin vertical (top & bottom)
     */
    mv?: SpacingVariant;
    /**
     * Margin top
     */
    mt?: SpacingVariant;
    /**
     * Margin right
     */
    mr?: SpacingVariant;
    /**
     * Margin bottom
     */
    mb?: SpacingVariant;
    /**
     * Margin left
     */
    ml?: SpacingVariant;
    /**
     * Padding (all sides)
     */
    p?: SpacingVariant;
    /**
     * Padding horizontal (left & right)
     */
    ph?: SpacingVariant;
    /**
     * Padding vertical (top & bottom)
     */
    pv?: SpacingVariant;
    /**
     * Padding top
     */
    pt?: SpacingVariant;
    /**
     * Padding right
     */
    pr?: SpacingVariant;
    /**
     * Padding bottom
     */
    pb?: SpacingVariant;
    /**
     * Padding left
     */
    pl?: SpacingVariant;
}

export interface LabelProps {
    disabled?: boolean;
}

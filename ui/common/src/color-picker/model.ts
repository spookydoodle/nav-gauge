export interface ColorPickerProps {
    label?: string;
    value: string;
    opacityLabel?: string;
    onChange: (value: string) => void;
}
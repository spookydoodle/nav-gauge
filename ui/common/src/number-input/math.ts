const decimalPlaces = (value: number): number => {
    const [coefficient, exponent = '0'] = value.toString().toLowerCase().split('e');
    return Math.max(0, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent));
};

export const addDecimalStep = (value: number, step: number): number => {
    const precision = 10 ** Math.max(decimalPlaces(value), decimalPlaces(step));
    return (Math.round(value * precision) + Math.round(step * precision)) / precision;
};

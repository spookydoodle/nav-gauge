export const getVisibleTabCount = (tabWidths: readonly number[], containerWidth: number, overflowWidth: number): number => {
    if (tabWidths.reduce((total, width) => total + width, 0) <= containerWidth) return tabWidths.length;

    let usedWidth = overflowWidth;
    return tabWidths.findIndex((width) => {
        usedWidth += width;
        return usedWidth > containerWidth;
    });
};

export const getVisibleTabIndexes = (
    tabWidths: readonly number[],
    containerWidth: number,
    overflowWidth: number,
    selectedIndex: number,
): number[] => {
    const visibleCount = getVisibleTabCount(tabWidths, containerWidth, overflowWidth);
    if (visibleCount === tabWidths.length || selectedIndex < visibleCount || selectedIndex < 0) {
        return Array.from({ length: visibleCount }, (_, index) => index);
    }

    let usedWidth = overflowWidth + tabWidths[selectedIndex];
    if (usedWidth > containerWidth) return [];

    const indexes = [selectedIndex];
    tabWidths.forEach((width, index) => {
        if (index !== selectedIndex && usedWidth + width <= containerWidth) {
            indexes.push(index);
            usedWidth += width;
        }
    });
    return indexes;
};

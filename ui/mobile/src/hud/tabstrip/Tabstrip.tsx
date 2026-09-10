import { FC, useState } from 'react';
import { LayoutAnimation, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { getVisibleTabIndexes, TabstripProps, useTheme } from '@ui';
import { Button } from '../../button';
import { Menu, MenuItem } from '../../menu';

const styles = StyleSheet.create({
    root: { alignSelf: 'stretch', width: '100%' },
    header: { flexDirection: 'row', overflow: 'hidden' },
    content: { marginTop: -1 },
    measurement: { position: 'absolute', opacity: 0, flexDirection: 'row' },
    joined: { marginLeft: -1 },
    selected: { position: 'relative' },
    headerButton: { borderWidth: 0 },
    selectedButton: { backgroundColor: 'transparent', borderWidth: 0 },
    shape: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
    spreadItem: { flex: 1 },
    spreadButton: { width: '100%' },
});

export const Tabstrip: FC<TabstripProps> = ({
    options,
    value,
    onChange,
    size = 'sm',
    color = 'neutral',
    highlightColor = color,
    variant = 'fill-inverse',
    spread = false,
    overflowAccessibilityLabel,
    children,
}) => {
    const theme = useTheme();
    const [containerWidth, setContainerWidth] = useState(0);
    const [optionWidths, setOptionWidths] = useState<number[]>([]);
    const [overflowWidth, setOverflowWidth] = useState(0);
    const visibleIndexes = optionWidths.length === options.length
        ? getVisibleTabIndexes(optionWidths, containerWidth, overflowWidth, options.findIndex((option) => option.value === value))
        : [];

    const setOptionWidth = (index: number, event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width;
        setOptionWidths((current) => current[index] === width
            ? current
            : Object.assign([...current], { [index]: width }));
    };
    const buttonProps = { color, highlightColor, size, variant };
    const selectTab = (selectedValue: string) => {
        LayoutAnimation.configureNext({
            duration: 200,
            update: { type: LayoutAnimation.Types.easeInEaseOut },
        });
        onChange(selectedValue);
    };
    const visibleIndexSet = new Set(visibleIndexes);
    const overflowOptions = options.filter((_, index) => !visibleIndexSet.has(index));
    const baseColor = theme.color(color, 500);
    const contentStyle = {
        backgroundColor: variant === 'fill-inverse'
            ? theme.color(color, theme.isLight ? 100 : (color === 'neutral' ? 800 : 900))
            : variant === 'fill-translucent' ? theme.color(color, 500, 0.24) : 'transparent',
        borderColor: baseColor,
        borderWidth: variant === 'outline' ? 1 : 0,
        padding: size === 'md' ? 14 : size === 'sm' ? 10 : 6,
    };

    return (
        <View style={styles.root}>
            <View style={styles.header} accessibilityRole="tablist" onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
                {visibleIndexes.map((optionIndex, visibleIndex) => {
                    const option = options[optionIndex];
                    const selected = option.value === value;
                    const width = optionWidths[optionIndex] ?? 0;
                    const height = size === 'md' ? 32 : size === 'sm' ? 24 : 18;
                    const fill = theme.color(highlightColor, 500);
                    const isTrailing = visibleIndex === visibleIndexes.length - 1 && overflowOptions.length === 0;
                    const isLast = spread && isTrailing;
                    const inactiveFill = variant === 'fill-inverse'
                        ? theme.color(color, theme.isLight ? 100 : (color === 'neutral' ? 800 : 900))
                        : variant === 'fill-translucent' ? theme.color(color, 500, 0.24) : 'transparent';
                    const button = <Button
                        key={option.value}
                        {...buttonProps}
                        style={[styles.headerButton, spread ? styles.spreadButton : undefined, selected ? styles.selectedButton : undefined]}
                        accessibilityRole="tab"
                        accessibilityState={{ selected, disabled: option.disabled }}
                        active={selected}
                        disabled={option.disabled}
                        onPress={() => selectTab(option.value)}
                    >
                        {selected ? <Text style={{ color: theme.color(highlightColor, theme.isDark ? 900 : 100) }}>{option.label}</Text> : option.label}
                    </Button>;
                    return selected ? (
                        <View key={option.value} style={[styles.selected, spread ? styles.spreadItem : undefined, { backgroundColor: isTrailing && !spread ? 'transparent' : inactiveFill }, visibleIndex ? styles.joined : undefined]}>
                            <Svg style={styles.shape} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" pointerEvents="none" accessibilityElementsHidden>
                                <Polygon points={`${visibleIndex ? 6 : 0},0 ${isLast ? width : width - 6},0 ${width},${height + 1} 0,${height + 1}`} fill={fill} />
                            </Svg>
                            {button}
                        </View>
                    ) : <View key={option.value} style={[spread ? styles.spreadItem : undefined, visibleIndex ? styles.joined : undefined]}>{button}</View>;
                })}
                {overflowOptions.length ? (
                    <View style={[spread ? styles.spreadItem : undefined, visibleIndexes.length ? styles.joined : undefined]} onLayout={(event) => setOverflowWidth(event.nativeEvent.layout.width)}>
                        <Menu
                            color={color}
                            iconActiveColor={highlightColor}
                            iconSize={size}
                            triggerAccessibilityLabel={overflowAccessibilityLabel}
                            triggerActive={overflowOptions.some((option) => option.value === value)}
                            triggerStyle={[styles.headerButton, spread ? styles.spreadButton : undefined]}
                        >
                            {overflowOptions.map((option) => (
                                <MenuItem key={option.value} onPress={() => selectTab(option.value)} highlightColor={highlightColor} disabled={option.disabled}>
                                    {option.value === value ? '* ' : null}{option.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </View>
                ) : null}
                <View style={styles.measurement} pointerEvents="none" accessibilityElementsHidden>
                    {options.map((option, index) => (
                        <Button key={option.value} {...buttonProps} style={styles.headerButton} onLayout={(event) => setOptionWidth(index, event)}>
                            {option.label}
                        </Button>
                    ))}
                </View>
            </View>
            {children !== undefined && children !== null ? <View style={[styles.content, contentStyle]}>{children}</View> : null}
        </View>
    );
};

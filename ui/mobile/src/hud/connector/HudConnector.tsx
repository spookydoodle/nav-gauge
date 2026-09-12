import { FC, RefObject, useEffect, useRef, useState } from 'react';
import { HostInstance, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Polygon, Polyline } from 'react-native-svg';
import { HudConnectorAnchor, HudConnectorProps, Theme, useTheme } from '@ui';

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative'
    },
    connector: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: Theme.zIndex.hudConnector,
    },
});

interface Props extends HudConnectorProps {
    fromRef: RefObject<HostInstance | null>;
    toRef: RefObject<HostInstance | null>;
}

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Point {
    x: number;
    y: number;
}

const anchorPoint = (rectangle: Rectangle, anchor: HudConnectorAnchor, wrapper: Rectangle): Point => {
    const horizontal = anchor.endsWith('left') || anchor === 'left' ? 0 : anchor.endsWith('right') || anchor === 'right' ? 1 : 0.5;
    const vertical = anchor.startsWith('top') || anchor === 'top' ? 0 : anchor.startsWith('bottom') || anchor === 'bottom' ? 1 : 0.5;
    return { x: rectangle.x - wrapper.x + rectangle.width * horizontal, y: rectangle.y - wrapper.y + rectangle.height * vertical };
};

const measure = (view: HostInstance): Promise<Rectangle> => new Promise((resolve) => {
    view.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }));
});

export const HudConnector: FC<Props> = ({
    children,
    fromRef,
    toRef,
    color = 'primary',
    glowStyle = 'none',
    fromAnchor = 'center',
    toAnchor = 'center',
}) => {
    const theme = useTheme();
    const wrapperRef = useRef<HostInstance>(null);
    const [points, setPoints] = useState<[Point, Point] | null>(null);
    const update = async () => {
        if (!wrapperRef.current || !fromRef.current || !toRef.current) return;
        const [wrapper, from, to] = await Promise.all([measure(wrapperRef.current), measure(fromRef.current), measure(toRef.current)]);
        setPoints([anchorPoint(from, fromAnchor, wrapper), anchorPoint(to, toAnchor, wrapper)]);
    };
    const onLayout = (_event: LayoutChangeEvent) => requestAnimationFrame(update);

    useEffect(() => {
        requestAnimationFrame(update);
    }, [fromAnchor, fromRef, toAnchor, toRef]);

    const bend = points ? Math.max(8, Math.abs(points[1].y - points[0].y) / 2) : 0;
    const path = points
        ? `${points[0].x},${points[0].y} ${points[0].x},${points[0].y - bend} ${points[1].x},${points[1].y + bend} ${points[1].x},${points[1].y}`
        : '';
    const connectorColor = theme.color(color);

    return (
        <View ref={wrapperRef} style={styles.wrapper} onLayout={onLayout}>
            {children}
            {points ? (
                <Svg style={styles.connector} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                    {glowStyle !== 'none' ? <Polyline points={path} fill="none" stroke={connectorColor} strokeWidth={7} strokeOpacity={0.16} /> : null}
                    <Polyline points={path} fill="none" stroke={connectorColor} strokeWidth={1} />
                    <Polygon points={`${points[1].x - 4},${points[1].y} ${points[1].x - 2},${points[1].y - 3.5} ${points[1].x + 2},${points[1].y - 3.5} ${points[1].x + 4},${points[1].y} ${points[1].x + 2},${points[1].y + 3.5} ${points[1].x - 2},${points[1].y + 3.5}`} fill={connectorColor} />
                </Svg>
            ) : null}
        </View>
    );
};

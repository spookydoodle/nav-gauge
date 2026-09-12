import { FC, RefObject, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { HudConnectorAnchor, HudConnectorProps } from '@ui';
import styles from './hud-connector.module.css';

interface Props extends HudConnectorProps {
    fromRef: RefObject<Element | null>;
    toRef: RefObject<Element | null>;
}

interface Point {
    x: number;
    y: number;
}

const anchorPoint = (rectangle: DOMRect, anchor: HudConnectorAnchor, wrapper: DOMRect): Point => {
    const horizontal = anchor.endsWith('left') || anchor === 'left' ? 0 : anchor.endsWith('right') || anchor === 'right' ? 1 : 0.5;
    const vertical = anchor.startsWith('top') || anchor === 'top' ? 0 : anchor.startsWith('bottom') || anchor === 'bottom' ? 1 : 0.5;
    return { x: rectangle.left - wrapper.left + rectangle.width * horizontal, y: rectangle.top - wrapper.top + rectangle.height * vertical };
};

export const HudConnector: FC<Props> = ({
    children,
    fromRef,
    toRef,
    color = 'primary',
    glowStyle = 'none',
    fromAnchor = 'center',
    toAnchor = 'center',
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [points, setPoints] = useState<[Point, Point] | null>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const update = () => {
            const from = fromRef.current;
            const to = toRef.current;
            if (!from || !to) return;
            observer.observe(from);
            observer.observe(to);
            const wrapperRectangle = wrapper.getBoundingClientRect();
            setPoints([
                anchorPoint(from.getBoundingClientRect(), fromAnchor, wrapperRectangle),
                anchorPoint(to.getBoundingClientRect(), toAnchor, wrapperRectangle),
            ]);
        };
        const observer = new ResizeObserver(update);
        const mutationObserver = new MutationObserver(update);
        observer.observe(wrapper);
        mutationObserver.observe(wrapper, { childList: true, subtree: true });
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        update();
        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, [fromAnchor, fromRef, toAnchor, toRef]);

    const bend = points ? Math.max(8, Math.abs(points[1].y - points[0].y) / 2) : 0;
    const path = points
        ? `${points[0].x},${points[0].y} ${points[0].x},${points[0].y - bend} ${points[1].x},${points[1].y + bend} ${points[1].x},${points[1].y}`
        : '';

    return (
        <div ref={wrapperRef} className={classNames(styles.wrapper, styles[`color-${color}`], styles[`glow-style-${glowStyle}`])}>
            {children}
            {points ? (
                <svg className={styles.connector} aria-hidden="true">
                    <polyline points={path} />
                    <polygon points={`${points[1].x - 4},${points[1].y} ${points[1].x - 2},${points[1].y - 3.5} ${points[1].x + 2},${points[1].y - 3.5} ${points[1].x + 4},${points[1].y} ${points[1].x + 2},${points[1].y + 3.5} ${points[1].x - 2},${points[1].y + 3.5}`} />
                </svg>
            ) : null}
        </div>
    );
};

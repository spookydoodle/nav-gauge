import { FC, RefObject } from "react";
import { RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";
import { Icon } from "@web-ui";
import styles from './demo-line.module.css';

interface Props {
    state: RouteStoryState;
    onCurrentPointClick: () => void;
    onActiveClick: () => void;
    onInactiveClick: () => void;
    activeMenuLabel: string;
    inactiveMenuLabel: string;
    currentPointMenuLabel: string;
    activeRef: RefObject<SVGRectElement | null>;
    currentPointRef: RefObject<SVGRectElement | null>;
    inactiveRef: RefObject<SVGRectElement | null>;
}

export const DemoLine: FC<Props> = ({
    state,
    onCurrentPointClick,
    onActiveClick,
    onInactiveClick,
    activeMenuLabel,
    inactiveMenuLabel,
    currentPointMenuLabel,
    activeRef,
    currentPointRef,
    inactiveRef,
}) => {
    const { routeStyleActive: active, routeStyleInactive: inactive } = state;
    const activeDash = active.variant === 'dashed' ? '5 4' : undefined;
    const inactiveDash = inactive.variant === 'dashed' ? '5 4' : undefined;
    const activeWidth = Math.max(2, Math.min(active.width, 10));
    const inactiveWidth = Math.max(2, Math.min(inactive.width, 10));
    const activeOutlineWidth = Math.max(2, activeWidth + active.outlineWidth * 2);
    const inactiveOutlineWidth = Math.max(2, inactiveWidth + inactive.outlineWidth * 2);
    const markerSize = 16 * state.currentPoint.size;
    const icon = state.currentPoint.icon === 'Circle' ? Icons.Circle : Icons.NounProject[state.currentPoint.icon];
    return (
        <svg
            className={styles['demo-line']}
            viewBox="0 0 300 20"
            preserveAspectRatio="none"
        >
            <line x1="2" y1="10" x2="150" y2="10" stroke={active.outlineColor} strokeWidth={activeOutlineWidth} strokeDasharray={activeDash} strokeLinecap="round" />
            <line x1="2" y1="10" x2="150" y2="10" stroke={active.color} strokeWidth={activeWidth} strokeDasharray={activeDash} strokeLinecap="round" />
            <line x1="150" y1="10" x2="298" y2="10" stroke={inactive.outlineColor} strokeWidth={inactiveOutlineWidth} strokeDasharray={inactiveDash} strokeLinecap="round" />
            <line x1="150" y1="10" x2="298" y2="10" stroke={inactive.color} strokeWidth={inactiveWidth} strokeDasharray={inactiveDash} strokeLinecap="round" />
            <g
                pointerEvents="none"
            >
                <foreignObject
                    x={150 - markerSize / 2}
                    y={10 - markerSize / 2}
                    width={markerSize}
                    height={markerSize}
                >
                    <span style={{ display: 'block' }}>
                        <Icon src={icon} width={markerSize} height={markerSize} color={state.currentPoint.fillColor} />
                    </span>
                </foreignObject>
            </g>
            <rect ref={activeRef} className={styles.target} x="0" y="0" width="140" height="20" role="button" tabIndex={0} aria-label={activeMenuLabel} onClick={onActiveClick} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && (event.preventDefault(), onActiveClick())} />
            <rect ref={currentPointRef} className={styles.target} x="140" y="0" width="20" height="20" role="button" tabIndex={0} aria-label={currentPointMenuLabel} onClick={onCurrentPointClick} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && (event.preventDefault(), onCurrentPointClick())} />
            <rect ref={inactiveRef} className={styles.target} x="160" y="0" width="140" height="20" role="button" tabIndex={0} aria-label={inactiveMenuLabel} onClick={onInactiveClick} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && (event.preventDefault(), onInactiveClick())} />
        </svg>
    );
};

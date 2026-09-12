import { FC, RefObject } from "react";
import { RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";
import { Icon } from "@web-ui";
import styles from './demo-line.module.css';

interface Props {
    state: RouteStoryState;
    onCurrentPointClick: () => void;
    currentPointMenuLabel: string;
    activeRef: RefObject<SVGLineElement | null>;
    currentPointRef: RefObject<SVGGElement | null>;
    inactiveRef: RefObject<SVGLineElement | null>;
}

export const DemoLine: FC<Props> = ({
    state,
    onCurrentPointClick,
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
            <line ref={activeRef} x1="2" y1="10" x2="150" y2="10" stroke={active.color} strokeWidth={activeWidth} strokeDasharray={activeDash} strokeLinecap="round" />
            <line x1="150" y1="10" x2="298" y2="10" stroke={inactive.outlineColor} strokeWidth={inactiveOutlineWidth} strokeDasharray={inactiveDash} strokeLinecap="round" />
            <line ref={inactiveRef} x1="150" y1="10" x2="298" y2="10" stroke={inactive.color} strokeWidth={inactiveWidth} strokeDasharray={inactiveDash} strokeLinecap="round" />
            <g
                ref={currentPointRef}
                className={styles['demo-point']}
                role="button"
                tabIndex={0}
                aria-label={currentPointMenuLabel}
                onClick={onCurrentPointClick}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onCurrentPointClick();
                    }
                }}
            >
                <circle cx="150" cy="10" r={Math.max(10, markerSize / 2 + 4)} fill="transparent" />
                <foreignObject
                    x={150 - markerSize / 2}
                    y={10 - markerSize / 2}
                    width={markerSize}
                    height={markerSize}
                >
                    <span style={{ display: 'block', filter: `drop-shadow(0 0 ${state.currentPoint.outlineWidth}px ${state.currentPoint.outlineColor})` }}>
                        <Icon src={icon} width={markerSize} height={markerSize} color={state.currentPoint.fillColor} />
                    </span>
                </foreignObject>
            </g>
        </svg>
    );
};

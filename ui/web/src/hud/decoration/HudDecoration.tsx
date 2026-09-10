import { FC } from 'react';
import classNames from 'classnames';
import { HudDecorationCorner, HudDecorationProps } from '@ui';
import styles from './hud-decoration.module.css';

const paths: Record<HudDecorationCorner, string> = {
    'top-left': 'M 1 24 V 8 H 8 V 1 H 24',
    'top-right': 'M 76 1 H 92 V 8 H 99 V 24',
    'bottom-left': 'M 1 76 V 92 H 8 V 99 H 24',
    'bottom-right': 'M 76 99 H 92 V 92 H 99 V 76',
};

export const HudDecoration: FC<HudDecorationProps> = ({
    children,
    color = 'primary',
    size = 'sm',
    glowStyle = 'none',
    corners = ['top-left', 'bottom-right'],
}) => (
    <div className={classNames(styles.wrapper, styles[`color-${color}`], styles[`size-${size}`], styles[`glow-style-${glowStyle}`])}>
        {children}
        <svg className={styles.decoration} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {corners.map((corner) => <path key={corner} d={paths[corner]} vectorEffect="non-scaling-stroke" />)}
        </svg>
    </div>
);

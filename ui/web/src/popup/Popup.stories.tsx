import type { Meta } from 'storybook-react-rsbuild';
import { useRef, useState } from 'react';
import { Popup } from './Popup';
import { Button } from '../button';
import type { MenuAnchor } from '@ui';

const meta = {
    title: 'Popup',
    component: Popup,
} satisfies Meta<typeof Popup>;

export default meta;

const anchorPairs: { triggerAnchor: MenuAnchor; popupAnchor: MenuAnchor }[] = [
    { triggerAnchor: 'top-left', popupAnchor: 'bottom-left' },
    { triggerAnchor: 'top-right', popupAnchor: 'bottom-right' },
    { triggerAnchor: 'bottom-left', popupAnchor: 'top-left' },
    { triggerAnchor: 'bottom-right', popupAnchor: 'top-right' },
];

export const Overview = {
    render: () => {
        const [activePair, setActivePair] = useState<typeof anchorPairs[number] | null>(null);
        const anchorRefs = useRef<(HTMLButtonElement | null)[]>([]);

        return (
            <div style={{ padding: 100, display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 32 }}>
                {anchorPairs.map((pair, index) => (
                    <button
                        key={`${pair.triggerAnchor}-${pair.popupAnchor}`}
                        ref={(element) => { anchorRefs.current[index] = element; return; }}
                        onClick={() => setActivePair((current) => (current === pair ? null : pair))}
                        style={{ padding: '8px 16px' }}
                    >
                        trigger {pair.triggerAnchor} / popup {pair.popupAnchor}
                    </button>
                ))}
                {activePair && (
                    <Popup
                        visible
                        variant="fill"
                        onClose={() => setActivePair(null)}
                        anchor={{ current: anchorRefs.current[anchorPairs.indexOf(activePair)] }}
                        triggerAnchor={activePair.triggerAnchor}
                        popupAnchor={activePair.popupAnchor}
                    >
                        <div>
                            <p>Popup content</p>
                            <Button size="xs" onClick={() => setActivePair(null)}>Close</Button>
                        </div>
                    </Popup>
                )}
            </div>
        );
    },
};

export const CustomAnchors = {
    render: () => {
        const [visible, setVisible] = useState(false);
        const anchorRef = useRef<HTMLButtonElement>(null);

        return (
            <div style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 100 }}>
                <button
                    ref={anchorRef}
                    onClick={() => setVisible((current) => !current)}
                    style={{ padding: '8px 16px' }}
                >
                    Toggle
                </button>
                {visible && (
                    <Popup
                        visible
                        variant="fill"
                        onClose={() => setVisible(false)}
                        anchor={anchorRef}
                        triggerAnchor="bottom-right"
                        popupAnchor="top-right"
                    >
                        <div style={{ width: 320 }}>
                            <p>
                                This popup's top-right corner sits at the trigger's bottom-right corner.
                                It flips when it would overflow and returns to this anchor after the viewport grows.
                            </p>
                            <Button size="xs" onClick={() => setVisible(false)}>Close</Button>
                        </div>
                    </Popup>
                )}
            </div>
        );
    },
};

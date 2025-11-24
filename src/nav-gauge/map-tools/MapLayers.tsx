import { FC, ReactNode } from "react";

interface Props {
    isStyleUpdating: boolean;
    /**
     * Will be unmounted for the duration of style updates.
     */
    children?: ReactNode;
}

export const MapLayers: FC<Props> = ({
    isStyleUpdating,
    children,
}) => {
    if (isStyleUpdating) {
        return null;
    }
    return <>{children}</>;
};

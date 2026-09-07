import { MenuAnchor, MenuPosition } from "./model";

export function getIconAndMenuAnchors(placement: MenuAnchor): { icon: MenuAnchor; menu: MenuAnchor } {
    const vertical = placement.startsWith('top') ? 'bottom' : 'top';
    const horizontal = placement.endsWith('right') ? 'right' : 'left';

    return { icon: placement, menu: `${vertical}-${horizontal}` as MenuAnchor };
}

export function flipVerticalAnchor(anchor: MenuAnchor): MenuAnchor {
    const vertical = anchor.startsWith('top') ? 'bottom' : 'top';
    const horizontal = anchor.endsWith('right') ? 'right' : 'left';
    return `${vertical}-${horizontal}` as MenuAnchor;
}

export function flipHorizontalAnchor(anchor: MenuAnchor): MenuAnchor {
    const vertical = anchor.startsWith('top') ? 'top' : 'bottom';
    const horizontal = anchor.endsWith('right') ? 'left' : 'right';
    return `${vertical}-${horizontal}` as MenuAnchor;
}

export function getIconAnchorPoint(
    anchor: MenuAnchor,
    iconX: number,
    iconY: number,
    width: number,
    height: number,
): { x: number; y: number } {
    switch (anchor) {
        case 'top-left': return { x: iconX, y: iconY };
        case 'top-right': return { x: iconX + width, y: iconY };
        case 'bottom-left': return { x: iconX, y: iconY + height };
        case 'bottom-right': return { x: iconX + width, y: iconY + height };
    }
}

export function getMenuPosition(
    anchor: MenuAnchor,
    iconAnchor: { x: number; y: number },
    overlayWidth: number,
    overlayHeight: number,
): MenuPosition {
    switch (anchor) {
        case 'top-left': return { top: iconAnchor.y, left: iconAnchor.x };
        case 'top-right': return { top: iconAnchor.y, right: overlayWidth - iconAnchor.x };
        case 'bottom-left': return { bottom: overlayHeight - iconAnchor.y, left: iconAnchor.x };
        case 'bottom-right': return { bottom: overlayHeight - iconAnchor.y, right: overlayWidth - iconAnchor.x };
    }
}

export interface PopupSize {
    width: number;
    height: number;
}

export interface PlacePopupResult {
    popupAnchor: MenuAnchor;
    position: MenuPosition;
}

function popupFitsInViewport(
    position: MenuPosition,
    size: PopupSize,
    viewportWidth: number,
    viewportHeight: number,
): boolean {
    const left = position.left ?? viewportWidth - (position.right ?? 0) - size.width;
    const top = position.top ?? viewportHeight - (position.bottom ?? 0) - size.height;
    return left >= 0 && top >= 0 && left + size.width <= viewportWidth && top + size.height <= viewportHeight;
}

export function placePopup(
    popupAnchor: MenuAnchor,
    iconAnchor: { x: number; y: number },
    size: PopupSize | null,
    viewportWidth: number,
    viewportHeight: number,
): PlacePopupResult {
    const candidates: MenuAnchor[] = [
        popupAnchor,
        flipVerticalAnchor(popupAnchor),
        flipHorizontalAnchor(popupAnchor),
        flipHorizontalAnchor(flipVerticalAnchor(popupAnchor)),
    ];

    const desiredPosition = getMenuPosition(popupAnchor, iconAnchor, viewportWidth, viewportHeight);
    if (!size || popupFitsInViewport(desiredPosition, size, viewportWidth, viewportHeight)) {
        return { popupAnchor, position: desiredPosition };
    }

    for (const candidate of candidates.slice(1)) {
        const position = getMenuPosition(candidate, iconAnchor, viewportWidth, viewportHeight);
        if (popupFitsInViewport(position, size, viewportWidth, viewportHeight)) {
            return { popupAnchor: candidate, position };
        }
    }

    return { popupAnchor, position: desiredPosition };
}

import { ComponentType } from "react";
import { BehaviorSubject, combineLatest, map, Observable, of, Subscription, switchMap } from "rxjs";
import {
    ToolPanel,
    ToolPanelPlacement,
    ToolPanelProps,
    ObservedToolPanel,
    ToolIcon,
    ObservedToolIcon,
    ToolIconPlacement,
    TopToolsProps,
    ToolbarSizeRef,
    ToolIconAnchorRef,
    ToolPopup,
    ToolPopupProps,
} from "./model";
import { type TranslationId } from "../translatron";
import { type PanelLayout } from "../machine-layout";

export class ToolsStation<TMap> {
    public static placements: ToolPanelPlacement[] = ["right", "bottom", "left"];

    /**
     * Tool popups to display
     * Tools have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool popup with a given `id` already exists, it will be overwritten.
     */
    public toolPopups$ = new BehaviorSubject<Map<string, ToolPopup<TMap>>>(new Map());

    /**
     * Tools to display in panels.
     * Tools have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool with a given `id` already exists, it will be overwritten.
     */
    public toolPanels$ = new BehaviorSubject<Map<string, ToolPanel<TMap>>>(new Map());

    /**
     * Subscribe to changes of tools and their placement.
     */
    public toolPanelsByPlacement$: Observable<ObservedToolPanel<TMap>[]> = this.toolPanels$.pipe(switchMap((toolsMap) => {
        const toolPanels = [...toolsMap.entries()];

        if (toolPanels.length === 0) {
            return of([]);
        }

        return combineLatest(toolPanels.map(([id, toolPanel]) => toolPanel.placement$.pipe(
            map((placement): ObservedToolPanel<TMap> => ({
                placement,
                id,
                icon: toolPanel.icon,
                title: toolPanel.title,
                headerComponent: toolPanel.headerComponent,
                contentComponent: toolPanel.contentComponent,
            }))
        )));
    }));

    public activeLeftPanelToolId$ = new BehaviorSubject<string | null>(null);
    public activeRightPanelToolId$ = new BehaviorSubject<string | null>(null);
    public activeBottomPanelToolId$ = new BehaviorSubject<string | null>(null);
    public activeBottomSecondaryPanelToolId$ = new BehaviorSubject<string | null>(null);

    public topBarSizeRef: ToolbarSizeRef = { current: null };
    public topToolbarSizeRef: ToolbarSizeRef = { current: null };
    public rightToolPanelSizeRef: ToolbarSizeRef = { current: null };
    public leftToolPanelSizeRef: ToolbarSizeRef = { current: null };
    public bottomToolPanelSizeRef: ToolbarSizeRef = { current: null };
    public bottomSecondaryToolPanelSizeRef: ToolbarSizeRef = { current: null };

    /**
     * Mobile-only: height of the bottom panel. Updated by BottomToolPanel via onLayout.
     * Used by side panels to position above the bottom panel.
     */
    public mobileBottomPanelHeight = 0;

    /**
     * Vertical space occupied by the toolbars that frame the map area
     * (top bar, gears toolbar and bottom tool panel).
     */
    public getReservedToolbarHeight = (): number =>
        (this.topBarSizeRef.current?.clientHeight ?? 0)
        + (this.topToolbarSizeRef.current?.clientHeight ?? 0)
        + (this.bottomToolPanelSizeRef.current?.clientHeight ?? 0);

    public panelWidths$ = new BehaviorSubject<PanelLayout>({ leftWidth: 360, rightWidth: 360, bottomSecondaryHeight: 300 });

    /**
     * Tools to display in icons around the map.
     * Tools have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool with a given `id` already exists, it will be overwritten.
     */
    public toolIcons$ = new BehaviorSubject<Map<string, ToolIcon<TMap>>>(new Map());

    /**
     * Custom tools to display in a top section of the map.
     */
    public topTools$ = new BehaviorSubject<Map<string, ComponentType<TopToolsProps<TMap>>>>(new Map());

    /**
     * Custom tools to display in the application top bar
     */
    public topBarTools$ = new BehaviorSubject<Map<string, ComponentType>>(new Map());

    /**
     * Subscribe to changes of tool icon placements.
     */
    public toolIconsByPlacement$: Observable<ObservedToolIcon<TMap>[]> = this.toolIcons$.pipe(
        switchMap((toolsMap) => {
            const toolIcons = [...toolsMap.entries()];

            if (toolIcons.length === 0) {
                return of([]);
            }

            return combineLatest(
                toolIcons.map(([id, { placement$, ...toolIcon }]) =>
                    combineLatest([placement$]).pipe(
                        map(([placement]): ObservedToolIcon<TMap> => ({ id, placement, ...toolIcon }))
                    )
                )
            );
        })
    );

    private toolPanelsIndexesSubscription: Subscription

    public constructor() {
        this.toolPanelsIndexesSubscription = this.toolPanelsByPlacement$.subscribe((value) => {
            const toolPanelsByPlacement = this.getToolPanelsByPlacement(value);
            if (this.activeLeftPanelToolId$.value !== null && toolPanelsByPlacement.left.every(({ id }) => id !== this.activeLeftPanelToolId$.value)) {
                this.activeLeftPanelToolId$.next(toolPanelsByPlacement.left[0]?.id ?? null);
            }
            if (this.activeRightPanelToolId$.value !== null && toolPanelsByPlacement.right.every(({ id }) => id !== this.activeRightPanelToolId$.value)) {
                this.activeRightPanelToolId$.next(toolPanelsByPlacement.right[0]?.id ?? null);
            }
            if (this.activeBottomPanelToolId$.value !== null && toolPanelsByPlacement.bottom.every(({ id }) => id !== this.activeBottomPanelToolId$.value)) {
                this.activeBottomPanelToolId$.next(toolPanelsByPlacement.bottom[0]?.id ?? null);
            }
        });
    }

    public cleanUp = () => {
        this.toolPanelsIndexesSubscription.unsubscribe();
    };

    public getToolPanelsByPlacement = (toolComponents: ObservedToolPanel<TMap>[]) => {
        return toolComponents.reduce<{ [key in ToolPanelPlacement]: ObservedToolPanel<TMap>[] }>((acc, val) => {
            acc[val.placement].push(val);
            return acc;
        }, { right: [], bottom: [], left: [] });
    };

    public getToolIconsByPlacement = (toolIcons: ObservedToolIcon<TMap>[]) => {
        return toolIcons.reduce<{ [key in ToolIconPlacement]: ObservedToolIcon<TMap>[] }>((acc, val) => {
            acc[val.placement].push(val);
            return acc;
        }, { right: [], left: [] });
    };

    /**
     * Adds a new tool popup.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not add/remove sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool popup with a given `id` already exists, it will be overwritten.
     */
    public addToolPopup = (
        id: string,
        { title, icon, contentComponent, onClose }: {
            title: TranslationId;
            icon?: string;
            contentComponent: ComponentType<ToolPopupProps<TMap>>;
            onClose: () => void;
        }
    ) => {
        const nextToolPopups = new Map(this.toolPopups$.value);
        nextToolPopups.set(id, { title, icon, contentComponent, onClose });
        this.toolPopups$.next(nextToolPopups);
    };

    /**
     * Removes the tool  popup with a given `id`.
     */
    public removeToolPopup = (id: string) => {
        const nextToolPopups = new Map(this.toolPopups$.value);
        nextToolPopups.delete(id);
        this.toolPopups$.next(nextToolPopups);
    };

    /**
     * Adds a new tool panel to display.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool panel with a given `id` already exists, it will be overwritten.
     */
    public addToolPanel = (
        id: string,
        { title, icon, placement, headerComponent, contentComponent }: {
            title: TranslationId, icon: string;
            placement: ToolPanelPlacement;
            headerComponent?: ComponentType<ToolPanelProps<TMap>>;
            contentComponent: ComponentType<ToolPanelProps<TMap>>;
        }
    ) => {
        const nextToolPanels = new Map(this.toolPanels$.value);
        nextToolPanels.set(id, {
            title,
            icon,
            placement$: new BehaviorSubject(placement),
            headerComponent,
            contentComponent,
        });
        this.toolPanels$.next(nextToolPanels);
    };

    /**
     * Removes the tool panel with a given `id`.
     */
    public removeToolPanel = (id: string) => {
        const nextToolPanels = new Map(this.toolPanels$.value);
        nextToolPanels.delete(id);
        this.toolPanels$.next(nextToolPanels);
    };

    /**
     * Updates the placement of a panel with a given `id`.
     * @param id 
     * @param placement 
     */
    public updateToolPanelPlacement = (id: string, placement: ToolPanelPlacement) => {
        this.toolPanels$.value.get(id)?.placement$.next(placement);
    };

    /**
     * Adds a new tool icon to display.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool icon with a given `id` already exists, it will be overwritten.
     */
    public addToolIcon = (
        id: string,
        { tooltip, value = null, icon, placement, disabled = false, onClick, active = false, rotate = 0, pitch = 0 }: {
            icon?: string,
            value?: string | null,
            tooltip: TranslationId | ((value: string | null) => TranslationId),
            placement: ToolIconPlacement;
            disabled?: boolean;
            active?: boolean;
            rotate?: number;
            pitch?: number;
            onClick?: (map: TMap) => void;
        },
    ): ToolIcon<TMap> => {
        const nextToolIcons = new Map(this.toolIcons$.value);
        const toolIcon: ToolIcon<TMap> = {
            tooltip,
            icon,
            anchorRef$: new BehaviorSubject<ToolIconAnchorRef>({ current: null }),
            value$: new BehaviorSubject(value),
            placement$: new BehaviorSubject(placement),
            disabled$: new BehaviorSubject(disabled),
            active$: new BehaviorSubject(active),
            rotate$: new BehaviorSubject(rotate),
            pitch$: new BehaviorSubject(pitch),
            onClick
        };
        nextToolIcons.set(id, toolIcon);
        this.toolIcons$.next(nextToolIcons);

        return toolIcon;
    };

    /**
     * Removes the tool icon with a given `id`.
     */
    public removeToolIcon = (id: string) => {
        const nextToolIcons = new Map(this.toolIcons$.value);
        nextToolIcons.delete(id);
        this.toolIcons$.next(nextToolIcons);
    };

    /**
     * Adds a new top tool to display.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool with a given `id` already exists, it will be overwritten.
     */
    public addTopTool = (id: string, component: ComponentType<TopToolsProps<TMap>>) => {
        const nextTopTools = new Map(this.topTools$.value);
        nextTopTools.set(id, component);
        this.topTools$.next(nextTopTools);
    };

    /**
     * Removes the top tool with a given `id`.
     */
    public removeTopTool = (id: string) => {
        const nextTopTools = new Map(this.topTools$.value);
        nextTopTools.delete(id);
        this.topTools$.next(nextTopTools);
    };

    /**
     * Adds a new top bar tool to display in the application top bar.
     */
    public addTopBarTool = (id: string, component: ComponentType) => {
        const nextTopBarTools = new Map(this.topBarTools$.value);
        nextTopBarTools.set(id, component);
        this.topBarTools$.next(nextTopBarTools);
    };

    /**
     * Removes the top bar tool with a given `id`.
     */
    public removeTopBarTool = (id: string) => {
        const nextTopBarTools = new Map(this.topBarTools$.value);
        nextTopBarTools.delete(id);
        this.topBarTools$.next(nextTopBarTools);
    };
}

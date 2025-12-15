import { Gear } from "../../apparatus";
import { ImageMarkers } from "./images/ImageMarkers";
import { RouteLayer } from "./RouteLayer";

export const routeGear: Gear = {
    id: 'route',
    engage: (stateWarden) => {
        stateWarden.cartomancer.addOverlay({
            id: 'route',
            component: RouteLayer,
        });
        stateWarden.cartomancer.addOverlay({
            id: 'images',
            component: ImageMarkers,
        });
    },
    disengage: (stateWarden) => {
        stateWarden.cartomancer.removeOverlay('route');
        stateWarden.cartomancer.removeOverlay('images');
    },
}

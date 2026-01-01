import { Gear } from "@apparatus";
import { ImageMarkers } from "./images/ImageMarkers";
import { RouteLayer } from "./RouteLayer";
import { ImagesLayer } from "./images/ImagesLayer";

export const routeGear: Gear = {
    id: 'route',
    engage: (stateWarden) => {
        stateWarden.cartomancer.addOverlay({
            id: 'route',
            component: RouteLayer,
        });
        stateWarden.cartomancer.addOverlay({
            id: 'images',
            component: ImagesLayer,
        });
    },
    disengage: (stateWarden) => {
        stateWarden.cartomancer.removeOverlay('route');
        stateWarden.cartomancer.removeOverlay('images');
    },
}

import { Gear } from "../../apparatus";
import { RouteLayer } from "./RouteLayer";

export const RouteGear: Gear = {
    id: 'route',
    engage: (stateWarden) => {
        stateWarden.cartomancer.addOverlay({
            id: 'route',
            component: RouteLayer,
        });
        stateWarden.cartomancer.addOverlay({
            id: 'images',
            component: RouteLayer,
        });
    },
    disengage: (stateWarden) => {
        stateWarden.cartomancer.removeOverlay('route');
        stateWarden.cartomancer.removeOverlay('images');
    },
}

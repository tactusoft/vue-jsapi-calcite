import config from '@arcgis/core/config';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import Expand from '@arcgis/core/widgets/Expand';
import Legend from '@arcgis/core/widgets/Legend';
import Print from '@arcgis/core/widgets/Print';
import Home from '@arcgis/core/widgets/Home';
//import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Locate from '@arcgis/core/widgets/Locate';
//import Search from '@arcgis/core/widgets/Search';

config.assetsPath = './assets';

export const webmap = new WebMap({
    portalItem: {
        id: '7b0495780f954b8493bba68c65e800fb'
    }
});

export const view = new MapView({
    container: 'viewDiv',
    map: webmap
});

export const legend = new Expand({
    content: new Legend({
        view,
        style: 'card'
    }),
    view,
    expanded: true
});
view.ui.add(legend, 'bottom-left');

view.ui.add(new Home({ id: "homeWidget", view }), 'top-left');
view.ui.add(new Locate({ view }), 'top-left');
//view.ui.add(new ScaleBar({ id: "scaleBarWidget", view, style: 'ruler' }), 'bottom-right');
//view.ui.add(new Search({ view }), 'bottom-trailing');

/**
 * Assigns the container element to the View
 * @param container
 */
export const initialize = (container) => {
    view.container = container;
    view.when()
        .then(() => {
            console.log('Map and View are ready');
        })
        .catch(error => {
            console.warn('An error in creating the map occured:', error);
        });
};

export function initializePrint(container) {
    const print = new Print({ view, container });
    return print;
}
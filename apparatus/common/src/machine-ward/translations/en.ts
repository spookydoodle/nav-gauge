import { TranslationTable } from "../translatron";
import { MachineTranslationKey } from "../model";

const en: TranslationTable<MachineTranslationKey>['en'] = {
    legal: 'Legal',
    privacy: 'Privacy',
    close: 'Close',
    save: 'Save',
    on: 'On',
    off: 'Off',
    menu: 'Application menu',
    'toggle-mode': 'Toggle light and dark modes',
    gears: 'Gears',
    collapse: 'Collapse',
    expand: 'Expand',
    'panel-menu': 'Panel options',
    'swap-placement': 'Place panel on the {{placement}}',
    'under-construction': 'Under construction',
};

export default en;

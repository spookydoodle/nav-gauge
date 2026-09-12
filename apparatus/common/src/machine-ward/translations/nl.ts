import { TranslationTable } from "../translatron";
import { MachineTranslationKey } from "../model";

const nl: TranslationTable<MachineTranslationKey>['nl'] = {
    legal: 'Juridisch',
    privacy: 'Privacy',
    close: 'Sluiten',
    save: 'Opslaan',
    on: 'Aan',
    off: 'Uit',
    menu: 'Applicatiemenu',
    'toggle-mode': 'Schakel tussen lichte en donkere modus',
    gears: 'Versnellingen',
    collapse: 'Inklappen',
    expand: 'Uitklappen',
    'panel-menu': 'Panel options',
    'swap-placement': 'Place panel on the {{placement}}',
    'under-construction': 'In aanbouw',
};

export default nl;

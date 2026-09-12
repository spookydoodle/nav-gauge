import { TranslationTable } from "../translatron";
import { MachineTranslationKey } from "../model";

const pl: TranslationTable<MachineTranslationKey>['pl'] = {
    legal: 'Informacje prawne',
    privacy: 'Prywatność',
    close: 'Zamknij',
    save: 'Zapisz',
    on: 'Wł.',
    off: 'Wył.',
    menu: 'Menu aplikacji',
    'toggle-mode': 'Przełącz tryb jasny i ciemny',
    gears: 'Tryby',
    collapse: 'Zwiń',
    expand: 'Rozwiń',
    'panel-menu': 'Panel options',
    'swap-placement': 'Place panel on the {{placement}}',
    'under-construction': 'W budowie',
};

export default pl;

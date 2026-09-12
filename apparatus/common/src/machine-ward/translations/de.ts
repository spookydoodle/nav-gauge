import { TranslationTable } from "../translatron";
import { MachineTranslationKey } from "../model";

const de: TranslationTable<MachineTranslationKey>['de'] = {
    legal: 'Rechtliches',
    privacy: 'Datenschutz',
    close: 'Schließen',
    save: 'Speichern',
    on: 'Ein',
    off: 'Aus',
    menu: 'Anwendungsmenü',
    'toggle-mode': 'Hell- und Dunkelmodus umschalten',
    gears: 'Getriebe',
    collapse: 'Einklappen',
    expand: 'Ausklappen',
    'panel-menu': 'Paneloptionen',
    'swap-placement': 'Platzieren Sie das Panel auf der {{placement}}',
    'under-construction': 'Im Aufbau',
};

export default de;

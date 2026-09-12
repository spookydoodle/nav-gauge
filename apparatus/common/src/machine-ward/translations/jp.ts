import { TranslationTable } from "../translatron";
import { MachineTranslationKey } from "../model";

const jp: TranslationTable<MachineTranslationKey>['jp'] = {
    legal: '法的情報',
    privacy: 'プライバシー',
    close: '閉じる',
    save: '保存',
    on: 'オン',
    off: 'オフ',
    menu: 'アプリケーションメニュー',
    'toggle-mode': 'ライトモードとダークモードを切り替え',
    gears: 'ギア',
    collapse: '折りたたむ',
    expand: '展開する',
    'panel-menu': 'Panel options',
    'swap-placement': 'Place panel on the {{placement}}',
    'under-construction': '建設中',
};

export default jp;

import ka from './ka';
import en from './en';

interface IKey {
    [key: string]: any;
}

export const KA = 'ka-GE';
export const EN = 'en-US';

export const LANG_KEYS: IKey = {
    ka: KA, en: EN
}

const translateList: IKey = {
     ka, en
}

export default translateList
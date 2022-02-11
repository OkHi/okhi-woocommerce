import { PreloadedJSONData } from '../interfaces/preloaded-json-data.interface';

declare const wcOkHiJson: PreloadedJSONData;

export function autoPrefixPhone(phone: string) {
    if (phone?.indexOf('0') === 0) {
        return wcOkHiJson.countryCallingCode + phone.slice(1);
    }
    return phone;
}

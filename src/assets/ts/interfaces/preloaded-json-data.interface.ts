export interface PreloadedJSONData {
    app: {
        name: string;
        version: string;
        build: number;
    };
    config: {
        appBar: {
            color: string;
        };
        streetviewEnabled: boolean;
        toTheDoorEnabled: boolean;
    };
    styles: {
        color: string;
        logo: string;
        name: string;
        classes: {
            'lc-container': string;
            'lc-title': string;
            'lc-button': string;
            'lc-top': string;
            'lc-bottom': string;
            'block-button': string;
            'up-container': string;
            'up-message': string;
            'lc-information': string;
        };
    };
    countryCallingCode: string;
    key: string;
}

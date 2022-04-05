export interface Location {
    street_name: string;
    property_name: string;
    property_number: string;
    geo_point: { lat: string; lon: string };
    directions: string;
    unit: string;
    business_name: string;
    id: string;
    url: string;
    other_information: string;
    place_id: string;
    plus_code: string;
    neighborhood: string;
    city: string;
    state: string;
}

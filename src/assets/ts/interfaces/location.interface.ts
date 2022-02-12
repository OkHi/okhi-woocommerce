export interface Location {
    street_name: string;
    property_name: string;
    property_number: string;
    geo_point: { lat: string; lon: string };
    directions: string;
    id: string;
    url: string;
    other_information: string;
    place_id: string;
    plus_code: string;
    token: string;
}

export interface PlaceResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    name?: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
    address?: {
        city?: string;
        state?: string;
        country?: string;
        country_code?: string;
    };
}

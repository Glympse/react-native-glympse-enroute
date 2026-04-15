import type LatLng from "./LatLng";

export default interface Track {
  length: number;
  locations: LatLng[];
  distance: number;
}

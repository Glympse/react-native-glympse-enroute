import type Place from "./Place";
import type Track from "./Track";

export default interface Ticket {
  id: string;
  visibility: string;
  isCompleted: boolean;
  destination: Place;
  track: Track;
  eta: number;
  route: Track;
  travelMode: number;
}

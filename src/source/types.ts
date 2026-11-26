
export interface HeroCard {
  id: number;
  left:string;
  top: string;
  rot: number;
  bg: string;
  body: string;
  z: number;
}
export interface Strips {
    id: number;
    grow: string;
    bg: string;
    label: string;
    quantity: number;
}
export interface Cars{
  id: number;
  title: string;
  year: string;
 get meta(): string;
  tag: string;
  price: string;
  seller: string;
  city: string;
  body: string;
  bg: string;
  avatar: string;
}
export type HeroCards = HeroCard[];
export type StripsList = Strips[];
export type CarsList = Cars[];
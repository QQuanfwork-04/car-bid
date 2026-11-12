import Catagory from "./components/Catagories";
import Live from "./components/Live";
import Typecar from "./components/Type";

export interface HeroCard {
  id: number;
  left: string;
  top: string;
  rot: number;
  bg: string;
  body: string;
  z: number;
  tag: string;
  price: string;
  title: string;
  specs: string;
  location: string;
}

const Body = ({ heroCard }: { heroCard: HeroCard [] }) => {
  return (
    <section className="main_content">
      <Live card={heroCard} />
      <Typecar />
      <Catagory />
    </section>
  );
};
export default Body;

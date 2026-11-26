import Catagory from "./components/Catagories";
import Live from "./components/Live";
import Typecar from "./components/Type";
import type {HeroCard, Strips, Cars } from "./types"

interface BodyProps {
  heroCard: HeroCard[];
  strips: Strips[];
  cars: Cars[];

}

const Body = ({ heroCard, strips, cars }: BodyProps) => {
  return (
    <section className="main_content">
      <Live card={heroCard} />
      <Typecar strip={strips}/>
      <Catagory car={cars}/>
    </section>
  );
};
export default Body;

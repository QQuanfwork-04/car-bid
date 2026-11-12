// import { useState } from 'react'
import "./App.css";
import Header from "./source/Header";
import Body from "./source/BodyMain";

function App() {
  const heroCards = [
  {
    id: 1,
    left: '3%',
    top: '24%',
    rot: -19,
    bg: 'linear-gradient(to bottom, #FDE6D0, #E09163)',
    body: '#FFFF',
    z: 1,
    tag: 'Offers welcome',
    price: '$18,500',
    title: 'Toyota Camry SE',
    specs: '2020 · 42,000 km · Petrol · Automatic',
    location: 'Minh Tran - Austin, TX',
  },
  {
    id: 2,
    left: '21%',
    top: '3%',
    rot: -7,
    bg: 'linear-gradient(to bottom, #c1cff8, #7e8daa)',
    body: 'black',
    z: 2,
    tag: 'Verified',
    price: '$21,200',
    title: 'Honda Civic RS',
    specs: '2021 · 31,500 km · Petrol · CVT',
    location: 'Sarah Le - Dallas, TX',
  },
  {
    id: 3,
    left: '41%',
    top: '-6%',
    rot: -1,
    bg: 'linear-gradient(to bottom, #eaa7b4, #d57888)',
    body: '#800020',
    z: 3,
    tag: 'Hot deal',
    price: '$24,800',
    title: 'Mazda 6 Signature',
    specs: '2022 · 19,000 km · Petrol · Automatic',
    location: 'David Nguyen - Houston, TX',
  },
  {
    id: 4,
    left: '61%',
    top: '3%',
    rot: 5,
    bg: 'linear-gradient(to bottom, #F3E8FF, #b67ae8)',
    body: '#dabdf7',
    z: 4,
    tag: 'Offers welcome',
    price: '$29,500',
    title: 'Hyundai Tucson Hybrid',
    specs: '2022 · 25,400 km · Hybrid · Automatic',
    location: 'Anna Pham - San Jose, CA',
  },
  {
    id: 5,
    left: '78%',
    top: '22%',
    rot: 14,
    bg: 'linear-gradient(to bottom , #d9fbb4, #a5cc74)',
    body: '#d9f5cc',
    z: 5,
    tag: 'Price drop',
    price: '$23,900',
    title: 'Kia K5 GT-Line',
    specs: '2021 · 38,000 km · Petrol · Automatic',
    location: 'Kevin Hoang - Seattle, WA',
  }
];
  return (
    <>
      <Header />
      <Body heroCard={heroCards} />
    </>
  );
}

export default App;

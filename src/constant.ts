import type { HeroCard, Strips, Cars } from "./source/types";
export const heroCards: HeroCard[] = [
    {
      id: 1,
      left: "2%",
      top: "28%",
      rot: -19,
      bg: "linear-gradient(to bottom, #f6bb84, #e37333)",
      body: "#FFFF",
      z: 1
    },
    {
      id: 2,
      left: "19%",
      top: "12%",
      rot: -8,
      bg: "linear-gradient(to bottom, #c3cce8, #7e8daa)",
      body: "black",
      z: 2
    },
    {
      id: 3,
      left: "39%",
      top: "1%",
      rot: -1,
      bg: "linear-gradient(to bottom, #eaa7b4, #eda0ad)",
      body: "#800020",
      z: 3
    },
    {
      id: 4,
      left: "59%",
      top: "10%",
      rot: 7,
      bg: "linear-gradient(to bottom, #cfacf5, #ab58f0)",
      body: "#dabdf7",
      z: 4
    },
    {
      id: 5,
      left: "77%",
      top: "25%",
      rot: 17,
      bg: "linear-gradient(to bottom , #d9fbb4, #9fba7e)",
      body: "#d9f5cc",
      z: 5
    },
  ];

  export const strips : Strips[] = [
    {
      id: 1,
      grow: "scale-105",
      bg: "linear-gradient(to bottom, #FFE4E6, #FDA4AF)",
      label: "Sedan",
      quantity: 12,
    },
    {
      id: 2,
      grow: "scale-100",
      bg: "linear-gradient(to bottom, #E0F2FE, #7DD3FC)",
      label: "SUV",
      quantity: 8,
    },
    {
      id: 3,
      grow: "scale-110",
      bg: "linear-gradient(to bottom, #EDE9FE, #A78BFA)",
      label: "Coupe",
      quantity: 5,
    },
    {
      id: 4,
      grow: "scale-100",
      bg: "linear-gradient(to bottom, #CCFBF1, #2DD4BF)",
      label: "Electric",
      quantity: 15,
    },
    {
      id: 5,
      grow: "scale-105",
      bg: "linear-gradient(to bottom, #FFEDD5, #FB923C)",
      label: "Hatchback",
      quantity: 7,
    }
  ];
  export const carsList: Cars[] = [
    {
      id: 1,
      title: "BMW 330i Sport",
      year: "2021",
      get meta() {
        return `${this.year}· 28,000 km · Petrol`;
      },
      tag: "Certified",
      price: "$32,400",
      seller: "Alex Bui",
      city: "Ho Chi Minh",
      body: "Sedan",
      bg: "linear-gradient(to bottom, #FFE4E6, #FDA4AF)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 2,
      title: "Mercedes GLC 200",
      year: "2020",
      get meta() {
        return `${this.year} · 35,000 km · Petrol`;
      },
      tag: "Best Seller",
      price: "$26,100",
      seller: "Hoang Nam",
      city: "Hanoi",
      body: "SUV",
      bg: "linear-gradient(to bottom, #E0F2FE, #7DD3FC)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 3,
      title: "Audi A5 Sportback",
      year: "2022",
      get meta() {
        return `${this.year} · 15,200 km · Petrol`;
      },
      tag: "Limited",
      price: "$41,500",
      seller: "Thu Ha",
      city: "Da Nang",
      body: "Coupe",
      bg: "linear-gradient(to bottom, #EDE9FE, #A78BFA)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 4,
      title: "Tesla Model 3",
      year: "2021",
      get meta() {
        return `${this.year} · 22,000 km · Electric`;
      },
      tag: "Eco Friendly",
      price: "$35,000",
      seller: "Minh Tu",
      city: "Thu Duc",
      body: "Electric",
      bg: "linear-gradient(to bottom, #CCFBF1, #2DD4BF)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 5,
      title: "Mini Cooper S",
      year: "2019",
      get meta() {
        return `${this.year} · 48,000 km · Petrol`;
      },
      tag: "Super Deal",
      price: "$22,800",
      seller: "Khanh Linh",
      city: "Bien Hoa",
      body: "Hatchback",
      bg: "linear-gradient(to bottom, #FFEDD5, #FB923C)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 6,
      title: "Toyota Camry SE",
      year: "2020",
      get meta() {
        return `${this.year} · 42,000 km · Petrol`;
      },
      tag: "Offers welcome",
      price: "$18,500",
      seller: "Minh Tran",
      city: "Austin",
      body: "Sedan",
      bg: "linear-gradient(to bottom, #FDE6D0, #E09163)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 7,
      title: "Honda Civic RS",
      year: "2021",
      get meta() {
        return `${this.year} · 31,500 km · Petrol`;
      },
      tag: "Verified",
      price: "$21,200",
      seller: "Sarah Le",
      city: "Dallas",
      body: "Sedan",
      bg: "linear-gradient(to bottom, #F1F5F9, #94A3B8)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 8,
      title: "Mazda 6 Signature",
      year: "2022",
      get meta() {
        return `${this.year} · 19,000 km · Petrol`;
      },
      tag: "Hot deal",
      price: "$24,800",
      seller: "David Nguyen",
      city: "Houston",
      body: "Sedan",
      bg: "linear-gradient(to bottom, #DCFCE7, #4ADE80)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 9,
      title: "Hyundai Tucson Hybrid",
      year: "2022",
      get meta() {
        return `${this.year} · 25,400 km · Hybrid`;
      },
      tag: "Offers welcome",
      price: "$29,500",
      seller: "Anna Pham",
      city: "San Jose",
      body: "SUV",
      bg: "linear-gradient(to bottom, #F3E8FF, #C084FC)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 10,
      title: "Kia K5 GT-Line",
      year: "2021",
      get meta() {
        return `${this.year}· 38,000 km · Petrol`;
      },
      tag: "Price drop",
      price: "$23,900",
      seller: "Kevin Hoang",
      city: "Seattle",
      body: "Sedan",
      bg: "linear-gradient(to bottom, #FEF9C3, #FACC15)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 11,
      title: "Ford Ranger Wildtrak",
      year: "2021",
      get meta() {
        return `${this.year} · 40,000 km · Diesel`;
      },
      tag: "Top Rated",
      price: "$31,000",
      seller: "Quoc Bao",
      city: "Can Tho",
      body: "Truck",
      bg: "linear-gradient(to bottom, #E2E8F0, #64748B)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 12,
      title: "Lexus RX 350",
      year: "2019",
      get meta() {
        return `${this.year} · 52,000 km · Petrol`;
      },
      tag: "Luxury",
      price: "$48,000",
      seller: "Thanh Mai",
      city: "Ho Chi Minh",
      body: "SUV",
      bg: "linear-gradient(to bottom, #FBCFE8, #EC4899)",
      avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 13,
      title: "Porsche Macan",
      year: "2021",
      get meta() {
        return `${this.year} · 18,000 km · Petrol`;
      },
      tag: "Premium",
      price: "$65,000",
      seller: "Hoang Long",
      city: "Hanoi",
      body: "SUV",
      bg: "linear-gradient(to bottom, #FEF08A, #EAB308)",
        avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 14,
      title: "VinFast VF 8",
      year: "2023",
      get meta() {
        return `${this.year} · 10,000 km · Electric`;
      },
      tag: "EV Special",
      price: "$33,000",
      seller: "Ngoc Anh",
      city: "Hai Phong",
      body: "Electric",
      bg: "linear-gradient(to bottom, #BAE6FD, #0284C7)",  
    avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 15,
      title: "Subaru Forester",
      year: "2020",
      get meta() {
        return `${this.year} · 45,000 km · Petrol`;
      },
      tag: "Safe Pick",
      price: "$25,000",
      seller: "Duc Minh",
      city: "Da Nang",
      body: "SUV",
      bg: "linear-gradient(to bottom, #BBF7D0, #22C55E)",
        avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 16,
      title: "Volkswagen Beetle",
      year: "2018",
      get meta() {
        return `${this.year} · 60,000 km · Petrol`;
      },
      tag: "Classic",
      price: "$19,800",
      seller: "Phuong Vy",
      city: "Vung Tau",
      body: "Hatchback",
      bg: "linear-gradient(to bottom, #FED7AA, #F97316)",
     avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 17,
      title: "Chevrolet Corvette",
      year: "2022",
      get meta() {
        return `${this.year} · 8,000 km · Petrol`;
      },
      tag: "Supercar",
      price: "$85,000",
      seller: "Tuan Hung",
      city: "Ho Chi Minh",
      body: "Coupe",
      bg: "linear-gradient(to bottom, #FECACA, #EF4444)",
        avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
    {
      id: 18,
      title: "Land Rover Defender",
      year: "2022",
      get meta() {
        return `${this.year} · 21,000 km · Diesel`;
      },
      tag: "Off-road",
      price: "$78,000",
      seller: "Gia Huy",
      city: "Nha Trang",
      body: "SUV",
      bg: "linear-gradient(to bottom, #DDD6FE, #8B5CF6)",
        avatar: "https://cdn.motor1.com/images/mgl/0AN2Z/s1/2021-bmw-3-series.jpg"
    },
  ]


export default { heroCards, strips, carsList };
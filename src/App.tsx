// import { useState } from 'react'
import "./App.css";
// import Header from "./source/Header";
// import Body from "./source/BodyMain";
// import AuthLogin from "./source/AuthLogin";
import AuthRegister from "./source/AuthRegister";
import axios from "axios";
// import { useEffect, useState } from "react";
// import { heroCards, strips, carsList } from "./constant";

const api = axios.create({
  baseURL: "https://6afe68633a0e70bc8d536f47.mockapi.io/car",
  timeout: 5000,
}); //Tao instance axios voi baseURL va timeout
    //baseUrl dung de gui request den API, timeout la thoi gian cho phep cho request tra ve ket qua
    //Instance axios cho phep ta co the su dung cac interceptor de xu ly request va response
    //interceptor la mot ham trung gian giua request va response, cho phep ta co the them header, xu ly loi, redirect, ...
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Interceptor request duoc su dung de them header Authorization vao request neu co token trong localStorage
// localStorage la mot bo nho cua trinh duyet, cho phep luu tru du lieu tren trinh duyet, o day ta luu tru token de xac thuc nguoi dung
// localStorage.getItem("access_token") dung de lay token tu localStorage, neu co thi them vao header Authorization
// token tao ra tu server khi nguoi dung dang nhap thanh cong, va duoc luu trong localStorage de su dung cho cac request sau nay
// if (token) { config.headers.Authorization = `Bearer ${token}`; } dung de kiem tra neu co token thi them vao header Authorization, neu khong thi khong lam gi ca
//header Authorization la mot header duoc su dung de gui token xac thuc nguoi dung den server, o day ta su dung Bearer token, la mot kieu token duoc su dung pho bien nhat hien nay
//bearer la chuan de gan token tuc la noi voi user, co token la co quyen truy cap vao API, neu khong co token thi khong duoc truy cap vao API
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(
          "https://api.example.com/auth/refresh",
          { token: refreshToken },
        );
        localStorage.setItem("access_token", response.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return api(originalRequest);
      } catch (error) {
        localStorage.clear();
        window.location.reload(); // Optionally redirect to login page
      }
      // Handle unauthorized error, e.g., redirect to login page
      console.error("Unauthorized access - redirecting to login.");
    }
    return Promise.reject(error);
  },
);
//Interceptor response duoc su dung de xu ly loi 401 Unauthorized, neu co loi 401 thi ta se thu refresh token de lay access token moi
//originalRequest là request gốc mà ta đã gửi đi, nếu có lỗi 401 thì ta sẽ gửi lại request này sau khi đã refresh token thành công
//refresh token là một loại token đặc biệt được sử dụng để lấy access token mới khi access token cũ hết hạn, refresh token thường có thời gian sống lâu hơn access token
//refresh la một request gửi đến server để lấy access token mới, nếu thành công thì ta sẽ lưu access token mới vào localStorage và gửi lại request gốc với access token mới
//if (error.response?.status === 401 && !originalRequest._retry) tuc la kiem tra response co status la 401 va originalRequest chua duoc retry, neu dung thi ta se thu refresh token de lay access token moi
//originalRequest._retry = true; tuc la danh dau originalRequest da duoc retry, de tranh lap lai viec thu refresh token nhieu lan
//_retry la mot thuoc tinh tu tao ra de danh dau request da duoc retry hay chua, de tranh viec lap lai viec thu refresh token nhieu lan
//_retry co san trong axios, neu khong co thi ta co the tu tao ra nhu tren, de danh dau request da duoc retry hay chua
function App() {
//   type UserApi = {
//     id: string;
//     name: string;
//     createAt: Date;
//     city: string;
//     avatar: string;
//   };
  
//   type CarType = {
//     id: string;
//     name: string;
//     createdAt: Date;
//   };
//   type ApiData = {
//     id: string;
//     name: string;
//     createdAt: Date;
//   }[];
//   const [data, setData] = useState<ApiData>([]);
//   const [newItem, setNewItem] = useState<CarType | null>(null);
//   const [user, setUser] = useState<UserApi[]>([]);
//   //type ApiData la mot mang chua cac doi tuong co id, name, createdAt
//   //useState<ApiData>([]) la mot hook cua react de tao state data co kieu ApiData, ban dau la mot mang rong
//   //useState<CarType | null>(null) la mot hook cua react de tao state newItem co kieu CarType hoac null, ban dau la null
//   //useState la mot hook cua react de tao state, tra ve mot mang co hai phan tu, phan tu dau tien la gia tri hien tai cua state, phan tu thu hai la mot ham de cap nhat gia tri cua state
//   //type CarType la mot kieu du lieu co id, name, createdAt, dung de luu tru thong tin cua mot car
//  // type la mot tu khoa cua typescript de khai bao kieu du lieu, de tranh loi khi code, de giup code de doc hon

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const res = await fetch("https://6afe68633a0e70bc8d536f47.mockapi.io/user");
//         const data = await res.json();
//         setUser(data);
//       } catch(err){
//         console.error("Error fetching user data:", err);
//       }
//     }
//     //goi .json vi fetch, neu khong goi .json thi data se la mot stream, khong phai la mot doi tuong, de tranh loi khi code, ta can goi .json de chuyen doi stream thanh doi tuong
//     //xai fetch nen phai goi .json de chuyen doi stream thanh doi tuong, neu khong goi .json thi data se la mot stream, khong phai la mot doi tuong, de tranh loi khi code, ta can goi .json de chuyen doi stream thanh doi tuong
//     const fetchData = async () => {
//       try {
//         const response = await api.get<ApiData>("/");
//         const data = response as any;
//         console.log("Fetched data:", response);
//         setData(data);
//         console.log("API Response:", data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
      
//     };
    
//     //useEffect la mot hook cua react de thuc hien mot tac vu khi component duoc render, tuc la khi component duoc hien thi tren man hinh
//     //useEffect(() => { ... }, []); tuc la chi thuc hien mot lan khi component duoc render lan dau tien, vi mang rong [] la mot mang cac phu thuoc, neu khong co phu thuoc thi chi thuc hien mot lan
//     //useEffect(() => {...}, [data]); tuc la thuc hien lai khi data thay doi, vi data la mot phu thuoc, neu data thay doi thi useEffect se thuc hien lai
//     //fetchData la mot ham bat dong bo de lay du lieu tu API, su dung async/await de cho phep code doc hon, de tranh viec callback hell
//     //fetchData = async () => { ... } tuc la khai bao mot ham bat dong bo, su dung async/await de cho phep code doc hon, de tranh viec callback hell
//     //tai sao fetchData lai duoc khai bao trong useEffect, vi neu khai bao ngoai useEffect thi fetchData se duoc khai bao moi lan khi component duoc render, lam cho code bi lap lai nhieu lan, neu khai bao trong useEffect thi fetchData chi duoc khai bao mot lan khi component duoc render lan dau tien
//     //tai sao lai khai bao la async ma kh phai sync, vi khi lay du lieu tu API thi la mot tac vu bat dong bo, tuc la khong biet khi nao se tra ve ket qua, neu khai bao la sync thi code se bi treo, neu khai bao la async thi code se chay tiep ma khong bi treo
//     //data = response as any; tuc la ep kieu du lieu cua response sang kieu any, de tranh loi khi code, vi response co the co nhieu kieu du lieu khac nhau, neu khong ep kieu thi code se bi loi
//     //tai sao data = response la ten bien, vi data la mot bien da duoc khai bao trong useState, neu khong doi ten thi code se bi loi, vi data da duoc khai bao trong useState, neu khong doi ten thi code se bi loi
//     //=response or =response.data, tuc la ep kieu du lieu cua response sang kieu ApiData, de tranh loi khi code, vi response co the co nhieu kieu du lieu khac nhau, neu khong ep kieu thi code se bi loi
//     //response va response.data la hai bien khac nhau, response la toan bo response tu API, con response.data chi la du lieu ma ta can lay tu response, vi response co the co nhieu thuoc tinh khac nhau nhu status, headers, config, request, data, ...
//     fetchUserData();
//     fetchData();
//   }, []);

//   const handleAddItem = async () => {
//     if (newItem) {
//       try {
//         const response = await api.post<CarType>("/", newItem);
//         const addedItem = await response as any;
//         setData((prevData) => [...prevData, addedItem]);
//         setNewItem(null); // Clear the input after adding
//       } catch (error) {
//         console.error("Error adding item:", error);
//       }
//     }
//   }
//     // const { heroCards, strips, carsList } = constants;

  return (
    <>
      {/* {data.length > 0 ? (
        <div>
          <h1>API Data</h1>
          <div
            style={{
              border: "1px solid blue",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>Add Car</p>
            <input
              value={newItem?.name || ""}
              onChange={(e) =>
                setNewItem({
                  id: "",
                  name: e.target.value,
                  createdAt: new Date(),
                })
              }
              style={{
                border: "1px solid gray",
                margin: "5px",
                padding: "5px",
              }}
              type="text"
              placeholder="Car Name"
            />
            
            <button
              style={{
                backgroundColor: "blue",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
              onClick={handleAddItem}
            >
              Add
            </button>
          </div>
          {data.map((item) => {
            return (
              <div
                style={{
                  border: "1px solid black",
                  margin: "10px",
                  padding: "10px",
                }}
                key={item.id}
              >
                <p>{item.name}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading data...</p>
      )}
      { user.length > 0 ? (
        <div>
          <h1>User Data</h1>
          {user.map((userItem) => {
            return (
              <div className="flex justify-content border w-full h-480px" key = {userItem.id}>
                <p>{userItem.name}</p>
                <img className="w-32 h-32 object-cover" src={userItem.avatar} alt={userItem.name} />
                <p>{userItem.city}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <p>Loading data...</p>
      )} */}
      {/* <Header />
      <Body heroCard={heroCards} strips={strips} cars={carsList} /> */}
      {/* <AuthLogin/> */}
      <AuthRegister/>
    </>
  );
}

export default App;



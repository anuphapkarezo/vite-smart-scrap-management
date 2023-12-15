import * as React from "react"; // นำเข้าโมดูลทั้งหมดที่ต้องการจาก React, ให้เราสามารถใช้งานฟีเจอร์ต่างๆ ของ React
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ProtectedRoutesSupper from "./components/auth/ProtectedRoutesSupper";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import Scrap_Record_Weight_Daily_Transaction from "./pages/Scrap_Record_Weight_Daily_Transaction";
import Scrap_Summary_Weight_Date_Take_Off from "./pages/Scrap_Summary_Weight_Date_Take_Off";
import Scrap_Deatil_Weight_by_Date from "./pages/Scrap_Deatil_Weight_by_Date";
import Scrap_Prices_List from "./pages/Scrap_Prices_List";
import Scrap_Company_List from "./pages/Scrap_Company_List";

export default function App() {
  
  return (
    
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="/home" element={<Navbar />} />
              <Route path="/env_scrap_record_weight_daily_transaction" element={<Scrap_Record_Weight_Daily_Transaction />}/>
              <Route path="/env_scrap_summary_weight_date_take_off" element={<Scrap_Summary_Weight_Date_Take_Off />}/>
              <Route path="/env_scrap_detail_weight_by_date" element={<Scrap_Deatil_Weight_by_Date />}/>
              <Route path="/env_scrap_prices_list" element={<Scrap_Prices_List />}/>
              <Route path="/env_scrap_company_list" element={<Scrap_Company_List />}/>
            </Route>
        </Routes>
  );
}

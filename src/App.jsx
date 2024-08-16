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
import Scrap_Monthly_Monitoring_by_buyer from "./pages/Scrap_Monthly_Monitoring_by_buyer";
import Scrap_Monthly_Monitoring_by_group from "./pages/Scrap_Monthly_Monitoring_by_group";
import Scrap_Monthly_Monitoring_by_group_factory from "./pages/Scrap_Monthly_Monitoring_by_group_factory";
import Scrap_Monthly_Monitoring_by_item from "./pages/Scrap_Monthly_Monitoring_by_item";
import Scrap_MOI_Waste_Master from "./pages/Scrap_MOI_Waste_Master";
import Scrap_Summary_Weight_MOI from "./pages/Scrap_Summary_Weight_MOI";
import Scrap_Waste_Item_Master_List from "./pages/Scrap_Waste_Item_Master_List";

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
              <Route path="/env_scrap_monthly_monitoring_by_buyer" element={<Scrap_Monthly_Monitoring_by_buyer />}/>
              <Route path="/env_scrap_monthly_monitoring_by_group" element={<Scrap_Monthly_Monitoring_by_group />}/>
              <Route path="/env_scrap_monthly_monitoring_by_group_factory" element={<Scrap_Monthly_Monitoring_by_group_factory />}/>
              <Route path="/env_scrap_monthly_monitoring_by_item" element={<Scrap_Monthly_Monitoring_by_item />}/>
              <Route path="/env_scrap_moi_waste_master" element={<Scrap_MOI_Waste_Master />}/>
              <Route path="/env_scrap_summary_weight_moi" element={<Scrap_Summary_Weight_MOI />}/>
              <Route path="/env_scrap_waste_item_master_list" element={<Scrap_Waste_Item_Master_List />}/>
            </Route>
        </Routes>
  );
}

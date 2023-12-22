import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import './Scrap_Deatil_Weight_by_Date.css'; // Import the CSS file
import axios from "axios";
import Smart_Scrap_SearchDetailsWeight from "../components/SearchGroup/Smart_Scrap_SearchDetailsWeight";

import Navbar from "../components/navbar/Navbar";

export default function Scrap_Deatil_Weight_by_Date({ onSearch }) {
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);

  const [distinct_waste_code, setDistinct_waste_code] = useState([]);
  const [distinct_details_waste, setDistinct_details_waste] = useState([]);

  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const fetch_waste_code = async () => {
    try {
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-waste-item-code-by-factory-group?factory=${selectedFactory}&group=${selectedGroup}`);
      const datawaste  = response.data;
      // const datawaste = await response.data;
      console.log('datawaste >', datawaste);
      setDistinct_waste_code(datawaste);
    } catch (error) {
      console.error(`Error fetching distinct data Group List: ${error}`);
    }
  };

  const fetch_details_waste = async () => {
    try {
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-details-weight-by-date?factory=${selectedFactory}&group=${selectedGroup}&from_dto=${selectedFromDate}&to_dto=${selectedToDate}`);
      const datawaste_details  = response.data;
      // const datawaste = await response.data;
      console.log('datawaste_details >', datawaste_details);
      setDistinct_details_waste(datawaste_details);
    } catch (error) {
      console.error(`Error fetching distinct data Group List: ${error}`);
    }
  };

  useEffect(() => {
    if (selectedFactory !== null && selectedGroup !== null && selectedFromDate !== null && selectedToDate !== null) {
      fetch_waste_code();
      fetch_details_waste();
    }
  }, [selectedFactory, selectedGroup , selectedFromDate , selectedToDate]);


  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
            <div className="w-screen ml-16 mt-20">
                <div >
                    {/* <Smart_Scrap_SearchFactoryGroup onSearch={onSearch} /> */}
                    <Smart_Scrap_SearchDetailsWeight
                        onSearch={(queryParams) => {
                        setSelectedFactory(queryParams.factory);
                        setSelectedGroup(queryParams.group);
                        setSelectedFromDate(queryParams.From_date_take_of);
                        setSelectedToDate(queryParams.To_date_take_of);
                        }}
                    />
                </div>
                <div style={{marginTop: 30 , fontSize: 14 , width: '1850px'}}>
                    <table>
                      <thead>
                          <tr>
                              <th
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#8ACDD7",
                                  height: "40px",
                                  width: "120px",
                                  paddingRight: 5,
                                  border: 'solid black 1px'
                                }}
                              >
                                Date take off
                              </th>
                              {distinct_waste_code.map((item, index) => {
                                  return (
                                    <th
                                      key={index}
                                      style={{
                                        textAlign: "center",
                                        width: "93px",
                                        fontSize: 12,
                                        backgroundColor: "#E4F1FF",
                                        border: 'solid black 1px'
                                      }}
                                    >
                                      {item.waste_item_code}
                                    </th>
                                  );
                                })}
                                <th
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#AED2FF",
                                  height: "40px",
                                  width: "150px",
                                  paddingRight: 5,
                                  border: 'solid black 1px'
                                }}
                              >
                                Update by
                              </th>
                              <th
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#AED2FF",
                                  height: "40px",
                                  width: "150px",
                                  paddingRight: 5,
                                  border: 'solid black 1px'
                                }}
                              >
                                Update datetime
                              </th>
                          </tr>
                      </thead>
                      <tbody style={{fontSize: 14 , textAlign: 'center'}}>
                      {distinct_details_waste.map((rowData, rowIndex) => (
                          <tr key={rowIndex}>
                            <td
                              style={{
                                textAlign: "center",
                                border: 'solid black 1px',
                                backgroundColor: '#F1EFEF'
                              }}
                            >
                              {rowData.waste_date_take_off}
                            </td>
                            {distinct_waste_code.map((item, index) => (
                              <td
                                key={index}
                                style={{
                                  textAlign: "center",
                                  fontSize: 12,
                                  border: 'solid black 1px',
                                  backgroundColor: '#F1EFEF',
                                  color: rowData.waste_item_code === item.waste_item_code && rowData.waste_weight > 0 ? 'blue' : 'brown',
                                  fontWeight: rowData.waste_item_code === item.waste_item_code && rowData.waste_weight > 0 ? 'bold' : 'normal'
                                }}
                              >
                                {rowData.waste_item_code === item.waste_item_code ? rowData.waste_weight : 0.00}
                              </td>
                            ))}
                            <td
                              style={{
                                textAlign: "left",
                                border: 'solid black 1px',
                                backgroundColor: '#F1EFEF'
                              }}
                            >
                              {rowData.waste_update_by}
                            </td>
                            <td
                              style={{
                                textAlign: "left",
                                border: 'solid black 1px',
                                backgroundColor: '#F1EFEF'
                              }}
                            >
                              {rowData.update_datetime}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
            </div>
        </Box>
    </>
  );
}
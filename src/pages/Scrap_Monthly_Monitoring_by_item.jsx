import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import axios from "axios";
import Smart_Scrap_SearchYearsMonitor from "../components/SearchGroup/Smart_Scrap_SearchYearsMonitor";
import Smart_Scrap_SearchYearsFactoryMonitor from "../components/SearchGroup/Smart_Scrap_SearchYearsFacMonitor";
import Smart_Scrap_SearchMonitorItem from "../components/SearchGroup/Smart_Scrap_SearchMonitorItem";
import CircularProgress from '@mui/material/CircularProgress';
import ReactApexChart from 'react-apexcharts';
import Button from '@mui/material/Button';

import Navbar from "../components/navbar/Navbar";

export default function Scrap_Monthly_Monitoring_by_item({ onSearch }) {
  const [selectedFromYear, setSelectedFromYear] = useState(null);
  const [selectedToYear, setSelectedToYear] = useState(null);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [distinctMonthInv, setDistinctMonthInv] = useState(null);
  const [distinctWasteItem, setDistinctWasteItem] = useState(null);
  const [distinctWasteDescription, setDistinctWasteDescription] = useState(null);
  const [distinctWasteFactory, setDistinctWasteFactory] = useState(null);
  const [distinctWasteGroup, setDistinctWasteGroup] = useState(null);

  const [distinctDetailsItem, setDistinctDetailsItem] = useState(null);
  const [distinctDetailsWeight, setDistinctDetailsWeight] = useState(null);
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const fetchMonthInv = async () => {
    try {
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-month-inv?from_year=${selectedFromYear}&to_year=${selectedToYear}&factory=${selectedFactory}&group=${selectedGroup}`);
      const data  = response.data;
      // const data = await response.data;
      setDistinctMonthInv(data);
    } catch (error) {
      console.error(`Error fetching distinct data Group List: ${error}`);
    }
  };

  const fetchWasteItem = async () => {
    try {
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-waste-item-table?from_year=${selectedFromYear}&to_year=${selectedToYear}&factory=${selectedFactory}&group=${selectedGroup}`);
      const data  = response.data;

      const wasteItems = data.map(item => item.waste_item);
      const wasteDescriptions = data.map(item => item.waste_description_en);
      const wasteFactory = data.map(item => item.factory);
      const wasteGroup = data.map(item => item.waste_group_name);

      // const data = await response.data;
      setDistinctWasteItem(wasteItems);
      setDistinctWasteDescription(wasteDescriptions);
      setDistinctWasteFactory(wasteFactory);
      setDistinctWasteGroup(wasteGroup);
    } catch (error) {
      console.error(`Error fetching distinct data Group List: ${error}`);
    }
  };


  const fetchDetailsItem = async () => {
    try {
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-monitoring-by-item?from_year=${selectedFromYear}&to_year=${selectedToYear}&factory=${selectedFactory}&group=${selectedGroup}`);
      const data  = response.data;
      console.log("data" , data);
      setDistinctDetailsItem(data);
    } catch (error) {
      console.error(`Error fetching distinct data Group List: ${error}`);
    }
  };

  const fetchDetailsWeight = async () => {
    try {
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-monitoring-by-weight?from_year=${selectedFromYear}&to_year=${selectedToYear}&factory=${selectedFactory}&group=${selectedGroup}`);
      const data  = response.data;
      setDistinctDetailsWeight(data);
    } catch (error) {
      console.error(`Error fetching distinct data Group List: ${error}`);
    }
  };
  

  useEffect(() => {
    if (selectedFromYear && selectedToYear && selectedFactory && selectedGroup) {
      fetchMonthInv();
      fetchWasteItem();
      fetchDetailsItem();
      fetchDetailsWeight();
    }
  }, [selectedFromYear, selectedToYear , selectedFactory , selectedGroup]);

  const exportToCsv_Amount = () => {
    // Prepare datetime format (yyyymmddhhss)
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedDateTime = `${year}${month}${date}${hours}${minutes}`;

    // Prepare CSV header
    let months = [];
    distinctDetailsItem.forEach(item => {
        if (!months.includes(item.month_inv)) {
            months.push(item.month_inv);
        }
    });

    // Sort months chronologically
    months.sort((a, b) => new Date(a.split('-')[1], a.split('-')[0] - 1) - new Date(b.split('-')[1], b.split('-')[0] - 1));

    let csvContent = "Waste Group,Waste Item,Waste Description,Factory," + months.join(',') + "\n";

    // Create an object to store total weights for each waste item
    const totalAmount = {};

    // Initialize totalAmount with 0 values for all waste items and months
    distinctDetailsItem.forEach(rowData => {
        if (!totalAmount.hasOwnProperty(rowData.waste_item)) {
            totalAmount[rowData.waste_item] = {};
            months.forEach(month => {
                totalAmount[rowData.waste_item][month] = 0;
            });
        }
    });

    // Calculate total weights for each waste item
    distinctDetailsItem.forEach(rowData => {
        totalAmount[rowData.waste_item][rowData.month_inv] = rowData.total_amount;
    });

    // Sort waste items
    const sortedWasteItems = Object.keys(totalAmount).sort();

    // Add data rows
    sortedWasteItems.forEach(wasteItem => {
        const descriptionIndex = distinctWasteItem.indexOf(wasteItem);
        const wasteDescription = distinctWasteDescription[descriptionIndex];

        const factoryIndex = distinctWasteItem.indexOf(wasteItem);
        const wasteFactory = distinctWasteFactory[factoryIndex];

        const groupIndex = distinctWasteItem.indexOf(wasteItem);
        const wasteGroup = distinctWasteGroup[groupIndex];

        csvContent += `${wasteGroup},${wasteItem},${wasteDescription},${wasteFactory}`;
        months.forEach(month => {
            const weight = totalAmount[wasteItem][month] || 0; // Use 0 if weight is not available
            csvContent += `,${weight.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        });
        csvContent += "\n";
    });

    // Trigger download
    const fileName = `monitoringbyWeight_${formattedDateTime}.csv`;
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  };

  const exportToCsv_Weight = () => {
    // Prepare datetime format (yyyymmddhhss)
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedDateTime = `${year}${month}${date}${hours}${minutes}`;

    // Prepare CSV header
    let months = [];
    distinctDetailsWeight.forEach(item => {
        if (!months.includes(item.month_inv)) {
            months.push(item.month_inv);
        }
    });

    // Sort months chronologically
    months.sort((a, b) => new Date(a.split('-')[1], a.split('-')[0] - 1) - new Date(b.split('-')[1], b.split('-')[0] - 1));

    let csvContent = "Waste Group,Waste Item,Waste Description,Factory," + months.join(',') + "\n";

    // Create an object to store total weights for each waste item
    const totalWeights = {};

    // Initialize totalWeights with 0 values for all waste items and months
    distinctDetailsWeight.forEach(rowData => {
        if (!totalWeights.hasOwnProperty(rowData.waste_item)) {
            totalWeights[rowData.waste_item] = {};
            months.forEach(month => {
                totalWeights[rowData.waste_item][month] = 0;
            });
        }
    });

    // Calculate total weights for each waste item
    distinctDetailsWeight.forEach(rowData => {
        totalWeights[rowData.waste_item][rowData.month_inv] = rowData.total_weight;
    });

    // Sort waste items
    const sortedWasteItems = Object.keys(totalWeights).sort();

    // Add data rows
    sortedWasteItems.forEach(wasteItem => {
      const descriptionIndex = distinctWasteItem.indexOf(wasteItem);
      const wasteDescription = distinctWasteDescription[descriptionIndex];
      const factoryIndex = distinctWasteItem.indexOf(wasteItem);
      const wasteFactory = distinctWasteFactory[factoryIndex];

      const groupIndex = distinctWasteItem.indexOf(wasteItem);
      const wasteGroup = distinctWasteGroup[groupIndex];

      csvContent += `${wasteGroup},${wasteItem},${wasteDescription},${wasteFactory}`;
      months.forEach(month => {
          const weight = totalWeights[wasteItem][month] || 0; // Use 0 if weight is not available
          csvContent += `,${weight}`;
      });
      csvContent += "\n";
    });

    // Trigger download
    const fileName = `monitoringbyWeight_${formattedDateTime}.csv`;
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={10}>
          <div className="w-screen ml-16 mt-20">
              <div >
                    <Smart_Scrap_SearchMonitorItem
                        onSearch={(queryParams) => {
                        setSelectedFromYear(queryParams.fromyear);
                        setSelectedToYear(queryParams.toyear);
                        setSelectedFactory(queryParams.factory);
                        setSelectedGroup(queryParams.group);
                        setSelectedItem(queryParams.item);
                        }}
                    />
              </div>
              <div style={{ marginTop: 30}}>
                    {/* <button onClick={exportToCsv}>Export to CSV</button> */}
                    <Button 
                            variant="contained" 
                            // size="small"
                            style={{height: 40 , backgroundColor: '#186F65' , color: 'yellow'}}
                            onClick={exportToCsv_Amount}
                            // endIcon={<SearchIcon />}
                            >Export Amount
                    </Button>
              </div>
              <div style={{marginTop: 5 , fontSize: 18 , color: 'blue'}}>
                  Monthly monitoring by Amount (THB)
              </div>
              <div style={{marginTop: 5 , fontSize: 14 , width: '1850px' , height: 'auto'}}>
                    <table>
                      <thead>
                          <tr>
                              <th
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#8ACDD7",
                                  height: "40px",
                                  width: "200px",
                                  paddingRight: 5,
                                  border: 'solid black 1px'
                                }}
                              >
                                Group Name
                              </th>
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
                                Waste Item
                              </th>
                              <th
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#8ACDD7",
                                  height: "40px",
                                  width: "250px",
                                  paddingRight: 5,
                                  border: 'solid black 1px'
                                }}
                              >
                                Waste Description
                              </th>
                              <th
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#8ACDD7",
                                  height: "40px",
                                  width: "80px",
                                  paddingRight: 5,
                                  border: 'solid black 1px'
                                }}
                              >
                                Factory
                              </th>
                              {distinctMonthInv && distinctMonthInv.map((item, index) => {
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
                                      {item.month_inv}
                                  </th>
                                    );
                                  })}
                          </tr>
                      </thead>
                      <tbody style={{ fontSize: 14, textAlign: 'center' }}>
                              {distinctWasteItem && distinctWasteItem.map((item, index) => (
                                  <tr key={index}>
                                      <td
                                          style={{
                                              textAlign: "left",
                                              border: 'solid black 1px',
                                              backgroundColor: '#F1EFEF'
                                          }}
                                      >
                                          {distinctWasteGroup[index]}
                                          {/* Waste Descriptions */}
                                      </td>
                                      <td
                                          style={{
                                              textAlign: "center",
                                              border: 'solid black 1px',
                                              backgroundColor: '#F1EFEF'
                                          }}
                                      >
                                          {item}
                                      </td>
                                      <td
                                          style={{
                                              textAlign: "left",
                                              border: 'solid black 1px',
                                              backgroundColor: '#F1EFEF'
                                          }}
                                      >
                                          {distinctWasteDescription[index]}
                                          {/* Waste Descriptions */}
                                      </td>
                                      <td
                                          style={{
                                              textAlign: "center",
                                              border: 'solid black 1px',
                                              backgroundColor: '#F1EFEF'
                                          }}
                                      >
                                          {distinctWasteFactory[index]}
                                          {/* Waste Factory */}
                                      </td>
                                      {distinctMonthInv && distinctMonthInv.map((monthInv, idx) => {
                                          const detailItem = distinctDetailsItem && distinctDetailsItem.find(detail => detail.month_inv === monthInv.month_inv && detail.waste_item === item);
                                          return (
                                              <td
                                                  key={idx}
                                                  style={{
                                                      textAlign: "right",
                                                      border: 'solid black 1px',
                                                      backgroundColor: '#F1EFEF',
                                                      color: 'blue'
                                                  }}
                                              >
                                                  {detailItem ? parseFloat(detailItem.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0'}
                                              </td>
                                          );
                                      })}
                                  </tr>
                              ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ marginTop: 100}}>
                    {/* <button onClick={exportToCsv}>Export to CSV</button> */}
                    <Button 
                            variant="contained" 
                            // size="small"
                            style={{height: 40 , backgroundColor: '#186F65' , color: 'yellow'}}
                            onClick={exportToCsv_Weight}
                            // endIcon={<SearchIcon />}
                            >Export Weight
                    </Button>
                </div>
                <div style={{marginTop: 5 , fontSize: 18 , color: 'blue'}}>
                  Monthly monitoring by Weight (KG)
                </div>
                <div style={{marginTop: 5 , marginBottom: 10,  fontSize: 14 , width: '1850px' , height: 780}}>
                    <table>
                      <thead>
                          <tr>
                              <th
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#8ACDD7",
                                  height: "40px",
                                  width: "200px",
                                  paddingRight: 5,
                                  border: 'solid black 1px'
                                }}
                              >
                                Group Name
                              </th>
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
                                Waste Item
                              </th>
                              <th
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#8ACDD7",
                                  height: "40px",
                                  width: "250px",
                                  paddingRight: 5,
                                  border: 'solid black 1px'
                                }}
                              >
                                Waste Description
                              </th>
                              <th
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#8ACDD7",
                                  height: "40px",
                                  width: "80px",
                                  paddingRight: 5,
                                  border: 'solid black 1px'
                                }}
                              >
                                Factory
                              </th>
                              {distinctMonthInv && distinctMonthInv.map((item, index) => {
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
                                      {item.month_inv}
                                  </th>
                                    );
                                  })}
                          </tr>
                      </thead>
                      <tbody style={{ fontSize: 14, textAlign: 'center' }}>
                              {distinctWasteItem && distinctWasteItem.map((item, index) => (
                                  <tr key={index}>
                                      <td
                                          style={{
                                              textAlign: "left",
                                              border: 'solid black 1px',
                                              backgroundColor: '#F1EFEF'
                                          }}
                                      >
                                          {distinctWasteGroup[index]}
                                          {/* Waste Descriptions */}
                                      </td>
                                      <td
                                          style={{
                                              textAlign: "center",
                                              border: 'solid black 1px',
                                              backgroundColor: '#F1EFEF'
                                          }}
                                      >
                                          {item} {/* Assuming item is the correct object */}
                                      </td>
                                      <td
                                          style={{
                                              textAlign: "left",
                                              border: 'solid black 1px',
                                              backgroundColor: '#F1EFEF'
                                          }}
                                      >
                                          {distinctWasteDescription[index]}
                                      </td>
                                      <td
                                          style={{
                                              textAlign: "center",
                                              border: 'solid black 1px',
                                              backgroundColor: '#F1EFEF'
                                          }}
                                      >
                                          {distinctWasteFactory[index]}
                                          {/* Waste Factory */}
                                      </td>
                                      {distinctMonthInv && distinctMonthInv.map((monthInv, idx) => {
                                          const detailWeight = distinctDetailsWeight && distinctDetailsWeight.find(detail => detail.month_inv === monthInv.month_inv && detail.waste_item === item);
                                          return (
                                              <td
                                                  key={idx}
                                                  style={{
                                                      textAlign: "right",
                                                      border: 'solid black 1px',
                                                      backgroundColor: '#F1EFEF',
                                                      color: 'blue'
                                                  }}
                                              >
                                                  {detailWeight ? parseFloat(detailWeight.total_weight).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0'}
                                              </td>
                                          );
                                      })}
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
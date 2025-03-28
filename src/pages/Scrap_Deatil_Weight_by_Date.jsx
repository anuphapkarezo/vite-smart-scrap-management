import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import './Scrap_Deatil_Weight_by_Date.css'; // Import the CSS file
import axios from "axios";
import Smart_Scrap_SearchDetailsWeight from "../components/SearchGroup/Smart_Scrap_SearchDetailsWeight";
import Button from '@mui/material/Button';

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

  const exportToCsv_before = () => {
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
    let csvContent = "Date take off,";
    distinct_waste_code.forEach(item => {
        csvContent += `${item.waste_item_code},`;
    });
    csvContent += "Update by,Update datetime\n";

    // Add data rows
    distinct_details_waste.forEach(rowData => {
        csvContent += `${rowData.waste_date_take_off},`;
        distinct_waste_code.forEach(item => {
            const weight = rowData.waste_item_code === item.waste_item_code ? rowData.waste_weight : 0;
            csvContent += `${weight},`;
        });
        csvContent += `${rowData.waste_update_by},${rowData.update_datetime}\n`;
    });

    // Trigger download
    const fileName = `detailsweightbydate_${formattedDateTime}.csv`;
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    // link.setAttribute("download", "detailsweightbydate.csv");
    document.body.appendChild(link);
    link.click();
  };

  const exportToCsv = () => {
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
    let csvContent = "Date take off,";
    distinct_waste_code.forEach(item => {
        csvContent += `${item.waste_item_code},`;
    });
    csvContent += "Update by,Update datetime\n";

    // Group data by date
    const groupedData = {};
    distinct_details_waste.forEach(rowData => {
        const date = rowData.waste_date_take_off;
        if (!groupedData[date]) {
            groupedData[date] = {};
            distinct_waste_code.forEach(item => {
                groupedData[date][item.waste_item_code] = 0;
            });
            groupedData[date].update_by = rowData.waste_update_by;
            groupedData[date].update_datetime = rowData.update_datetime;
        }
        groupedData[date][rowData.waste_item_code] += parseFloat(rowData.waste_weight);
    });

    // Add data rows
    Object.keys(groupedData).forEach(date => {
        csvContent += `${date},`;
        distinct_waste_code.forEach(item => {
            const weight = groupedData[date][item.waste_item_code] || 0;
            csvContent += `${weight},`;
        });
        csvContent += `${groupedData[date].update_by},${groupedData[date].update_datetime}\n`;
    });

    // Trigger download
    const fileName = `detailsweightbydate_${formattedDateTime}.csv`;
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  };

  const distinct_dates = Array.from(new Set(distinct_details_waste.map(row => row.waste_date_take_off)));

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
            {/* <div className="w-screen ml-16 mt-20"> */}
                <Box mt={10} maxWidth="100%" display="flex" justifyContent="">
                    {/* <Smart_Scrap_SearchFactoryGroup onSearch={onSearch} /> */}
                    <Smart_Scrap_SearchDetailsWeight
                        onSearch={(queryParams) => {
                        setSelectedFactory(queryParams.factory);
                        setSelectedGroup(queryParams.group);
                        setSelectedFromDate(queryParams.From_date_take_of);
                        setSelectedToDate(queryParams.To_date_take_of);
                        }}
                    />
                </Box>
                <div style={{ marginTop: 30}}>
                    {/* <button onClick={exportToCsv}>Export to CSV</button> */}
                    <Button 
                            variant="contained" 
                            // size="small"
                            style={{height: 40}}
                            onClick={exportToCsv}
                            // endIcon={<SearchIcon />}
                            >Export to CSV
                    </Button>
                </div>
                <div style={{height: '100%', width:1610 , fontSize: 14, overflow: 'auto', paddingBottom: 15, paddingRight: 5, marginTop: 10}}>
                    <table style={{width: 1850, borderCollapse: 'collapse',}}>
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
                          {distinct_waste_code.map((item, index) => (
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
                          ))}
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
                        {distinct_dates.map(date => {
                          const rowData = distinct_details_waste.filter(row => row.waste_date_take_off === date);
                          return (
                            <tr key={date}>
                              <td
                                style={{
                                  textAlign: "center",
                                  border: 'solid black 1px',
                                  backgroundColor: '#F1EFEF'
                                }}
                              >
                                {date}
                              </td>
                              {distinct_waste_code.map((item, index) => {
                                const totalWeight = rowData.reduce((sum, row) => {
                                  return sum + (row.waste_item_code === item.waste_item_code ? parseFloat(row.waste_weight) : 0);
                                }, 0);
                                return (
                                  <td
                                    key={index}
                                    style={{
                                      textAlign: "center",
                                      fontSize: 12,
                                      border: 'solid black 1px',
                                      backgroundColor: '#F1EFEF',
                                      color: totalWeight > 0 ? 'blue' : 'brown',
                                      fontWeight: totalWeight > 0 ? 'bold' : 'normal'
                                    }}
                                  >
                                    {totalWeight}
                                  </td>
                                );
                              })}
                              <td
                                style={{
                                  textAlign: "left",
                                  border: 'solid black 1px',
                                  backgroundColor: '#F1EFEF'
                                }}
                              >
                                {rowData[0].waste_update_by} {/* Assuming same 'Update by' for all rows on the same date */}
                              </td>
                              <td
                                style={{
                                  textAlign: "left",
                                  border: 'solid black 1px',
                                  backgroundColor: '#F1EFEF'
                                }}
                              >
                                {rowData[0].update_datetime} {/* Assuming same 'Update datetime' for all rows on the same date */}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* <table>
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
                    </table> */}
                </div>
            {/* </div> */}
        </Box>
    </>
  );
}
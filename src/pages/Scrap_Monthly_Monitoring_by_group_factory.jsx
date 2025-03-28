import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import axios from "axios";
import Smart_Scrap_SearchYearsMonitor from "../components/SearchGroup/Smart_Scrap_SearchYearsMonitor";
import Smart_Scrap_SearchYearsFactoryMonitor from "../components/SearchGroup/Smart_Scrap_SearchYearsFacMonitor";
import CircularProgress from '@mui/material/CircularProgress';
import ReactApexChart from 'react-apexcharts';

import Navbar from "../components/navbar/Navbar";

export default function Scrap_Monthly_Monitoring_by_group_factory({ onSearch }) {
  const [selectedFromYear, setSelectedFromYear] = useState(null);
  const [selectedToYear, setSelectedToYear] = useState(null);
  const [selectedFactory, setSelectedFactory] = useState(null);

  const [distinctMonthly, setDistinctMonthly] = useState([]);
  const [distinctMonthly_Chart, setDistinctMonthly_Chart] = useState([]);

  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const fetchDataMonthly = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-monthly-monitoring-group-factory?from_year=${selectedFromYear}&to_year=${selectedToYear}&factory=${selectedFactory}`);
      const data = await response.data;
      // console.log(data);
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
      }));
      setDistinctMonthly(rowsWithId);
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  
  useEffect(() => {
    if (selectedFromYear && selectedToYear && selectedFactory) {
      fetchDataMonthly();
      fetchBarChartData();
      fetchBasicBarChartData();

      fetchBarChartData_Weight();
      fetchBasicBarChartData_weight();
    }
  }, [selectedFromYear, selectedToYear , selectedFactory]);

  const columns = [
    { field: 'factory', headerName: 'Factory', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_group_name', headerName: 'Group Name', width: 300 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'total_amount', headerName: 'Total Amount', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right' ,
        valueFormatter: (params) => { //OK
          if (params.value !== null && params.value !== undefined) {
            // Attempt to convert the string to a number
            const numericValue = parseFloat(params.value.replace(/[^0-9.-]+/g, ""));
            
            // Check if the value is a valid number
            if (!isNaN(numericValue)) {
                const formattedValue = new Intl.NumberFormat("en-US").format(numericValue);
                return formattedValue;
            } else {
                return "Invalid Data"; // or any default value or an empty string
            }
          } else {
              return ""; // or any default value when params.value is null or undefined
          }
        },
        sortComparator: (a, b, cellParamsA, cellParamsB) => {
          // Check if cellParamsA.value and cellParamsB.value are not null or undefined
          if (cellParamsA.value !== null && cellParamsA.value !== undefined && cellParamsB.value !== null && cellParamsB.value !== undefined) {
              const numA = parseFloat(cellParamsA.value.replace(/[^0-9.-]+/g, ""));
              const numB = parseFloat(cellParamsB.value.replace(/[^0-9.-]+/g, ""));
              
              // Check if both values are valid numbers
              if (!isNaN(numA) && !isNaN(numB)) {
                  return numA - numB;
              } else {
                  return 0; // or handle the case when the comparison is not possible
              }
          } else {
              return 0; // or any default value when cellParamsA.value or cellParamsB.value is null or undefined
          }
      },
    },
    { field: 'total_weight', headerName: 'Total Weight', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right' , 
        valueFormatter: (params) => {
          // Check if params.value is null or undefined before manipulation
            if (params.value !== null && params.value !== undefined) {
                // Attempt to convert the string to a number
                const numericValue = parseFloat(params.value.replace(/[^0-9.-]+/g, ""));
                
                // Check if the value is a valid number
                if (!isNaN(numericValue)) {
                    const formattedValue = new Intl.NumberFormat("en-US").format(numericValue);
                    return formattedValue;
                } else {
                    return "Invalid Data"; // or any default value or an empty string
                }
            } else {
                return ""; // or any default value when params.value is null or undefined
            }
        },
        sortComparator: (a, b, cellParamsA, cellParamsB) => {
          // Check if cellParamsA.value and cellParamsB.value are not null or undefined
          if (cellParamsA.value !== null && cellParamsA.value !== undefined && cellParamsB.value !== null && cellParamsB.value !== undefined) {
              const numA = parseFloat(cellParamsA.value.replace(/[^0-9.-]+/g, ""));
              const numB = parseFloat(cellParamsB.value.replace(/[^0-9.-]+/g, ""));
              
              // Check if both values are valid numbers
              if (!isNaN(numA) && !isNaN(numB)) {
                  return numA - numB;
              } else {
                  return 0; // or handle the case when the comparison is not possible
              }
          } else {
              return 0; // or any default value when cellParamsA.value or cellParamsB.value is null or undefined
          }
      },
    },
    { field: 'month_inv', headerName: 'Month Invoice', width: 230 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  ]

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: 0,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          dataLabels: {
            total: {
              enabled: false,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
        },
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Total Amount (Mbaht)',
        },
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      },
      dataLabels: {
        enabled: false, // Disable data labels for the bars
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return new Intl.NumberFormat("en-US", {
              style: "decimal",
              // currency: "THB", // You can change the currency as needed
            }).format(val) + " Mbaht";
          },
        },
      },
      title: {
        // ชื่อ chart หรือข้อความที่ต้องการแสดง
        text: 'Monthly Sale Amount Monitoring by Factory (Mbaht)',
        align: 'center',
        margin: 10,
        offsetY: 10,
        style: {
          fontSize: '20px',
        },
      },
    },
  });
  const fetchBarChartData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-monthly-monitoring-group-factory-chart?from_year=${selectedFromYear}&to_year=${selectedToYear}&factory=${selectedFactory}`);
      const data = await response.data;

      // const jun19Data = data.filter(item => item.month_inv === 'Jun-19');

      const chartData = {};
      data.forEach((item) => {
        const key = `${item.month_inv}-${item.factory}`;
        // console.log('Key:', key, 'Value:', item.total_amount);
        if (!chartData[key]) {
          chartData[key] = {
            x: item.month_inv,
            y: parseFloat(item.total_amount) / 1000000,
            name: item.factory,
          };
        } else {
          chartData[key].y += parseFloat(item.total_amount) / 1000000;
        }
      });

      const series = Object.values(chartData).reduce((acc, value) => {
        
        if (!acc[value.name]) {
          acc[value.name] = {
            name: value.name,
            data: [],
          };
        }
        acc[value.name].data.push({
          x: value.x,
          y: parseFloat(value.y.toFixed(2)), // Round to 2 decimal places
        });
        return acc;
      }, {});

      const xCategories = Object.values(chartData)
        .map((value) => value.x)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => {
          const dateA = new Date(`01 ${a}`);
          const dateB = new Date(`01 ${b}`);
          return dateA - dateB;
        });

      setChartData({
        series: Object.values(series),
        options: {
          ...chartData.options,
          xaxis: {
            categories: xCategories,
          },
        },
      });
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  const [basicBarChartData, setBasicBarChartData] = useState({
    series: [],
    options: {
      title: {
        // ชื่อ chart หรือข้อความที่ต้องการแสดง
        text: 'Total Sale Amount by Factory (Mbaht)',
        align: 'center',
        margin: 10,
        offsetY: 5,
        style: {
          fontSize: '20px',
        },
        position: 'top',
      },
    },
    
  });
  const fetchBasicBarChartData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-monthly-monitoring-group-factory-chart-total?from_year=${selectedFromYear}&to_year=${selectedToYear}&factory=${selectedFactory}`);
      const data = response.data;
  
      // Process data for the basic bar chart
      const series = data.map(item => parseFloat(item.total_amount)/ 1000000); // Extract series data from total_amount
      const categories = data.map(item => item.factory); // Extract categories (x-axis labels) from month_inv
      const colors = ['#0B60B0']; // Add more colors as needed
  
      setBasicBarChartData({
        series: [{ data: series }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            },
          },
          xaxis: {
            categories: categories,
          },
          yaxis: {
            title: {
              text: 'Total Amount (Baht)',
            },
            labels: {
              formatter: function (value) {
                return value.toFixed(2); // Format to two decimal places
              }
            },
          },
          legend: {
            position: 'right',
            offsetY: 40
          },
          fill: {
            opacity: 1,
            colors: colors
          },
          plotOptions: {
            bar: {
              // borderRadius: 10,
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            }
          },
          dataLabels: {
            enabled: true, // Disable data labels for the bars
            formatter: function (val) {
              return new Intl.NumberFormat("en-US", {
                style: "decimal",
                // currency: "THB", // You can change the currency as needed
              }).format(val);
            },
            offsetY: -20,
            style: {
              colors: ['#000000'], // Set font color to black
              rotate: -45
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return new Intl.NumberFormat("en-US", {
                  style: "decimal",
                  // currency: "THB", // You can change the currency as needed
                }).format(val) + " Mbaht";
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching basic bar chart data:', error);
      setError('An error occurred while fetching basic bar chart data');
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------------------------------
  const [chartData_Weight, setChartData_Weight] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: 0,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          dataLabels: {
            total: {
              enabled: false,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
        },
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Total Weight (KG)',
        },
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      },
      dataLabels: {
        enabled: false, // Disable data labels for the bars
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return new Intl.NumberFormat("en-US", {
              style: "decimal",
              // currency: "THB", // You can change the currency as needed
            }).format(val) + " KG";
          },
        },
      },
      title: {
        // ชื่อ chart หรือข้อความที่ต้องการแสดง
        text: 'Monthly Weight Monitoring by Factory (KG)',
        align: 'center',
        margin: 10,
        offsetY: 10,
        style: {
          fontSize: '20px',
        },
      },
    },
  });
  const fetchBarChartData_Weight = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-monthly-monitoring-group-factory-chart_weight?from_year=${selectedFromYear}&to_year=${selectedToYear}&factory=${selectedFactory}`);
      const data = await response.data;

      // const jun19Data = data.filter(item => item.month_inv === 'Jun-19');

      const chartData_Weight = {};
      data.forEach((item) => {
        const key = `${item.month_inv}-${item.factory}`;
        // console.log('Key:', key, 'Value:', item.total_amount);
        if (!chartData_Weight[key]) {
          chartData_Weight[key] = {
            x: item.month_inv,
            y: parseFloat(item.total_weight),
            name: item.factory,
          };
        } else {
          chartData_Weight[key].y += parseFloat(item.total_weight);
        }
      });

      const series = Object.values(chartData_Weight).reduce((acc, value) => {
        
        if (!acc[value.name]) {
          acc[value.name] = {
            name: value.name,
            data: [],
          };
        }
        acc[value.name].data.push({
          x: value.x,
          y: parseFloat(value.y.toFixed(2)), // Round to 2 decimal places
        });
        return acc;
      }, {});

      const xCategories = Object.values(chartData_Weight)
        .map((value) => value.x)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => {
          const dateA = new Date(`01 ${a}`);
          const dateB = new Date(`01 ${b}`);
          return dateA - dateB;
        });

      setChartData_Weight({
        series: Object.values(series),
        options: {
          ...chartData_Weight.options,
          xaxis: {
            categories: xCategories,
          },
        },
      });
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  const [basicBarChartData_weight, setBasicBarChartData_weight] = useState({
    series: [],
    options: {
      title: {
        // ชื่อ chart หรือข้อความที่ต้องการแสดง
        text: 'Total Weight by Factory (KG)',
        align: 'center',
        margin: 10,
        offsetY: 5,
        style: {
          fontSize: '20px',
        },
        position: 'top',
      },
    },
    
  });
  const fetchBasicBarChartData_weight = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-monthly-monitoring-group-factory-chart-total-weight?from_year=${selectedFromYear}&to_year=${selectedToYear}&factory=${selectedFactory}`);
      const data = response.data;
  
      // Process data for the basic bar chart
      const series = data.map(item => parseFloat(item.total_weight)); // Extract series data from total_amount
      const categories = data.map(item => item.factory); // Extract categories (x-axis labels) from month_inv
      const colors = ['#0B60B0']; // Add more colors as needed
  
      setBasicBarChartData_weight({
        series: [{ data: series }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            },
          },
          xaxis: {
            categories: categories,
          },
          yaxis: {
            title: {
              text: 'Total Weight (KG)',
            },
            labels: {
              formatter: function (value) {
                return value.toFixed(2); // Format to two decimal places
              }
            },
          },
          legend: {
            position: 'right',
            offsetY: 40
          },
          fill: {
            opacity: 1,
            colors: colors
          },
          plotOptions: {
            bar: {
              // borderRadius: 10,
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            }
          },
          dataLabels: {
            enabled: true, // Disable data labels for the bars
            formatter: function (val) {
              return new Intl.NumberFormat("en-US", {
                style: "decimal",
                // currency: "THB", // You can change the currency as needed
              }).format(val);
            },
            offsetY: -20,
            style: {
              colors: ['#000000'], // Set font color to black
              rotate: -45
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return new Intl.NumberFormat("en-US", {
                  style: "decimal",
                  // currency: "THB", // You can change the currency as needed
                }).format(val) + " KG";
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching basic bar chart data:', error);
      setError('An error occurred while fetching basic bar chart data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={10}>
          {/* <div className="w-screen ml-16 mt-20"> */}
              <Box mt={10} maxWidth="100%" display="flex" justifyContent="left">
                    <Smart_Scrap_SearchYearsFactoryMonitor
                        onSearch={(queryParams) => {
                        setSelectedFromYear(queryParams.fromyear);
                        setSelectedToYear(queryParams.toyear);
                        setSelectedFactory(queryParams.factory);
                        }}
                    />
              </Box>
              <Box sx={{width: 1060 , height: 550 , marginTop: '25px'}}>
                {isLoading ? (
                <CircularProgress /> // Display a loading spinner while data is being fetched
                  ) : (
                    <DataGrid
                      columns={columns}
                      // disableColumnFilter
                      // disableDensitySelector
                      rows={distinctMonthly}
                      slots={{ toolbar: GridToolbar }}
                      filterModel={filterModel}
                      onFilterModelChange={(newModel) => setFilterModel(newModel)}
                      slotProps={{ toolbar: { showQuickFilter: true } }}
                      columnVisibilityModel={columnVisibilityModel}
                      // checkboxSelection
                      onColumnVisibilityModelChange={(newModel) =>
                        setColumnVisibilityModel(newModel)
                      }
                    />
                  )}
              </Box>
              <div style={{ display: 'flex', flexDirection: 'row'}}>
                  <Box sx={{width: 850 , height: 380 , marginTop: '15px' , backgroundColor: '#FFF3CF'}}>
                      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={370} />
                  </Box>
                  <Box sx={{width: 600 , height: 380 , marginTop: '15px' , backgroundColor: '#FFF3CF' , marginLeft: '20px'}}>
                      <ReactApexChart options={basicBarChartData.options} series={basicBarChartData.series} type="bar" height={370} />
                  </Box>
              </div>
              <div style={{width: 1470 , border: '3px solid black' , marginTop: 20}}>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row'}}>
                  <Box sx={{width: 850 , height: 380 , marginTop: '15px' , backgroundColor: '#D2E0FB'}}>
                      <ReactApexChart options={chartData_Weight.options} series={chartData_Weight.series} type="bar" height={370} />
                  </Box>
                  <Box sx={{width: 600 , height: 380 , marginTop: '15px' , backgroundColor: '#D2E0FB' , marginLeft: '20px'}}>
                      <ReactApexChart options={basicBarChartData_weight.options} series={basicBarChartData_weight.series} type="bar" height={370} />
                  </Box>
              </div>
          {/* </div> */}
        </Box>
    </>
  );
}
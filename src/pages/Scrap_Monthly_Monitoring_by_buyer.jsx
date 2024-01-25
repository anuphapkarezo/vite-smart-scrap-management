import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import axios from "axios";
import Smart_Scrap_SearchYearsMonitor from "../components/SearchGroup/Smart_Scrap_SearchYearsMonitor";
import CircularProgress from '@mui/material/CircularProgress';
import ReactApexChart from 'react-apexcharts';

import Navbar from "../components/navbar/Navbar";

export default function Scrap_Monthly_Monitoring_by_buyer({ onSearch }) {
  const [selectedFromYear, setSelectedFromYear] = useState(null);
  const [selectedToYear, setSelectedToYear] = useState(null);

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
              style: "currency",
              currency: "THB", // You can change the currency as needed
            }).format(val);
          },
        },
      },
    },
  });

  const fetchDataMonthly = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-monthly-monitoring-buyer?from_year=${selectedFromYear}&to_year=${selectedToYear}`);
      const data = await response.data;
      console.log(data);
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

  const fetchBarChartData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-monthly-monitoring-buyer-chart?from_year=${selectedFromYear}&to_year=${selectedToYear}`);
      const data = await response.data;
      setDistinctMonthly_Chart(data);

      // const jun19Data = data.filter(item => item.month_inv === 'Jun-19');

      const chartData = {};
      data.forEach((item) => {
        const key = `${item.month_inv}-${item.waste_company_short_name}`;
        console.log('Key:', key, 'Value:', item.total_amount);
        if (!chartData[key]) {
          chartData[key] = {
            x: item.month_inv,
            y: parseFloat(item.total_amount) / 1000000,
            name: item.waste_company_short_name,
          };
        } else {
          chartData[key].y += parseFloat(item.total_amount) / 1000000;
        }
      });

      console.log('Processed Chart Data:', chartData);

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

      console.log('xCategories before sorting:', xCategories);


      setChartData({
        series: Object.values(series),
        options: {
          ...chartData.options,
          xaxis: {
            categories: xCategories,
          },
          title: {
            // ชื่อ chart หรือข้อความที่ต้องการแสดง
            text: 'Monthly Monitoring by Buyer',
            align: 'center',
            margin: 10,
            offsetY: 20,
            style: {
              fontSize: '20px',
            },
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


  useEffect(() => {
    if (selectedFromYear && selectedToYear) {
      fetchDataMonthly();
      fetchBarChartData();
    }
  }, [selectedFromYear, selectedToYear]);

  const columns = [
    { field: 'company_code', headerName: 'Company Code', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'waste_company_short_name', headerName: 'Company', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'total_amount', headerName: 'Total Amount', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right' ,
        valueFormatter: (params) => {
          // Attempt to convert the string to a number
          const numericValue = parseFloat(params.value.replace(/[^0-9.-]+/g, ""));

          // Check if the value is a valid number
          if (!isNaN(numericValue)) {
            const formattedValue = new Intl.NumberFormat("en-US").format(
              numericValue
            );
            return formattedValue;
          } else {
            return "Invalid Data"; // or any default value or an empty string
          }
        },
        sortComparator: (a, b, cellParamsA, cellParamsB) => {
          const numA = parseFloat(cellParamsA.value.replace(/[^0-9.-]+/g, ""));
          const numB = parseFloat(cellParamsB.value.replace(/[^0-9.-]+/g, ""));

          // Check if both values are valid numbers
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          } else {
            return 0; // or handle the case when the comparison is not possible
          }
        },
    },
    { field: 'month_inv', headerName: 'Month Invoice', width: 230 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  ]


  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={10}>
          <div className="w-screen ml-16 mt-20">
              <div >
                    <Smart_Scrap_SearchYearsMonitor
                        onSearch={(queryParams) => {
                        setSelectedFromYear(queryParams.fromyear);
                        setSelectedToYear(queryParams.toyear);
                        }}
                    />
              </div>
              <Box sx={{width: 860 , height: 550 , marginTop: '25px'}}>
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
              <Box sx={{width: 900 , height: 400 , marginTop: '30px' , backgroundColor: '#EEF5FF'}}>
                  <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={370} />
              </Box>
          </div>
        </Box>
    </>
  );
}
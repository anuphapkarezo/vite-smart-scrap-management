import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import axios from "axios";
import Smart_Scrap_SearchSummaryWeight from "../components/SearchGroup/Smart_Scrap_SearchSummaryWeight";
import Smart_Scrap_SearchSummaryWeightMOI from "../components/SearchGroup/Smart_Scrap_SearchSummaryWeightMOI";
import ReactApexChart from 'react-apexcharts';

import Navbar from "../components/navbar/Navbar";

export default function Scrap_Summary_Weight_MOI({ onSearch }) {
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);

  const [distinct_sum_weight, setDistinct_sum_weight] = useState([]);

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

  const fetch_sum_weight = async () => {
    try {
        setIsLoading(true);
          const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-summary-waste-moi?from_date=${selectedFromDate}&to_date=${selectedToDate}&factory=${selectedFactory}&grp_moi=${selectedGroup}`);
          const data = await response.data;
          // Add a unique id property to each row
          const rowsWithId = data.map((row, index) => ({
            ...row,
            id: index, // You can use a better unique identifier here if available
            sum_waste_weight: parseFloat(row.sum_waste_weight)
          }));
          setDistinct_sum_weight(rowsWithId);
        } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data record_weight');
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  const [basicBarChartData, setBasicBarChartData] = useState({
    series: [],
    options: {
      title: {
        // ชื่อ chart หรือข้อความที่ต้องการแสดง
        text: 'Summary weight waste group MOI (KG)',
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

  const fetch_sum_weight_chart = async () => {
    try {
        setIsLoading(true);
          const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-summary-waste-moi-chart?from_date=${selectedFromDate}&to_date=${selectedToDate}&factory=${selectedFactory}&grp_moi=${selectedGroup}`);
          const data = await response.data;

          const series = data.map(item => parseFloat(item.sum_waste_weight)); // Extract series data from total_amount
          const categories = data.map(item => item.moi_waste_item_code); // Extract categories (x-axis labels) from month_inv
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
                  text: 'Total Weight (KG)',
                },
                min: 0,              // Start y-axis from 0
                max: 200000,          // Set y-axis maximum to 100,000
                tickAmount: 10,       // Divide y-axis into 10 intervals (10,000 each)
                labels: {
                  formatter: function (value) {
                    return new Intl.NumberFormat("en-US", {
                      style: "decimal",
                    }).format(value); // Format with commas as thousand separators
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
                  dataLabels: {
                    position: 'top', // top, center, bottom
                  },
                }
              },
              dataLabels: {
                enabled: true, // Enable data labels for the bars
                formatter: function (value) {
                  return new Intl.NumberFormat("en-US", {
                    style: "decimal",
                  }).format(value); // Format with commas as thousand separators
                },
                offsetY: -25, // Reduce the offset to make sure labels are visible for smaller bars
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
                    }).format(val) + " KG";
                  },
                },
              },
            },
          });



        } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data record_weight');
    } finally {
      setIsLoading(false); // Set isLoading back to false when fetch is complete
    }
  };

  // useEffect(() => {
  //   fetch_sum_weight();
  // });

  useEffect(() => {
    if (selectedFromDate !== null && selectedToDate !== null && selectedFactory !== null && selectedGroup !== null) {
      // console.log('Fetch');
      fetch_sum_weight();
      fetch_sum_weight_chart();
    }
  }, [selectedFromDate, selectedToDate , selectedFactory , selectedGroup] );

  const columns = [
    { field: 'from_date', headerName: 'From Data', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'to_date', headerName: 'To Data', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_factory_name', headerName: 'Factory', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'moi_waste_item_code', headerName: 'MOI Code', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'moi_waste_description', headerName: 'MOI Name', width: 250 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'sum_waste_weight', headerName: 'Summary Weight', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right' ,
      valueFormatter: (params) => {
        if (params.value == null) {
            return '';
        }
        return params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
  ]

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
            <Box mt={10} >
                <div >
                    {/* <Smart_Scrap_SearchFactoryGroup onSearch={onSearch} /> */}
                    <Smart_Scrap_SearchSummaryWeightMOI
                        onSearch={(queryParams) => {
                        setSelectedFactory(queryParams.factory);
                        setSelectedGroup(queryParams.group);
                        setSelectedFromDate(queryParams.From_date);
                        setSelectedToDate(queryParams.To_date);
                        }}
                    />
                </div>
              </Box>
            <Box sx={{width: '965px' , height: 725 , marginTop: '25px' , marginLeft: ''}}>
                  <DataGrid
                    columns={columns}
                    // disableColumnFilter
                    // disableDensitySelector
                    rows={distinct_sum_weight}
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
            </Box>
            <Box sx={{ width: 965, height: 370, marginTop: '30px', backgroundColor: '#FFF3CF' , marginLeft: '60px'}}>
              <ReactApexChart options={basicBarChartData.options} series={basicBarChartData.series} type="bar" height={370} />
            </Box>
        </Box>
    </>
  );
}
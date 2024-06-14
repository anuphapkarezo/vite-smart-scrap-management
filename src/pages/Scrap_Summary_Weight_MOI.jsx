import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import axios from "axios";
import Smart_Scrap_SearchSummaryWeight from "../components/SearchGroup/Smart_Scrap_SearchSummaryWeight";
import Smart_Scrap_SearchSummaryWeightMOI from "../components/SearchGroup/Smart_Scrap_SearchSummaryWeightMOI";

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

  // useEffect(() => {
  //   fetch_sum_weight();
  // });

  useEffect(() => {
    if (selectedFromDate !== null && selectedToDate !== null && selectedFactory !== null && selectedGroup !== null) {
      // console.log('Fetch');
      fetch_sum_weight();
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
            <div className="w-screen ml-16 mt-20">
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
            </div>
            <Box sx={{width: '965px' , height: 725 , marginTop: '25px' , marginLeft: '65px'}}>
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
        </Box>
    </>
  );
}
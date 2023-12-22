import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import axios from "axios";
import Smart_Scrap_SearchSummaryWeight from "../components/SearchGroup/Smart_Scrap_SearchSummaryWeight";

import Navbar from "../components/navbar/Navbar";

export default function Scrap_Summary_Weight_Date_Take_Off({ onSearch }) {
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
        if (selectedGroup === "All Group") {
          // const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-summary-weight-date-take-off?factory=${selectedFactory}&group=${selectedGroup}&from_dto=${selectedFromDate}&to_dto=${selectedToDate}`);
          const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-summary-weight-date-take-off-no-group?factory=${selectedFactory}&from_dto=${selectedFromDate}&to_dto=${selectedToDate}`);
          const data = await response.data;

          // Add a unique id property to each row
          const rowsWithId = data.map((row, index) => ({
            ...row,
            id: index, // You can use a better unique identifier here if available
          }));
          setDistinct_sum_weight(rowsWithId);
        } 
        else {
          const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-summary-weight-date-take-off?factory=${selectedFactory}&group=${selectedGroup}&from_dto=${selectedFromDate}&to_dto=${selectedToDate}`);
          const data = await response.data;
          // Add a unique id property to each row
          const rowsWithId = data.map((row, index) => ({
            ...row,
            id: index, // You can use a better unique identifier here if available
          }));
          setDistinct_sum_weight(rowsWithId);
        }
        
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
    if (selectedFromDate !== null && selectedToDate !== null) {
      fetch_sum_weight();
    }
  }, [selectedFromDate, selectedToDate]);

  const columns = [
    { field: 'from_date', headerName: 'From Data', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'to_date', headerName: 'To Data', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_factory_name', headerName: 'Factory', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_group_code', headerName: 'Group Code', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_group_name', headerName: 'Group Name', width: 250 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_item_code', headerName: 'Waste Code', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_description_EN', headerName: 'Waste Name', width: 250 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'sum_weight', headerName: 'Summary Weight', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    // { field: 'waste_update_by', headerName: 'Update By', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
  ]

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
            <div className="w-screen ml-16 mt-20">
                <div >
                    {/* <Smart_Scrap_SearchFactoryGroup onSearch={onSearch} /> */}
                    <Smart_Scrap_SearchSummaryWeight
                        onSearch={(queryParams) => {
                        setSelectedFactory(queryParams.factory);
                        setSelectedGroup(queryParams.group);
                        setSelectedFromDate(queryParams.From_date_take_of);
                        setSelectedToDate(queryParams.To_date_take_of);
                        }}
                    />
                </div>
            </div>
            <Box sx={{width: '1335px' , height: 725 , marginTop: '25px' , marginLeft: '65px'}}>
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
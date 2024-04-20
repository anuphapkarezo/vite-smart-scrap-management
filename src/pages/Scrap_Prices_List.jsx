import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import axios from "axios";

import Navbar from "../components/navbar/Navbar";

export default function Scrap_Prices_List({ onSearch }) {
  const [distinctPricesList, setDistinctPricesList] = useState([]);

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

  const fetch_prices_list = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-master-prices-list`);
      const data = await response.data;
      console.log(data);
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
      }));
      setDistinctPricesList(rowsWithId);
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master prices list');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  useEffect(() => {
    fetch_prices_list();
  }, []);

  const columns = [
    { field: 'item_code', headerName: 'Item Code', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'factory', headerName: 'Factory', width: 70 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'desc_en', headerName: 'Description EN', width: 230 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'desc_th', headerName: 'Description TH', width: 230 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'group', headerName: 'Group', width: 230 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'price', headerName: 'Price', width: 80 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'unit_price', headerName: 'Unit', width: 60 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'effective_from', headerName: 'Eff. from', width: 140 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'effective_to', headerName: 'Eff. To', width: 140 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'company_code', headerName: 'Company', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'remark', headerName: 'Remark', width: 180 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
  ]

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={10}>
            <Box sx={{width: '1605px' , height: 725 , marginTop: '30px' , marginLeft: '65px'}}>
                  <DataGrid
                    columns={columns}
                    // disableColumnFilter
                    // disableDensitySelector
                    rows={distinctPricesList}
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
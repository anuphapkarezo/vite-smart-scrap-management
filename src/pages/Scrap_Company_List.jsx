import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import axios from "axios";

import Navbar from "../components/navbar/Navbar";

export default function Scrap_Company_List({ onSearch }) {
  const [distinctCompanyList, setDistinctCompanyList] = useState([]);

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
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-master-company-list`);
      const data = await response.data;
      console.log(data);
      // Add a unique id property to each row
      const rowsWithId = data.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
      }));
      setDistinctCompanyList(rowsWithId);
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master prices list');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  useEffect(() => {
    fetch_prices_list();
  }, );

  const columns = [
    { field: 'comp_code', headerName: 'Company Code', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'comp_name', headerName: 'Company Name', width: 450 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'cont_name', headerName: 'Contact Name', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'cont_mail', headerName: 'Contact Email', width: 450 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'cont_phone', headerName: 'Contact Phone', width: 250 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  ]

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={10}>
            <Box sx={{width: '1470px' , height: 725 , marginTop: '30px' , marginLeft: '65px'}}>
                  <DataGrid
                    columns={columns}
                    // disableColumnFilter
                    // disableDensitySelector
                    rows={distinctCompanyList}
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
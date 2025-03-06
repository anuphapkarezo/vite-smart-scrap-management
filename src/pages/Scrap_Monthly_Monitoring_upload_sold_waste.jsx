import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import Navbar from "../components/navbar/Navbar";
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from "axios";
import Modal from '@mui/material/Modal';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import ReactFileReader from 'react-file-reader';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Swal from 'sweetalert2';
import Autocomplete from "@mui/material/Autocomplete";

export default function Scrap_Monthly_Monitoring_upload_sold_waste({ onSearch }) {
  const Custom_Progress = () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <div className="loader"></div>
    <div style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#3498db' }}>Loading Data...</div>
      <style jsx>{`
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  const [distinctInvSoldWasteMonthly, setdistinctInvSoldWasteMonthly] = useState([]);
  const fetchInvSoldWasteMonthly = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-inv-sold-waste-monthly`);
      const data  = response.data;
      const rowsWithId = data.map((row, index) => ({
        ...row,
        id: index, 
      }));
      setdistinctInvSoldWasteMonthly(rowsWithId);
    } catch (error) {
      console.error(`Error fetching distinct data SUS Delivery order: ${error}`);
    } finally {
      setIsLoading(false); 
    }
  };

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [csvData, setCsvData] = useState([]);
  const [FileName, setFileName] = useState(['']);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const handleFiles = (files) => {
    const file = files[0];
    setFileName(file.name)

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const rows = content.split('\n');
      const parsedData = rows.map(row => {
        const rowData = row.split(',');
        return rowData;
      });
      setCsvData(parsedData);
    };
    reader.readAsText(file);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCancelUpload = () => {
    setFileName('');
    setCsvData([]);
  };

  const HandleSavePlan = () => {
    const invSoldwaste = csvData.map(row => row);
    const dateFormatRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    let CheckNumber = 0;
  
    invSoldwaste.forEach((row, index) => {
        if (index === 0) return;
  
        const [factory, inv_no, company_code, issue_date, takeout_date, waste_item, weigh, unit, price, amount, vat, total_amount, month_inv] = row;
        if (factory === '') return;
        // console.log('issue_date', issue_date);
        // console.log('takeout_date', takeout_date);
        
        const dateMatch_issue = dateFormatRegex.test(issue_date);
        const dateMatch_take = dateFormatRegex.test(takeout_date);
        // console.log('dateMatch_issue', dateMatch_issue);
        // console.log('dateMatch_take', dateMatch_take);

        if (dateMatch_issue === false) {
          CheckNumber += 1;
        }
        if (dateMatch_take === false) {
          CheckNumber += 1;
        }
    })
    
    if ( CheckNumber > 0 ) {
      openDialog();
      setFileName('')
      setCsvData('')
      return;
    }
  
    const swalWithZIndex = Swal.mixin({
        customClass: {
            popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
    });
  
    if (FileName == '') 
    {

    } 
    else {
      swalWithZIndex.fire({
          title: "Confirm Save",
          text: "Are you sure want to upload Invoice sold waste monthly?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Save",
          cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          const promises = csvData.map(async (row, index) => {
              const [factory, inv_no, company_code, issue_date, takeout_date, waste_item, weigh, unit, price, amount, vat, total_amount, month_inv] = row;

              if (index === 0) return;
              if (factory === '') return;
              const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-count-inv-sold-waste?factory=${factory}&inv_no=${inv_no}&comp_code=${company_code}&iss_date=${issue_date}&take_date=${takeout_date}&waste_item=${waste_item}&month_inv=${month_inv}&weight=${weigh}`);
              const data = response.data;
              const count_data = data[0].count_data;
              
              if (count_data > 0) {
                axios
                  .get(
                    `http://10.17.100.115:3001/api/smart_scrap/update-data-inv-sold-waste-monthly?weigh=${weigh}&unit=${unit}&price=${price}&amount=${amount}&vat=${vat}&total_amount=${total_amount}&factory=${factory}&inv_no=${inv_no}&comp_code=${company_code}&iss_date=${issue_date}&take_date=${takeout_date}&waste_item=${waste_item}&month_inv=${month_inv}`
                  )
              } else {
                axios
                  .get(
                    `http://10.17.100.115:3001/api/smart_scrap/insert-inv-sold-waste-monthly?factory=${factory}&inv_no=${inv_no}&comp_code=${company_code}&iss_date=${issue_date}&take_date=${takeout_date}&waste_item=${waste_item}&weigh=${weigh}&unit=${unit}&price=${price}&amount=${amount}&vat=${vat}&total_amount=${total_amount}&month_inv=${month_inv}`
                  )
              }
          });
          Promise.all(promises)
          .then(() => {
              Swal.fire({
                  icon: "success",
                  title: "Save Success",
                  text: "Daily Production plan saved successfully",
                  confirmButtonText: "OK",
              });
              setFileName('')
              setCsvData('')
              fetchInvSoldWasteMonthly()
          })
          .catch((error) => {
              console.error("Error saving data:", error);
              Swal.fire({
                  icon: "error",
                  title: "Save Error",
                  text: "An error occurred while saving data",
                  confirmButtonText: "OK",
              });
          });
        } 
      });
    }
  };

  const columns = [
    { field: 'factory', headerName: 'Factory', width: 70 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' },
    { field: 'inv_no', headerName: 'Invoice No.', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left' },
    { field: 'company_code', headerName: 'Company Code', width: 115 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'issue_date', headerName: 'Issue Date', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'takeout_date', headerName: 'Takeout Date', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_item', headerName: 'Waste Item', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'weigh', headerName: 'Weight (KG)', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        return params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    { field: 'unit', headerName: 'Unit', width: 50 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'price', headerName: 'Price (฿)', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right' ,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        return params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    { field: 'amount', headerName: 'Amount (฿)', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        return params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    { field: 'vat', headerName: 'Vat (%)', width: 70 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center' ,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '0';
        }
        const value = parseInt(params.value, 10);
        return value.toLocaleString();
      },
    },
    { field: 'total_amount', headerName: 'Total Amount (฿)', width: 135 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'right',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        return params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    { field: 'month_inv', headerName: 'Month Inv.', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
  ]

  useEffect(() => {
    fetchInvSoldWasteMonthly();
  }, []);

  
  return (
    <>
      <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={10}>
          <Box sx={{width: '1400px' , height: 600 , marginTop: '15px' , marginLeft: '65px'}}>
            <div  style={{display: 'inline-flex', alignItems: 'center', }}>
              <ReactFileReader handleFiles={handleFiles} fileTypes={'.csv'}>
                <Button
                  className='btn_active'
                  style={{
                    border: '1px solid black',
                    fontSize: 12,
                    width: 140,
                    height: 50,
                    backgroundColor: '#EEEEEE',
                    fontWeight: 'bold',
                    marginTop: 10,
                    
                  }}
                  endIcon={<CloudUploadIcon />}
                >
                  Upload file
                </Button>
              </ReactFileReader>
              <a href="/FormatUpload-InvoiceSoldWasteMonthly.csv" download="FormatUpload-InvoiceSoldWasteMonthly.csv"
                  style={{marginTop: 10, 
                          textDecoration: 'underline', 
                          color: 'blue' , 
                          fontSize: 12, 
                          marginLeft: 10}}>
                  Format file
              </a>
              <p style={{marginTop: 10, marginLeft: '10px' , fontSize: 16 , width: 400, }}>( {FileName} )</p>
              <Button 
                className='btn_hover' 
                style={{marginTop: 10, 
                        fontWeight: 'bold', 
                        fontSize: 12, 
                        backgroundColor: '#FF0000', 
                        width: 90, 
                        height: 50, 
                        color: 'white',
                        marginLeft: 20, }}
                onClick={handleCancelUpload}
              >
                Cancel
              </Button>
              <Button 
                className='btn_hover' 
                style={{marginTop: 10, 
                        fontWeight:'bold', 
                        fontSize: 12 , 
                        backgroundColor: '#74E291' , 
                        width: 90 , 
                        height: 50, 
                        color: "black" , 
                        marginLeft: 10}} 
                onClick={HandleSavePlan}
              >
                Upload
              </Button> 
            </div>
            <div style={{ height: 600 , width: 1330 , backgroundColor: '#DFF5FF', marginTop: 20 }}>
              {isLoading ? (
                  <Custom_Progress />
              ) : (
                <>
                  <DataGrid
                    columns={columns}
                    rows={distinctInvSoldWasteMonthly}
                    slots={{ toolbar: GridToolbar }}
                    filterModel={filterModel}
                    onFilterModelChange={(newModel) => setFilterModel(newModel)}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={(newModel) =>
                      setColumnVisibilityModel(newModel)
                    }
                    getRowHeight={() => 30} // Set the desired row height here
                    sx={{
                      '& .MuiDataGrid-row': {
                        backgroundColor: '#F6F5F5', // Change to desired color
                      },
                    }}
                  />
                </>
              )}
              </div>
          </Box>
        </Box>
        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle style={{backgroundColor: 'white', color: 'red', fontSize: 22, textAlign:'center', }}><ReportProblemIcon style={{width: 80, height: 80,}}></ReportProblemIcon></DialogTitle>
          <DialogContent style={{backgroundColor: 'white'  , color: 'red'}}>
            <DialogContentText  style={{paddingTop: 20 , color: 'black' , paddingLeft: 0 , fontSize: 20}}>
                Try to check to Format Date again please.
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{backgroundColor: 'white' , height: 80, textAlign:'center', display: 'flex', justifyContent: 'center',}}>
            <Button onClick={() => { closeDialog()}} style={{width: 80 , backgroundColor: '#478CCF' , borderRadius:5  , color: 'white', marginBottom: 10}}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
    </>
  );
}
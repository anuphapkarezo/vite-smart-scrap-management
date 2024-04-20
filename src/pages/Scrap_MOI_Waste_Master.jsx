import './Scrap_Record_Weight_Daily_Transaction.css';
import Navbar from "../components/navbar/Navbar";

import React, { useState, useEffect , useRef } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Swal from 'sweetalert2';

import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { color } from 'chart.js/helpers';


export default function Scrap_MOI_Waste_Master({ onSearch }) {
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen_Add, setIsModalOpen_Add] = useState(false);
  const [isModalOpen_Edit, setIsModalOpen_Edit] = useState(false);
  const [isDialogOpen_checkCount, setIsDialogOpen_checkCount] = useState(false);
  const [isDialogOpen_checkNull, setIsDialogOpen_checkNull] = useState(false);

  const [error, setError] = useState(null);

  const [DistinctMoiMaster, setDistinctMoiMaster] = useState({});
  const [DistinctCountMoiMaster, setDistinctCountMoiMaster] = useState(0);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month starts from 0
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Ensure leading zero for day/month/hours/minutes/seconds if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}`;
  };

  const formatDate_Edit = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month starts from 0
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Ensure leading zero for day/month/hours/minutes/seconds if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${formattedMonth}/${formattedDay}/${year} ${formattedHours}:${formattedMinutes}`;
};

  
  const [MoiWasteItem_Add, setMoiWasteItem_Add] = useState('');
  const [MoiWasteDesc_Add , setMoiWasteDesc_Add] = useState('');
  const [MoiWasteUnit_Add , setMoiWasteUnit_Add] = useState('');
  const [MoiWasteDisp_Add , setMoiWasteDisp_Add] = useState('');
  const [MoiWasteUpdateBy_Add , setMoiWasteUpdateBy_Add] = useState('');
  const [MoiWasteUpdateDateTime_Add, setMoiWasteUpdateDateTime_Add] = useState();

  const [MoiWasteItem_Del, setMoiWasteItem_Del] = useState('');
  const [MoiWasteDesc_Del , setMoiWasteDesc_Del] = useState('');
  const [MoiWasteUnit_Del , setMoiWasteUnit_Del] = useState('');
  const [MoiWasteDisp_Del , setMoiWasteDisp_Del] = useState('');

  const [MoiWasteItem_Edit, setMoiWasteItem_Edit] = useState('');
  const [MoiWasteDesc_Edit , setMoiWasteDesc_Edit] = useState('');
  const [MoiWasteUnit_Edit , setMoiWasteUnit_Edit] = useState('');
  const [MoiWasteDisp_Edit , setMoiWasteDisp_Edit] = useState('');
  const [MoiWasteUpdateBy_Edit , setMoiWasteUpdateBy_Edit] = useState('');
  const [MoiWasteUpdateDateTime_Edit, setMoiWasteUpdateDateTime_Edit] = useState();

  const [SelectedMoiWasteItem_Edit , setSelectedMoiWasteItem_Edit] = useState('');
  const [SelectedMoiWasteDesc_Edit , setSelectedMoiWasteDesc_Edit] = useState('');
  const [SelectedMoiWasteUnit_Edit , setSelectedMoiWasteUnit_Edit] = useState('');
  const [SelectedMoiWasteDisp_Edit , setSelectedMoiWasteDisp_Edit] = useState('');

  const MoiWasteItemInputRef = useRef(null);

  const fetchMoiMaster = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-moi-master`);
      const data = await response.data;
      setDistinctMoiMaster(data);
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master prices list');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  const fetchCountMoiMaster = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/count-data-moi-master-for-check-duplicate?moi_waste_item=${MoiWasteItem_Add}&moi_waste_desc=${MoiWasteDesc_Add}`);
      const data = await response.data;
      const firstObject = data[0];
      const countUser = firstObject.count_chk;
      setDistinctCountMoiMaster(countUser);
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master prices list');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  useEffect(() => {
    fetchMoiMaster();
  }, []);

  useEffect(() => {
    fetchCountMoiMaster();
  }, [MoiWasteItem_Add , MoiWasteDesc_Add]);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  const columns = [
    { field: 'moi_waste_item_code', headerName: 'MOI Item', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'moi_waste_description', headerName: 'MOI Descriptions', width: 250 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'moi_waste_unit', headerName: 'MOI Unit', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'moi_waste_disposal', headerName: 'MOI Disposal', width: 200 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'update_by', headerName: 'Update By', width: 180 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'update_datetime', headerName: 'Update DateTime', width: 180 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'edit', headerName: 'Edit', width: 80 , headerAlign: 'center' , headerClassName: 'bold-header', align: 'center',
        renderCell: (params) => {
          // console.log('Row', params.row); // Add this line to log the row object
          return (
            <div>
              <button
                className="bg-orange-500 px-2 py-1.5 rounded-xl text-white hover:bg-orange-700 hover:scale-110 duration-300 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50"
                onClick={() => { handleEditClick(params.row); setIsModalOpen_Edit(true);}}
              >
                <EditIcon />
              </button>
            </div>
          );
        },
    },
    { field: 'delete', headerName: 'Delete', width: 80 , headerAlign: 'center' , headerClassName: 'bold-header', align: 'center',
        renderCell: (params) => {
          // console.log('Row', params.row); // Add this line to log the row object
          return (
            <div>
              <button
                className="bg-red-500 px-2 py-1.5 rounded-xl text-white hover:bg-red-700 hover:scale-110 duration-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                onClick={() => { handleDeleteClick(params.row);}}
              >
                <DeleteForeverSharpIcon />
              </button>
            </div>
          );
        },
    },
  ]

  const handleOpenModal_Add = () => {
    setIsModalOpen_Add(true);
    setMoiWasteUpdateBy_Add(userName +' '+ userSurname)
    // MoiWasteItemInputRef.current.focus();
    const currentDate = new Date();
    const formattedDateTime = formatDate(currentDate);

    setMoiWasteUpdateDateTime_Add(formattedDateTime)
  };

  const handleCloseModal_Add = () => {
    setIsModalOpen_Add(false);
    setMoiWasteItem_Add('');
    setMoiWasteDesc_Add('');
    setMoiWasteUnit_Add('');
    setMoiWasteDisp_Add('');
  };

  // Handle Modal for Edit
  const handleOpenModal_Edit = () => {
    setIsModalOpen_Edit(true);
    setMoiWasteUpdateBy_Add(userName +' '+ userSurname)
    // MoiWasteItemInputRef.current.focus();
    const currentDate = new Date();
    const formattedDateTime = formatDate(currentDate);

    setMoiWasteUpdateDateTime_Add(formattedDateTime)
    // setMoiWasteItem_Add()
  };

  const handleCloseModal_Edit = () => {
    setIsModalOpen_Edit(false);
  };

  const handleUMoiWasteItemChange_Add = (event) => {
    setMoiWasteItem_Add(event.target.value);
    setMoiWasteDesc_Add('');
    setMoiWasteUnit_Add('');
    setMoiWasteDisp_Add('');

    setMoiWasteItem_Edit(event.target.value);
    setMoiWasteDesc_Edit('');
    setMoiWasteUnit_Edit('');
    setMoiWasteDisp_Edit('');
  }

  const handleUMoiWasteDescChange_Add = (event) => {
    setMoiWasteDesc_Add(event.target.value);

    setMoiWasteDesc_Edit(event.target.value);
  }

  const handleUMoiWasteUnitChange_Add = (event) => {
    setMoiWasteUnit_Add(event.target.value);

    setMoiWasteUnit_Edit(event.target.value);
  }

  const handleUMoiWasteDispChange_Add = (event) => {
    setMoiWasteDisp_Add(event.target.value);

    setMoiWasteDisp_Edit(event.target.value);
  }

  const closeDialog_checkCount = () => {
    setIsDialogOpen_checkCount(false);
  };
  const openDialog_checkCount = () => {
    setIsDialogOpen_checkCount(true);
  }

  const closeDialog_checkNull = () => {
    setIsDialogOpen_checkNull(false);
  };
  const openDialog_checkNull = () => {
    setIsDialogOpen_checkNull(true);
  }

  const handleEditClick = (row) => {
    setSelectedMoiWasteItem_Edit(row.moi_waste_item_code)
    setSelectedMoiWasteDesc_Edit(row.moi_waste_description)
    setSelectedMoiWasteUnit_Edit(row.moi_waste_unit)
    setSelectedMoiWasteDisp_Edit(row.moi_waste_disposal)

    setMoiWasteItem_Edit(row.moi_waste_item_code)
    setMoiWasteDesc_Edit(row.moi_waste_description)
    setMoiWasteUnit_Edit(row.moi_waste_unit)
    setMoiWasteDisp_Edit(row.moi_waste_disposal)

    setMoiWasteUpdateBy_Edit(userName +' '+ userSurname)
    const currentDate = new Date();
    const formattedDateTime = formatDate_Edit(currentDate);

    setMoiWasteUpdateDateTime_Edit(formattedDateTime)
  };

  const handleDeleteClick = (row) => {
    setMoiWasteItem_Del(row.moi_waste_item_code)
    setMoiWasteDesc_Del(row.moi_waste_description)
    setMoiWasteUnit_Del(row.moi_waste_unit)
    setMoiWasteDisp_Del(row.moi_waste_disposal)
  };

  useEffect(() => {
      handleDeleteData();
  }, [MoiWasteItem_Del , MoiWasteDesc_Del , MoiWasteUnit_Del , MoiWasteDisp_Del]);

  const userString = localStorage.getItem("userToken");
  const userObject = JSON.parse(userString);
  const userName = userObject?.user_name;
  const userSurname = userObject?.user_surname;

  const handleSaveData_Add = (newValue) => {
    if (DistinctCountMoiMaster > 0) {
      openDialog_checkCount();
    } else if (MoiWasteItem_Add === '' || 
              MoiWasteDesc_Add === ''|| 
              MoiWasteUnit_Add === '' || 
              MoiWasteDisp_Add === '') {
      openDialog_checkNull();
    } else {
      const swalWithZIndex = Swal.mixin({
        customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
      });
      handleCloseModal_Add();
      
      swalWithZIndex.fire({
        title: "Confirm Save",
        text: "Are you sure want to save the data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Save",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get(
              `http://10.17.100.115:3001/api/smart_scrap/insert-data-moi-master?moi_waste_item=${MoiWasteItem_Add}&moi_waste_desc=${MoiWasteDesc_Add}&moi_waste_unit=${MoiWasteUnit_Add}&moi_waste_disp=${MoiWasteDisp_Add}&update_by=${MoiWasteUpdateBy_Add}`
            )
            .then(() => {
              // After all requests are completed, fetch the updated data
              return fetchMoiMaster();
            })
            .then(() => {
              // Success notification
              Swal.fire({
                icon: "success",
                title: "Save Success",
                text: "Saved data MOI Master successfully",
                confirmButtonText: "OK",
              });
              setMoiWasteItem_Add('')
              setMoiWasteDesc_Add('')
              setMoiWasteUnit_Add('')
              setMoiWasteDisp_Add('')
              // Close the modal
              // handleCloseModal();
            })
            .catch((error) => {
              console.error("Error saving data:", error);
              // Handle the error or display an error message using Swal
              Swal.fire({
                icon: "error",
                title: "Save Error",
                text: "An error occurred while saving data",
                confirmButtonText: "OK",
              });
            });
        }
      });
  
      document.querySelector('.my-swal-popup').style.zIndex = '9999';
    }
  }

  const handleDeleteData = (row) => {
    if (MoiWasteItem_Del == '' && MoiWasteDesc_Del == '' && MoiWasteUnit_Del == '' && MoiWasteDisp_Del == '') {
    } else {
      const swalWithZIndex = Swal.mixin({
        customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
      });
      
      swalWithZIndex.fire({
        title: "Confirm Delete",
        // text: "Are you sure want to Delete Item: " + MoiWasteItem_Del +" ?",
        text: "Are you sure want to delete Item: " + MoiWasteItem_Del + " ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // User confirmed, proceed with data saving
          // Delete existing data
          axios
            .get(
              `http://10.17.100.115:3001/api/smart_scrap/delete-data-moi-master?moi_waste_item=${MoiWasteItem_Del}&moi_waste_desc=${MoiWasteDesc_Del}&moi_waste_unit=${MoiWasteUnit_Del}&moi_waste_disp=${MoiWasteDisp_Del}`
            )
            .then(() => {
              // After all requests are completed, fetch the updated data
              return fetchMoiMaster();
            })
            .then(() => {
              // Success notification
              Swal.fire({
                icon: "success",
                title: "Delete Success",
                text: "Data MOI Master Deleteed successfully",
                confirmButtonText: "OK",
              });
              setMoiWasteItem_Del('')
              setMoiWasteDesc_Del('')
              setMoiWasteUnit_Del('')
              setMoiWasteDisp_Del('')
            })
            .catch((error) => {
              console.error("Error saving data:", error);
              // Handle the error or display an error message using Swal
              Swal.fire({
                icon: "error",
                title: "Delete Error",
                text: "An error occurred while Delete data",
                confirmButtonText: "OK",
              });
            });
        } else {
          setMoiWasteItem_Del('')
          setMoiWasteDesc_Del('')
          setMoiWasteUnit_Del('')
          setMoiWasteDisp_Del('')
        }
      });
    }
  }

  const handleSaveData_Edit = (newValue) => {
    if (MoiWasteItem_Edit === '' || 
        MoiWasteDesc_Edit === ''|| 
        MoiWasteUnit_Edit === '' || 
        MoiWasteDisp_Edit === '') {
      openDialog_checkNull();
    } else {
      const swalWithZIndex = Swal.mixin({
        customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
      });
      handleCloseModal_Edit();
      
      swalWithZIndex.fire({
        title: "Confirm Update",
        text: "Are you sure want to update the data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Update",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get(
              `http://10.17.100.115:3001/api/smart_scrap/update-data-moi-master?moi_waste_desc=${MoiWasteDesc_Edit}&moi_waste_unit=${MoiWasteUnit_Edit}&moi_waste_disp=${MoiWasteDisp_Edit}&moi_waste_update_by=${MoiWasteUpdateBy_Edit}&moi_waste_update_date=${MoiWasteUpdateDateTime_Edit}&selected_moi_waste_item=${SelectedMoiWasteItem_Edit}&selected_moi_waste_desc=${SelectedMoiWasteDesc_Edit}&selected_moi_waste_unit=${SelectedMoiWasteUnit_Edit}&selected_moi_waste_disp=${SelectedMoiWasteDisp_Edit}`
            )
            .then(() => {
              // After all requests are completed, fetch the updated data
              return fetchMoiMaster();
            })
            .then(() => {
              // Success notification
              Swal.fire({
                icon: "success",
                title: "Update Success",
                text: "Updated data MOI Master successfully",
                confirmButtonText: "OK",
              });
              setMoiWasteItem_Add('');
              setMoiWasteDesc_Add('');
              setMoiWasteUnit_Add('');
              setMoiWasteDisp_Add('');

              setMoiWasteItem_Edit('')
              setMoiWasteDesc_Edit('')
              setMoiWasteUnit_Edit('')
              setMoiWasteDisp_Edit('')
              
              // Close the modal
              // handleCloseModal();
            })
            .catch((error) => {
              console.error("Error saving data:", error);
              // Handle the error or display an error message using Swal
              Swal.fire({
                icon: "error",
                title: "Update Error",
                text: "An error occurred while saving data",
                confirmButtonText: "OK",
              });
            });
        }
      });
  
      document.querySelector('.my-swal-popup').style.zIndex = '9999';
    }
  }

  return (
    <>
      <Navbar onToggle={handleNavbarToggle}/>
      <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={10}>
            <div className="w-screen ml-16 mt-20">
              <Button 
                  variant="contained" 
                  className="btn_active hover:scale-110"
                  // size="small"  btn_active hover:scale-110
                  style={{  width: '300px', 
                            height: '50px' , 
                            backgroundColor: '#2B3499' , 
                            color:'white' ,
                            fontWeight: 'bold' , 
                            boxShadow: '5px 5px 5px grey' ,
                            borderRadius: 20 ,
                            border: '1px solid black'
                        }}
                  onClick={handleOpenModal_Add}
                  endIcon={<AddToPhotosIcon />}
                  >ADD NEW MOI WASTE MASTER
              </Button>
            </div>
            <div className="w-screen ml-16 mt-5">
              <Box sx={{width: 1250 , height: 700}}>
                <DataGrid
                  columns={columns}
                  rows={DistinctMoiMaster}
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
            </div>
            <Modal
                open={isModalOpen_Add}
                onClose={handleCloseModal_Add}
                aria-labelledby="key-weight-modal-title"
                aria-describedby="key-weight-modal-description"
            >
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 725 , height: 390 , bgcolor: '#B4D4FF', boxShadow: 24, p: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' , height: 20 , marginBottom: 20}}>
                        <div style={{width: '100%' ,fontWeight: 'bold' , fontSize: 20 , textAlign: 'center' }}>
                            <label htmlFor="" >ADD MOI WASTE MASTER</label>
                        </div>
                        <div>
                            <IconButton onClick={handleCloseModal_Add} style={{position: 'absolute', top: '10px', right: '10px',}}>
                                <CloseIcon style={{fontSize: '25px', color: 'white', backgroundColor: '#E55604'}} /> 
                            </IconButton>
                        </div>
                    </div>
                    <div style={{ height: 250 , backgroundColor: '#E4FBFF' }}>
                        <div >
                          <div style={{paddingTop: 20}}>
                            <TextField
                              // disabled
                              // ref={MoiWasteItemInputRef}
                              id="outlined-disabled"
                              label="- MOI Waste Item -"
                              value={MoiWasteItem_Add}
                              onChange={handleUMoiWasteItemChange_Add}
                              style={{backgroundColor: 'white' , marginLeft: 20  , width: 300 }}
                            />

                            <TextField
                              // disabled
                              id="outlined-disabled"
                              label="- MOI Waste Descriptions -"
                              value={MoiWasteDesc_Add}
                              onChange={handleUMoiWasteDescChange_Add}
                              style={{backgroundColor: 'white' , marginLeft: 20  , width: 300 }}
                            />
                          </div>

                          <div style={{paddingTop: 20}}>
                            <TextField
                              // disabled
                              id="outlined-disabled"
                              label="- MOI Waste Unit -"
                              value={MoiWasteUnit_Add}
                              onChange={handleUMoiWasteUnitChange_Add}
                              style={{backgroundColor: 'white' , marginLeft: 20  , width: 300 }}
                            />

                            <TextField
                              // disabled
                              id="outlined-disabled"
                              label="- MOI Waste Disposal -"
                              value={MoiWasteDisp_Add}
                              onChange={handleUMoiWasteDispChange_Add}
                              style={{backgroundColor: 'white' , marginLeft: 20  , width: 300 }}
                            />
                          </div>

                          <div style={{paddingTop: 20}}>
                            <TextField
                              disabled
                              id="outlined-disabled"
                              label="-Update By -"
                              value={MoiWasteUpdateBy_Add}
                              style={{backgroundColor: '#EEF5FF' , marginLeft: 20  , width: 300}}
                            />

                            <TextField
                              disabled
                              id="outlined-disabled"
                              label="-Update DateTime -"
                              value={MoiWasteUpdateDateTime_Add}
                              style={{backgroundColor: '#EEF5FF' , marginLeft: 20  , width: 300}}
                            />

                            {/* <Button variant="contained" startIcon={<CancelIcon />} onClick={handleCloseModal_Add} className="btn_hover" style={{backgroundColor: 'lightgray' , color: 'black' , width: 120 , height: 40 , marginLeft: 65, marginRight: 10 , marginTop: 12 , boxShadow: '3px 3px 5px grey'}}>
                                Cancel
                            </Button>
                            <Button variant="contained" endIcon={<AddToPhotosIcon />} onClick={handleSaveData_Add}  className="btn_hover" style={{backgroundColor: 'lightgreen' , color: 'black' , width: 120 , height: 40 , boxShadow: '3px 3px 5px grey' , marginTop: 12}}>
                                SAVE
                            </Button> */}
                          </div>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end' , marginTop: 10 , height: 45 }}>
                        <Button variant="contained" startIcon={<CancelIcon />} onClick={handleCloseModal_Add} className="btn_hover" style={{backgroundColor: 'lightgray' , color: 'black' , width: 120 , height: 40 , marginRight: 10 , boxShadow: '3px 3px 5px grey'}}>
                            Cancel
                        </Button>
                        <Button variant="contained" endIcon={<AddToPhotosIcon />} onClick={handleSaveData_Add}  className="btn_hover" style={{backgroundColor: 'lightgreen' , color: 'black' , width: 120 , height: 40 , boxShadow: '3px 3px 5px grey'}}>
                            SAVE
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Modal for Edit */}
            <Modal
                open={isModalOpen_Edit}
                onClose={handleCloseModal_Edit}
                aria-labelledby="key-weight-modal-title"
                aria-describedby="key-weight-modal-description"
            >
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 725 , height: 390 , bgcolor: '#B4D4FF', boxShadow: 24, p: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' , height: 20 , marginBottom: 20}}>
                        <div style={{width: '100%' ,fontWeight: 'bold' , fontSize: 20 , textAlign: 'center' }}>
                            <label htmlFor="" >EDIT MOI WASTE MASTER</label>
                        </div>
                        <div>
                            <IconButton onClick={handleCloseModal_Edit} style={{position: 'absolute', top: '10px', right: '10px',}}>
                                <CloseIcon style={{fontSize: '25px', color: 'white', backgroundColor: '#E55604'}} /> 
                            </IconButton>
                        </div>
                    </div>
                    <div style={{ height: 250 , backgroundColor: '#E4FBFF' }}>
                        <div >
                          <div style={{paddingTop: 20}}>
                            <TextField
                              disabled
                              id="outlined-disabled"
                              label="- MOI Waste Item -"
                              value={MoiWasteItem_Edit}
                              onChange={handleUMoiWasteItemChange_Add}
                              style={{backgroundColor: '#EEF5FF' , marginLeft: 20  , width: 300 }}
                            />

                            <TextField
                              // disabled
                              id="outlined-disabled"
                              label="- MOI Waste Descriptions -"
                              value={MoiWasteDesc_Edit}
                              onChange={handleUMoiWasteDescChange_Add}
                              style={{backgroundColor: 'white' , marginLeft: 20  , width: 300 }}
                            />
                          </div>

                          <div style={{paddingTop: 20}}>
                            <TextField
                              // disabled
                              id="outlined-disabled"
                              label="- MOI Waste Unit -"
                              value={MoiWasteUnit_Edit}
                              onChange={handleUMoiWasteUnitChange_Add}
                              style={{backgroundColor: 'white' , marginLeft: 20  , width: 300 }}
                            />

                            <TextField
                              // disabled
                              id="outlined-disabled"
                              label="- MOI Waste Disposal -"
                              value={MoiWasteDisp_Edit}
                              onChange={handleUMoiWasteDispChange_Add}
                              style={{backgroundColor: 'white' , marginLeft: 20  , width: 300 }}
                            />
                          </div>

                          <div style={{paddingTop: 20}}>
                            <TextField
                              disabled
                              id="outlined-disabled"
                              label="-Update By -"
                              value={MoiWasteUpdateBy_Edit}
                              style={{backgroundColor: '#EEF5FF' , marginLeft: 20  , width: 300}}
                            />

                            <TextField
                              disabled
                              id="outlined-disabled"
                              label="-Update DateTime -"
                              value={MoiWasteUpdateDateTime_Edit}
                              style={{backgroundColor: '#EEF5FF' , marginLeft: 20  , width: 300}}
                            />

                            {/* <Button variant="contained" startIcon={<CancelIcon />} onClick={handleCloseModal_Add} className="btn_hover" style={{backgroundColor: 'lightgray' , color: 'black' , width: 120 , height: 40 , marginLeft: 65, marginRight: 10 , marginTop: 12 , boxShadow: '3px 3px 5px grey'}}>
                                Cancel
                            </Button>
                            <Button variant="contained" endIcon={<AddToPhotosIcon />} onClick={handleSaveData_Add}  className="btn_hover" style={{backgroundColor: 'lightgreen' , color: 'black' , width: 120 , height: 40 , boxShadow: '3px 3px 5px grey' , marginTop: 12}}>
                                SAVE
                            </Button> */}
                          </div>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end' , marginTop: 10 , height: 45 }}>
                        <Button variant="contained" startIcon={<CancelIcon />} onClick={handleCloseModal_Edit} className="btn_hover" style={{backgroundColor: 'lightgray' , color: 'black' , width: 120 , height: 40 , marginRight: 10 , boxShadow: '3px 3px 5px grey'}}>
                            Cancel
                        </Button>
                        <Button variant="contained" endIcon={<AddToPhotosIcon />} onClick={handleSaveData_Edit}  className="btn_hover" style={{backgroundColor: 'lightgreen' , color: 'black' , width: 120 , height: 40 , boxShadow: '3px 3px 5px grey'}}>
                            SAVE
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Dialog for check data Duplicate */}
            <Dialog open={isDialogOpen_checkCount} onClose={closeDialog_checkCount}>
                <DialogTitle style={{backgroundColor: '#6499E9' , color: 'red'}}>Duplicate data</DialogTitle>
                <DialogContent style={{backgroundColor: '#9EDDFF'  , color: 'red'}}>
                      <DialogContentText  style={{paddingTop: 20 , color: 'black' , paddingLeft: 0}}>
                          Duplicate data in system, Please check try again.
                      </DialogContentText>
                </DialogContent>
                <DialogActions style={{backgroundColor: '#9EDDFF' , height: 50}}>
                      <Button onClick={() => { closeDialog_checkCount()}} style={{width: 100 , backgroundColor: '#7C81AD' , borderRadius:5 , border: '1px solid black' , color: 'white'}}>
                          OK
                      </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for check data null */}
            <Dialog open={isDialogOpen_checkNull} onClose={closeDialog_checkNull}>
                <DialogTitle style={{backgroundColor: '#6499E9' , color: 'red'}}>Incomplete data</DialogTitle>
                <DialogContent style={{backgroundColor: '#9EDDFF'  , color: 'red'}}>
                      <DialogContentText  style={{paddingTop: 20 , color: 'black' , paddingLeft: 0}}>
                          Incomplete data for save, Please check try again.
                      </DialogContentText>
                </DialogContent>
                <DialogActions style={{backgroundColor: '#9EDDFF' , height: 50}}>
                      <Button onClick={() => { closeDialog_checkNull()}} style={{width: 100 , backgroundColor: '#7C81AD' , borderRadius:5 , border: '1px solid black' , color: 'white'}}>
                        OK
                      </Button>
                </DialogActions>
            </Dialog>
      </Box>
    </>
  );
}
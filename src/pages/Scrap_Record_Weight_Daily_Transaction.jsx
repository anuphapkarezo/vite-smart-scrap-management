import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Smart_Scrap_SearchFactoryGroup from "../components/SearchGroup/Smart_Scrap_SearchFactoryGroup";
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import Navbar from "../components/navbar/Navbar";
import ScaleIcon from '@mui/icons-material/Scale';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Scrap_Record_Weight_Daily_Transaction({ onSearch }) {
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWasteItem, setSelectedWasteItem] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editedTotalWeight, setEditedTotalWeight] = useState('0.00');
  const [editedTotalWeightDisabled, setEditedTotalWeightDisabled] = useState(false);
  const [editedDetailWeightDisabled, setEditedDetailWeightDisabled] = useState(false);
  
  const [error, setError] = useState(null);
  const [roundedTotalWeight, setRoundedTotalWeight] = useState(0);
  const [labelColor, setLabelColor] = useState('black');
  const [labelColor_detail, setLabelColor_detail] = useState('black');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const totalWeightInputRef = useRef(null);
  const detailWeightInputRef = useRef(null);

  const [inputData, setInputData] = useState('');
  const [detailWeightSum, setDetailWeightSum] = useState(0);

  const [showLblSum, setShowLblSum] = useState(true);
  const [showLblDet, setShowLblDet] = useState(false);

  const [distinct_record_weight, setDistinct_record_weight] = useState([]);
  const [distinct_weight_details, setDistinct_weight_details] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (detailWeightSum > parseFloat(editedTotalWeight)) {
      openDialog();
    }
  }, [detailWeightSum, editedTotalWeight]);

  const userString = localStorage.getItem("userToken");
  const userObject = JSON.parse(userString);
  const userName = userObject?.user_name;
  const userSurname = userObject?.user_surname;

  const columns = [
    { field: 'waste_factory_name', headerName: 'Factory', width: 100 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_group', headerName: 'Group', width: 250 , headerAlign: 'center' , headerClassName: 'bold-header'},
    { field: 'waste_date_take_off', headerName: 'Date take off', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'waste_item', headerName: 'Waste Item', width: 300 , headerAlign: 'center' , headerClassName: 'bold-header'},
    { field: 'waste_unit', headerName: 'Unit', width: 80 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'total', headerName: 'Total', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center',
      renderCell: (params) => (
        <input
          type="input"
          // value={params.value}
          // value={params.value === 0 ? '0.00' : params.value}
          value={params.value === 0 ? '0.00' : Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          onChange={(e) => handleTotalChange(params.id, e.target.value)}
          // onKeyPress={(e) => handleKeyPress(e, params.id)}
          style={{ width: 130 , height: '30px' , textAlign:'center'}}
          disabled={params.row.detail >= 0}
        />
      ),
    },
    { field: 'detail', headerName: 'Details', width: 150 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center',
      renderCell: (params) => (
        <input
          type="input"
          // value={params.value}
          // value={params.value === 0 ? '0.00' : params.value}
          value={params.value === 0 ? '0.00' : Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          onChange={(e) => handleTotalChange(params.id, e.target.value)}
          style={{ width: 130 , height: '30px' , textAlign:'center'}}
          disabled={params.row.detail >= 0}
        />
      ),
    },
    { field: 'update_by', headerName: 'Update By', width: 180 , headerAlign: 'center' , headerClassName: 'bold-header', align: 'center',
    },
    { field: 'update_date', headerName: 'Update Date', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header', align: 'center'},
    { field: 'record_weight', headerName: 'Record Weight', width: 130 , headerAlign: 'center' , headerClassName: 'bold-header', align: 'center',
      renderCell: (params) => (
        <div>
          <Button variant="contained" onClick={() => { handleKeyWeightClick(params.row.id); setIsModalOpen(true); }}
                  className="btn_hover hover:scale-110" style={{backgroundColor: '#FFCD4B' , color: 'black' ,  width: 50 , height: '35px' , textAlign:'center' , boxShadow: '3px 3px 5px grey' , marginLeft: 5}}>
                  <ScaleIcon />
          </Button>
        </div>
      ),
    },
  ]

  const columns_modal = [
    { field: 'waste_date_take_off', headerName: 'Date take off', width: 150 , headerAlign: 'center' , headerClassName: 'custom-header' , align: 'center'},
    { field: 'waste_factory_name', headerName: 'Factory', width: 137 , headerAlign: 'center' , headerClassName: 'custom-header' , align: 'center'},
    { field: 'waste_item_code', headerName: 'Waste Item', width: 150 , headerAlign: 'center' , headerClassName: 'custom-header' , align: 'center'},
    { field: 'waste_group_code', headerName: 'Waste Group', width: 150 , headerAlign: 'center' , headerClassName: 'custom-header' , align: 'center'},
    { field: 'waste_detail_no', headerName: 'Detail No.', width: 120 , headerAlign: 'center' , headerClassName: 'custom-header' , align: 'center'},
    { field: 'waste_weight', headerName: 'Weight', width: 120 , headerAlign: 'center' , headerClassName: 'custom-header' , align: 'center' , editable: true},
  ]
  const [editRowsModel, setEditRowsModel] = React.useState({});


  const handleEditRowsModelChange = React.useCallback((newModel) => {
    console.log("editRowsModel" , editRowsModel);

    setEditRowsModel(newModel);
  }, []);

  const handleTotalChange = (id, value) => {
    const updatedRows = distinct_record_weight.map((row) =>
      row.id === id ? { ...row, total: value } : row
    );
    setDistinct_record_weight(updatedRows);
  };

  const handleKeyWeightClick = (row) => {
    setSelectedRecord(row);
    setEditedTotalWeight(row.total || '');
    console.log('row.total',row.total);

    // Check if row.waste_item is defined
    if (row.waste_item) {
      // Extract selectedWasteItem from the row
      const selectedWasteItem = row.waste_item;
      const parts = selectedWasteItem.split(' / ');
      const selectedWasteItem_split = parts[0];

      // Call the fetch_weight_by_detail function with selectedWasteItem
      fetch_weight_by_detail(selectedWasteItem_split , row.id);
  }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedTotalWeightDisabled(true);
    setEditedDetailWeightDisabled(true);
    setDetailWeightSum(0);
    setShowLblSum(true);
  };

  const handleTotalWeightChange = (e , id) => {
    console.log('Handling total weight change');
    const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '');

    if (/^-?\d*\.?\d*$/.test(sanitizedValue)) {
      setEditedTotalWeight(sanitizedValue);
    }
    const updatedRows = distinct_record_weight.map((row) =>
      row.id === id ? { ...row, total: editedTotalWeight } : row
    );

    setDistinct_record_weight(updatedRows);
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      detailWeightInputRef.current.focus();
      setEditedTotalWeightDisabled(true);
    }
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTotalWeightDisabled(false);
    setEditedDetailWeightDisabled(false);
    setEditedTotalWeight('');
    // setRoundedTotalWeight('5.00');
    // setConfirmButtonClicked(false);
    
    totalWeightInputRef.current.focus();
    // setDistinct_weight_details([]);

    setShowLblSum(false);
    setShowLblDet(true);
  };
  
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });


  useEffect(() => {
    if (selectedFactory && selectedGroup && selectedDate) {
      fetch_record_weight();
    }
  }, [selectedFactory, selectedGroup, selectedDate]);

  function getCode(item) {
    // Split the string based on the '/' separator and get the first part
    const parts = item.split('/');
    return parts[0] ? parts[0].trim() : '';
  }

  function getDescription(item) {
    // Split the string based on the '/' separator and get the second part
    const parts = item.split('/');
    return parts[1] ? parts[1].trim() : '';
  }

  useEffect(() => {
    // This effect will run whenever editedTotalWeight or roundedTotalWeight changes.
    if (editedTotalWeight === roundedTotalWeight && roundedTotalWeight !== 0.00) {
      setLabelColor('green');
    } else if (roundedTotalWeight === 0.00) {
      setLabelColor('black');
    } else {
      setLabelColor('red');
    }
  }, [editedTotalWeight, roundedTotalWeight ]);


  const fetch_record_weight = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-daily-transaction?date_take_of=${selectedDate}&group=${selectedGroup}&factory=${selectedFactory}`);
        const data = await response.data;
        console.log(data);
        // Add a unique id property to each row
        const rowsWithId = data.map((row, index) => ({
            ...row,
            id: index, // You can use a better unique identifier here if available
        }));
        setDistinct_record_weight(rowsWithId);
        } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data record_weight');
        } finally {
          setIsLoading(false); // Set isLoading back to false when fetch is complete
        }
  };

  const fetch_weight_by_detail = async (selectedWasteItem_split) => {
    try {
        setIsLoading(true);
        const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-select-daily-transaction-by-detail?date_take_of=${selectedDate}&waste_item_code=${selectedWasteItem_split}&factory=${selectedFactory}`);
        const data = await response.data;

        const rowsWithId = data.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
        }));
        setDistinct_weight_details(rowsWithId);
        // Sum the waste_weight values after converting them to numbers
        const totalWeight = data.reduce((accumulator, item) => accumulator + parseFloat(item.waste_weight), 0);

        // Round the result to two decimal places
        const roundedTotalWeight = totalWeight.toFixed(2);
        setRoundedTotalWeight(roundedTotalWeight);
        console.log('Total Waste Weight:', roundedTotalWeight);
        
        } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data record_weight');
        } finally {
          setIsLoading(false); // Set isLoading back to false when fetch is complete
        }
  };

  const updateDetailWeightSum = (value) => {
    // Parse the input value as a float
    const parsedValue = parseFloat(value);
    const TotalValue = parseFloat(roundedTotalWeight);
    
    // Check if the parsed value is a valid number
    if (!isNaN(parsedValue)) {
      // Update the sum by adding the parsed value
      const SumValue = parsedValue + TotalValue
      setRoundedTotalWeight(0)
      setDetailWeightSum((prevSum) => prevSum + SumValue);
    }
  };

  useEffect(() => {
    if (editedTotalWeight > detailWeightSum ) {
      setLabelColor_detail('red');
    } else {
      setLabelColor_detail('green');
    }
  }, [editedTotalWeight , detailWeightSum]);
  
  const handleInputChange = (value) => {
    setInputData(value);
  };

  const handleInsertData = () => {
    var numericValue = parseFloat(inputData);
    if (inputData) {
      // You can add some validation if needed
  
      // Create a new row with the input data and an unique ID
      const newRow = {
        id: distinct_weight_details.length + 1, // You can use a better unique identifier here if available
        waste_date_take_off: selectedDate,
        waste_factory_name: selectedFactory,
        waste_item_code: selectedRecord ? getCode(selectedRecord.waste_item) : '',
        waste_group_code: selectedRecord ? getCode(selectedRecord.waste_group) : '',
        // waste_detail_no: distinct_weight_details.length + 1,
        waste_detail_no: (distinct_weight_details.length + 1).toString(),
        waste_weight: numericValue,
        waste_update_by: `${userName} ${userSurname}`
      };
  
      // Update the distinct_weight_details state with the new row
      setDistinct_weight_details([...distinct_weight_details, newRow]);

      updateDetailWeightSum(inputData);
  
      // Clear the input field after inserting data
      setInputData('');
      // setRoundedTotalWeight(inputData);

    }
  };

  const [isDialogOpen_button, setIsDialogOpen_button] = useState(false);
  const openDialog_button = () => {
    setIsDialogOpen_button(true);
  };
  
  const closeDialog_button = () => {
    detailWeightInputRef.current.focus();
    setIsDialogOpen_button(false);
  };

  const handleSaveData = () => {

    if (detailWeightSum < parseFloat(editedTotalWeight)) {
      console.log("Step 1");
      openDialog_button();
    } else if (detailWeightSum == 0 || parseFloat(editedTotalWeight) == '') {
      console.log("Step 2");
      openDialog_button();
    } else {
      // Display a confirmation dialog using SweetAlert
      const swalWithZIndex = Swal.mixin({
        customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
      });
      handleCloseModal();
      
      swalWithZIndex.fire({
        title: "Confirm Save",
        text: "Are you sure you want to save the data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Save",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // User confirmed, proceed with data saving
          // Delete existing data
          axios
            .get(
              `http://10.17.100.115:3001/api/smart_scrap/delete-data-daily-transaction?waste_date_take_off=${selectedDate}&waste_factory_name=${selectedFactory}&waste_group_code=${getCode(selectedRecord.waste_group)}&waste_item_code=${getCode(selectedRecord.waste_item)}`
            )
            .then(() => {
              // Create an array of promises to insert data for distinct_weight_details
              const insertPromises = distinct_weight_details.map((row) => {
                // console.log("row.id" , row.id);
                // console.log("row.waste_date_take_off" , row.waste_date_take_off);
                // console.log("row.waste_factory_name" , row.waste_factory_name);
                // console.log("row.waste_item_code" , row.waste_item_code);
                // console.log("row.waste_group_code" , row.waste_group_code);
                // console.log("row.waste_detail_no" , row.waste_detail_no);
                // console.log("row.waste_weight" , row.waste_weight);


                return axios.get(
                  `http://10.17.100.115:3001/api/smart_scrap/insert-data-daily-transaction?waste_date_take_off=${row.waste_date_take_off}&waste_factory_name=${row.waste_factory_name}&waste_item_code=${row.waste_item_code}&waste_group_code=${row.waste_group_code}&waste_detail_no=${row.waste_detail_no}&waste_weight=${row.waste_weight}&waste_update_by=${userName} ${userSurname}`
                );
              });
  
              // Use Promise.all to wait for all insert requests to complete
              return Promise.all(insertPromises);
            })
            .then(() => {
              // After all requests are completed, fetch the updated data
              return fetch_record_weight();
            })
            .then(() => {
              // Success notification
              Swal.fire({
                icon: "success",
                title: "Save Success",
                text: "Data record weight saved successfully",
                confirmButtonText: "OK",
              });
  
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
  
      // Set a higher z-index for the SweetAlert dialog
      document.querySelector('.my-swal-popup').style.zIndex = '9999';
    }
  };

  const handleDeleteData = () => {
      const swalWithZIndex = Swal.mixin({
        customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
      });
      handleCloseModal();
      
      swalWithZIndex.fire({
        title: "Confirm Delete",
        text: "Are you sure you want to Delete the data?",
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
              `http://10.17.100.115:3001/api/smart_scrap/delete-data-daily-transaction?waste_date_take_off=${selectedDate}&waste_factory_name=${selectedFactory}&waste_group_code=${getCode(selectedRecord.waste_group)}&waste_item_code=${getCode(selectedRecord.waste_item)}`
            )
            .then(() => {
              // After all requests are completed, fetch the updated data
              return fetch_record_weight();
            })
            .then(() => {
              // Success notification
              Swal.fire({
                icon: "success",
                title: "Delete Success",
                text: "Data record weight Deleteed successfully",
                confirmButtonText: "OK",
              });
  
              // Close the modal
              // handleCloseModal();
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
        }
      });
  }
  
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };

  return (
    <>
      <Navbar onToggle={handleNavbarToggle}/>
      <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={8}>
    <div className="w-screen ml-16 mt-20">
        <div >
            {/* <Smart_Scrap_SearchFactoryGroup onSearch={onSearch} /> */}
            <Smart_Scrap_SearchFactoryGroup
                onSearch={(queryParams) => {
                  setSelectedFactory(queryParams.factory);
                  setSelectedGroup(queryParams.group);
                  setSelectedDate(queryParams.date_take_of);
                }}
            />
        </div>
        <Box sx={{width: '1675px' , height: 725 , marginTop: '25px'}}>
            {isLoading ? (
              <CircularProgress /> // Display a loading spinner while data is being fetched
            ) : (
              <DataGrid
                columns={columns}
                // disableColumnFilter
                // disableDensitySelector
                rows={distinct_record_weight}
                onRowClick={(params, event) => handleKeyWeightClick(params.row)}
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
        {/* Modal for "Key Weight" button */}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="key-weight-modal-title"
          aria-describedby="key-weight-modal-description"
        >
          
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 900, bgcolor: '#AED2FF', boxShadow: 24, p: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' , fontFamily: 'Lucida Sans'}}>
                <div style={{textAlign: 'center' , fontWeight: 'bold' , fontSize: '20px' , marginBottom: '10px'}}>
                    <label htmlFor="" >Key weight details by item scrap</label>
                </div>
                <div>
                    <IconButton onClick={handleCloseModal} style={{position: 'absolute', top: '10px', right: '10px',}}>
                        <CloseIcon style={{fontSize: '24px', color: 'white', backgroundColor: '#E55604'}} />
                    </IconButton>
                </div>
            </div>
            <div style={{ height: 655}}>
                <div style={{  height: 140 , backgroundColor: '#E4F1FF' , borderRadius: 15 }}>
                    <div>
                      <label style={{marginLeft: '28px' ,marginTop: '15px' , fontSize: 16}}>Date take off :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '15px' , fontSize: 16, width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE' , boxShadow: '3px 3px 5px grey'}} type="text" value={selectedDate} disabled/> 

                      <label style={{marginLeft: '75px' ,marginTop: '15px' , fontSize: 16}}>Factory :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '15px' , fontSize: 16, width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE' , boxShadow: '3px 3px 5px grey'}} type="text" value={selectedFactory} disabled/> 
                    </div>
                    <div>
                      <label style={{marginLeft: '48px' ,marginTop: '10px' , fontSize: 16}}>Group code :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '10px' , fontSize: 16, width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE' , boxShadow: '3px 3px 5px grey'}} type="text" value={selectedRecord ?  getCode(selectedRecord.waste_group) : ''} disabled/> 

                      <label style={{marginLeft: '45px' ,marginTop: '10px' , fontSize: 16}}>Group Desc. :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '10px' , fontSize: 16, width: 280 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE' , boxShadow: '3px 3px 5px grey'}} type="text" value={selectedRecord ? getDescription(selectedRecord.waste_group) : ''} disabled/> 
                    </div>
                    <div>
                      <label style={{marginLeft: '55px' ,marginTop: '10px' , fontSize: 16}}>Item code :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '10px' , fontSize: 16, width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE' , boxShadow: '3px 3px 5px grey'}} type="text" value={selectedRecord ?  getCode(selectedRecord.waste_item) : ''} disabled/> 

                      <label style={{marginLeft: '52px' ,marginTop: '10px' , fontSize: 16}}>Item Desc. :</label>
                      <input style={{marginLeft: '10px' ,marginTop: '10px' , fontSize: 16, width: 280 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' ,backgroundColor: '#EEEEEE' , boxShadow: '3px 3px 5px grey'}} type="text" value={selectedRecord ? getDescription(selectedRecord.waste_item) : ''} disabled/> 
                    </div>
                </div>
                <div style={{paddingTop: '10px' , display: 'flex'}}>
                  <label style={{marginTop: '5px' , marginLeft: '10px'}}>Total Weight :</label>
                  <input  ref={totalWeightInputRef}  
                          style={{marginLeft: '10px', fontSize: 16 , fontWeight: 'bold', width: 150 , height: 30 , textAlign: 'center' , border: '1px solid black' , borderRadius: '5px' , color: isEditing && !editedTotalWeightDisabled ? 'blue' : 'black', boxShadow: '3px 3px 5px grey'}} 
                          type="text" 
                          value={editedTotalWeight !== null ? editedTotalWeight : ''}
                          onChange={(e) => handleTotalWeightChange(e)}
                          disabled={!isEditing || editedTotalWeightDisabled}
                          onKeyPress={handleKeyPress}
                  />
                  <Button variant="contained" startIcon={<BorderColorIcon />} onClick={handleEditClick}
                        className="btn_active hover:scale-110" style={{marginLeft: 5 , backgroundColor: '#FFB000' , color: 'black' ,  width: 70 , height: 30 , textAlign:'center', borderRadius: '5px' , boxShadow: '3px 3px 5px grey'}}>
                        Edit
                  </Button>
                  
                  <label style={{marginLeft: '5px' , marginTop: '5px' , color: 'brown'}}>(Double click for Edit)</label>
                 
                  {showLblSum && (
                      <label id="lbl_sum" style={{ marginLeft: '170px', marginTop: '5px', color: labelColor }}>
                          {roundedTotalWeight}
                      </label>
                  )}

                  {showLblDet && detailWeightSum > 0 && (
                      <label id="lbl_det" style={{ marginLeft: '200px', marginTop: '5px', color: labelColor_detail }}>
                          {detailWeightSum.toFixed(2)}
                      </label>
                  )}

                </div>
                <div >
                    <input
                        ref={detailWeightInputRef}
                        type="text"
                        placeholder="Key Weight"
                        value={inputData}
                        onChange={(e) => handleInputChange(e.target.value)} // handleInputChange should be defined to update data
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleInsertData();
                          }
                        }}
                        style={{ width: 100, height: 30, marginRight: 10 ,marginTop: 10 , textAlign: 'center' , color: 'blue', boxShadow: '3px 3px 5px grey'}}
                        disabled={!isEditing || editedDetailWeightDisabled}
                      />
                </div>
                <Box sx={{width: 830 , height: 400 , marginTop: '5px' , backgroundColor: '#E4F1FF' , boxShadow: '5px 5px 10px grey'}}>
                  {isLoading ? (
                    <CircularProgress /> // Display a loading spinner while data is being fetched
                  ) : (
                    <DataGrid
                      id="Datagrid-modal"
                      columns={columns_modal}
                      rows={distinct_weight_details}
                      editRowsModel={editRowsModel}
                      onEditRowsModelChange={handleEditRowsModelChange}
                    />
                  )}
                </Box>
               
              <div style={{ display: 'flex', justifyContent: 'flex-end' , marginTop: 8}}>
                <Button variant="contained" startIcon={<DeleteIcon />} onClick={handleDeleteData} className="btn_hover" style={{backgroundColor: '#FE0000' , color: 'white' , width: 120 , height: 40 , marginRight: 470 , boxShadow: '3px 3px 5px grey'}}>
                    Delete
                </Button>
                <Button variant="contained" startIcon={<CancelIcon />} onClick={handleCloseModal} className="btn_hover" style={{backgroundColor: 'lightgray' , color: 'black' , width: 120 , height: 40 , marginRight: 10 , boxShadow: '3px 3px 5px grey'}}>
                    Cancel
                </Button>
                
                <Button variant="contained" endIcon={<VerticalAlignBottomIcon />} onClick={handleSaveData} className="btn_hover" style={{backgroundColor: 'lightgreen' , color: 'black' , width: 120 , height: 40 , boxShadow: '3px 3px 5px grey'}}>
                    Confirm
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
          <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle style={{backgroundColor: '#6499E9' , color: 'red'}}>Warning Record !!</DialogTitle>
          <DialogContent style={{backgroundColor: '#9EDDFF'  , color: 'red'}}>
            <DialogContentText  style={{paddingTop: 20 , color: 'brown' , paddingLeft: 0}}>
                Detail weight &gt; Total, Please check try again.
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{backgroundColor: '#9EDDFF' , height: 50}}>
            <Button onClick={() => { closeDialog(); handleCloseModal(); }} style={{width: 100 , backgroundColor: '#7C81AD' , borderRadius:5 , border: '1px solid black' , color: 'white'}}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        {/* ///////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Dialog open={isDialogOpen_button} onClose={closeDialog_button}>
          <DialogTitle style={{backgroundColor: '#6499E9' , color: 'red'}}>Warning Record !!</DialogTitle>
          <DialogContent style={{backgroundColor: '#9EDDFF'  , color: 'red'}}>
            <DialogContentText  style={{paddingTop: 20 , color: 'brown' , paddingLeft: 0}}>
                Detail weight &lt; Total, Please check try again.
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{backgroundColor: '#9EDDFF' , height: 50}}>
            <Button onClick={() => { closeDialog_button()}} style={{width: 100 , backgroundColor: '#7C81AD' , borderRadius:5 , border: '1px solid black' , color: 'white'}}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
    </div>
    </Box>
    </>
  );
}
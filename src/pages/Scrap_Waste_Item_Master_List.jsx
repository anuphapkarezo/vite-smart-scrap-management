import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Scrap_Record_Weight_Daily_Transaction.css'; // Import the CSS file
import axios from "axios";
import Modal from '@mui/material/Modal';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Navbar from "../components/navbar/Navbar";
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

export default function Scrap_Waste_Item_Master_List({ onSearch }) {
  const [distinctWasteItemList, setDistinctWasteItemList] = useState([]);
  const [DistinctCountWasteItemMaster, setDistinctCountWasteItemMaster] = useState(0);
  const [distinctWasteGroupCodeNameList, setDistinctWasteGroupCodeNameList] = useState([]);
  const [distinctMoiItemCodeNamelist, setDistinctMoiItemCodeNamelist] = useState([]);

  const [WasteItem, setWasteItem] = useState('');
  const [WasteGroup, setWasteGroup] = useState('');
  const [WasteDescEN, setWasteDescEN] = useState('');
  const [WasteDescTH, setWasteDescTH] = useState('');
  const [WasteUnit, setWasteUnit] = useState('');
  const [MoiWasteItem, setMoiWasteItem] = useState('');

  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });

  // Using this for Update By //
  const userString = localStorage.getItem("userToken");
  const userObject = JSON.parse(userString);
  const userName = userObject?.user_name;
  const userSurname = userObject?.user_surname;
  const ShortSurname = userSurname?.charAt(0);
  const update_by = userName +'.'+ ShortSurname; 

  // Using this for Update Date //
  const now_x = new Date();
  const year = now_x.getFullYear();
  const month_x = (now_x.getMonth() + 1).toString().padStart(2, '0');
  const date = now_x.getDate().toString().padStart(2, '0');
  const hours = now_x.getHours().toString().padStart(2, '0');
  const minutes = now_x.getMinutes().toString().padStart(2, '0');
  const update_date = date +'/'+ month_x +'/'+ year +' '+ hours +':'+ minutes;

  const handleNavbarToggle = (openStatus) => {
    setIsNavbarOpen(openStatus);
  };
  
  const handleOpenModalAdd = () => {
    setIsModalOpenAdd(true)
  };
  const handleCloseModalAdd = () => {
    setIsModalOpenAdd(false)
    setWasteGroup('')
    setWasteDescEN('')
    setWasteDescTH('')
    setWasteUnit('')
    setMoiWasteItem('')
  };

  const handleUWasteItemChange = (event) => {
    setWasteItem(event.target.value);

    setWasteGroup('')
    setWasteDescEN('')
    setWasteDescTH('')
    setWasteUnit('')
    setMoiWasteItem('')
  }

  const handleUWasteGroupChange = (event, newValue) => {
    setWasteGroup(newValue);
  }

  const handleUWasteDescENChange = (event) => {
    setWasteDescEN(event.target.value);
  }

  const handleUWasteDescTHChange = (event) => {
    setWasteDescTH(event.target.value);
  }

  const handleUWasteUnitChange = (event) => {
    setWasteUnit(event.target.value);
  }

  const handleUMoiWasteItemChange = (event, newValue) => {
    setMoiWasteItem(newValue);
  }

  const handleUCancelAdd = (event) => {
    setWasteItem('')
    setWasteGroup('')
    setWasteDescEN('')
    setWasteDescTH('')
    setWasteUnit('')
    setMoiWasteItem('')
    setDistinctCountWasteItemMaster(0)
  }

  const handleSaveAdd = (newValue) => {
    const parts = WasteGroup.group_code.split(' / ');
    const GroupCode = parts[0];

    const parts_m = MoiWasteItem.moi_code.split(' / ');
    const MoiCode = parts_m[0];

    // console.log('distin' , DistinctCountWasteItemMaster);
    // console.log('WasteItem' , WasteItem);
    // console.log('GroupCode' , GroupCode);
    // console.log('WasteDescEN' , WasteDescEN);
    // console.log('WasteDescTH' , WasteDescTH);
    // console.log('WasteUnit' , WasteUnit);
    // console.log('MoiCode' , MoiCode);


    if (DistinctCountWasteItemMaster > 0) {
      handleOpenDialog()
    }
    if (WasteItem === '' || GroupCode === '' || WasteDescEN === '' || WasteDescTH === '' || WasteUnit === '' || MoiCode === '') {
      return
    } else {
      const swalWithZIndex = Swal.mixin({
        customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
        },
      });
      handleCloseModalAdd();
    
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
              `http://10.17.100.115:3001/api/smart_scrap/insert-waste-item-master-list?waste_item=${WasteItem}&waste_desc_en=${WasteDescEN}&waste_desc_th=${WasteDescTH}&waste_group_code=${GroupCode}&waste_unit=${WasteUnit}&waste_moi_item=${MoiCode}&update_by=${update_by}&update_date=${update_date}`
            )
            .then(() => {
              return fetchWasteMaster();
            })
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Save Success",
                text: "Saved data Waste Item Master successfully",
                confirmButtonText: "OK",
              });
              setWasteItem('')
              setWasteGroup('')
              setWasteDescEN('')
              setWasteDescTH('')
              setWasteUnit('')
              setMoiWasteItem('')
              setDistinctCountWasteItemMaster(0)
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
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setWasteItem('')
    setWasteGroup('')
    setWasteDescEN('')
    setWasteDescTH('')
    setWasteUnit('')
    setMoiWasteItem('')
  };

  const fetchWasteMaster = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-waste-item-master-list`);
      const data = await response.data;
      const rowsWithId = data.map((row, index) => ({
          ...row,
          id: index, // You can use a better unique identifier here if available
      }));
      setDistinctWasteItemList(rowsWithId);
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master prices list');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  const fetchCountWasteItemMaster = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-count-waste-item-master-list?Waste_item=${WasteItem}`);
      const data = await response.data;
      const firstObject = data[0];
      const count_Waste = firstObject.count_waste;
      setDistinctCountWasteItemMaster(count_Waste);
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master prices list');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  const fetchWasteGroupCodeNameList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-waste-group-code-name-list`);
      const data = await response.data;
      setDistinctWasteGroupCodeNameList(data)
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master prices list');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  const fetchMoiItemCodeNameList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-moi-item-code-name-list`);
      const data = await response.data;
      setDistinctMoiItemCodeNamelist(data)
      } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data Master prices list');
      } finally {
        setIsLoading(false); // Set isLoading back to false when fetch is complete
      }
  };

  useEffect(() => {
    fetchWasteMaster();
    fetchWasteGroupCodeNameList();
    fetchMoiItemCodeNameList();
    if (WasteItem) {
      fetchCountWasteItemMaster();      
    }
  }, [WasteItem]);

  const columns = [
    { field: 'waste_item', headerName: 'Waste Code', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'desc_en', headerName: 'Description EN', width: 280 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'desc_th', headerName: 'Description TH', width: 280 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'group_name', headerName: 'Group Name', width: 220 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'unit', headerName: 'Unit', width: 70 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'center'},
    { field: 'moi_item', headerName: 'Moi Code', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'update_by', headerName: 'Update By', width: 120 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
    { field: 'update_date', headerName: 'Update Date', width: 160 , headerAlign: 'center' , headerClassName: 'bold-header' , align: 'left'},
  ]

  return (
    <>
        <Navbar onToggle={handleNavbarToggle}/>
        <Box marginLeft={isNavbarOpen ? "220px" : 4} marginTop={10}>
            <Box sx={{width: '1400px' , height: 600 , marginTop: '15px' , marginLeft: '65px'}}>
                <Button 
                    variant="contained" 
                    className="btn_active hover:scale-110"
                    // size="small"  btn_active hover:scale-110
                    style={{  width: '260px', 
                              height: '50px' , 
                              backgroundColor: '#2B3499' , 
                              color:'white' ,
                              fontWeight: 'bold' , 
                              boxShadow: '5px 5px 5px grey' ,
                              borderRadius: 20 ,
                              border: '1px solid black'
                          }}
                    onClick={handleOpenModalAdd}
                    endIcon={<AddToPhotosIcon />}
                    >ADD WASTE MASTER LIST
                </Button>
                <DataGrid
                  columns={columns}
                  // disableColumnFilter
                  // disableDensitySelector
                  rows={distinctWasteItemList}
                  slots={{ toolbar: GridToolbar }}
                  filterModel={filterModel}
                  onFilterModelChange={(newModel) => setFilterModel(newModel)}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  columnVisibilityModel={columnVisibilityModel}
                  // checkboxSelection
                  onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                  }
                  getRowHeight={() => 40}
                  sx={{
                    '& .MuiDataGrid-row': {
                      backgroundColor: '#F6F5F5',
                    },
                  }}
                />
            </Box>
        </Box>
        <Modal
          open={isModalOpenAdd}
          onClose={handleCloseModalAdd}
          aria-labelledby="key-weight-modal-title"
          aria-describedby="key-weight-modal-description"
        >
          <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600 , height: 530 , bgcolor: '#B4D4FF', boxShadow: 24, p: 4, borderRadius: 5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' , height: 20 , marginBottom: 20}}>
                <div style={{width: '100%' ,fontWeight: 'bold' , fontSize: 20 , textAlign: 'center' }}>
                    <label htmlFor="" >ADD WASTE ITEM MASTER LIST</label>
                </div>
                <div>
                    <IconButton onClick={handleCloseModalAdd} style={{position: 'absolute', top: '10px', right: '10px',}}>
                        <CloseIcon style={{fontSize: '25px', color: 'white', backgroundColor: '#E55604'}} /> 
                    </IconButton>
                </div>
            </div>
            <div style={{ height: 380 , backgroundColor: '#E4FBFF'}}>
              <div >
                <div style={{paddingTop: 20, display: 'flex',}}>
                  <TextField
                    id="outlined-disabled"
                    label="Waste Item Code"
                    value={WasteItem}
                    onChange={handleUWasteItemChange}
                    style={{backgroundColor: 'white' , marginLeft: 20, width:150 }}
                  />
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo-series"
                    options={distinctWasteGroupCodeNameList}
                    getOptionLabel={(option) => option && option.group_code}
                    value={WasteGroup}
                    onChange={handleUWasteGroupChange}
                    sx={{ width: 340 , height: '60px' , backgroundColor: 'white', marginLeft: 1}}
                    renderInput={(params) => <TextField {...params} label="Waste Group Code" />}
                    isOptionEqualToValue={(option, value) =>
                        option && value && option.group_code === value.group_code
                    }
                  />
                </div>

                <div style={{paddingTop: 15}}>
                  <TextField
                    id="outlined-disabled"
                    label="Description EN"
                    value={WasteDescEN}
                    onChange={handleUWasteDescENChange}
                    style={{backgroundColor: 'white' , marginLeft: 20, marginRight: 20 ,width: 500,}}
                  />
                </div>
                <div style={{paddingTop: 15}}>
                  <TextField
                    id="outlined-disabled"
                    label="Description TH"
                    value={WasteDescTH}
                    onChange={handleUWasteDescTHChange}
                    style={{backgroundColor: 'white' , marginLeft: 20, marginRight: 20 ,width: 500,}}
                  />
                </div>

                <div style={{paddingTop: 15, display: 'flex',}}>
                  <TextField
                    id="outlined-disabled"
                    label="Waste Unit"
                    value={WasteUnit}
                    onChange={handleUWasteUnitChange}
                    style={{backgroundColor: 'white' , marginLeft: 20, width: 110 }}
                  />
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo-series"
                    options={distinctMoiItemCodeNamelist}
                    getOptionLabel={(option) => option && option.moi_code}
                    value={MoiWasteItem}
                    onChange={handleUMoiWasteItemChange}
                    sx={{ width: 380 , height: '60px' , backgroundColor: 'white', marginLeft: 1}}
                    renderInput={(params) => <TextField {...params} label="MOI Group Code" />}
                    isOptionEqualToValue={(option, value) =>
                        option && value && option.moi_code === value.moi_code
                    }
                  />
                </div>

                <div style={{paddingTop: 15, display: 'flex',}}>
                  <TextField
                    disabled
                    id="outlined-disabled"
                    label="Update By"
                    value={update_by}
                    style={{backgroundColor: '#EEF5FF' , marginLeft: 20, width: 245 }}
                  />
                  <TextField
                    disabled
                    id="outlined-disabled"
                    label="Update Date"
                    value={update_date}
                    style={{backgroundColor: '#EEF5FF' , marginLeft: 10, width: 245 }}
                  />
                </div>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end' , marginTop: 15 , height: 45 }}>
              <Button variant="contained" startIcon={<CancelIcon />} onClick={handleUCancelAdd} className="btn_hover" style={{backgroundColor: 'lightgray' , color: 'black' , width: 120 , height: 40 , marginRight: 10 , boxShadow: '3px 3px 5px grey', borderRadius: 10}}>
                  Cancel
              </Button> 
              <Button variant="contained" endIcon={<AddToPhotosIcon />} onClick={handleSaveAdd} className="btn_hover" style={{backgroundColor: 'lightgreen' , color: 'black' , width: 120 , height: 40 , boxShadow: '3px 3px 5px grey', borderRadius: 10}}>
                  SAVE
              </Button>
            </div>
          </Box>
        </Modal>

        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle style={{backgroundColor: 'white', color: 'red', fontSize: 22, textAlign:'center', }}><ReportProblemIcon style={{width: 80, height: 80,}}></ReportProblemIcon></DialogTitle>
          <DialogContent style={{backgroundColor: 'white'  , color: 'red'}}>
            <DialogContentText  style={{paddingTop: 20 , color: 'black' , paddingLeft: 0 , fontSize: 20}}>
                {WasteItem} Duplicate data, Please check try again
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{backgroundColor: 'white' , height: 80, textAlign:'center', display: 'flex', justifyContent: 'center',}}>
            <Button onClick={() => { handleCloseDialog()}} style={{width: 80 , backgroundColor: '#478CCF' , borderRadius:5  , color: 'white', marginBottom: 10}}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
    </>
  );
}
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';

function Smart_Scrap_SearchMonitorItem({ onSearch }) {
    const [distinctYears, setDistinctYears] = useState([]);
    const [distinctFactory, setDistinctFactory] = useState([]);
    const [distinctGroup, setDistinctGroup] = useState([]);
    const [distinctItem, setDistinctItem] = useState([]);

    const [selectedFromYear, setSelectedFromYear] = useState(null);
    const [selectedToYear, setSelectedToYear] = useState(null);
    const [selectedFactory, setSelectedFactory] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const [error , setError] = useState(null);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const fetchYears = async () => {
        try {
          const response = await axios.get("http://10.17.100.115:3001/api/smart_scrap/filter-years-monitoring");
          const data  = response.data;

          setDistinctYears(data);
        } catch (error) {
          console.error(`Error fetching distinct data Factory List: ${error}`);
        }
    };

    const fetchFactory = async () => {
        try {
          const response = await axios.get("http://10.17.100.115:3001/api/smart_scrap/factorylistMonitor-item");
          const data  = response.data;

          setDistinctFactory(data);
        } catch (error) {
          console.error(`Error fetching distinct data Factory List: ${error}`);
        }
    };

    const fetchGroup = async () => {
        try {
          const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-group-sold-waste?from_year=${selectedFromYear.year_inv}&to_year=${selectedToYear.year_inv}&factory=${selectedFactory.factory}`);
          const dataGroup  = response.data;
        // const dataGroup = await response.data;
          setDistinctGroup(dataGroup);
        } catch (error) {
          console.error(`Error fetching distinct data Group List: ${error}`);
        }
    };

    const fetchWasteItem = async () => {
        try {
          const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/filter-data-waste-item-sold-waste?from_year=${selectedFromYear.year_inv}&to_year=${selectedToYear.year_inv}&factory=${selectedFactory.factory}&group=${selectedGroup.waste_group_name}`);
          const dataItem  = response.data;
        // const dataItem = await response.data;
          setDistinctItem(dataItem);
          console.log('Item' , distinctItem);
        } catch (error) {
          console.error(`Error fetching distinct data Group List: ${error}`);
        }
    };

    useEffect(() => {
        fetchYears();
        fetchFactory();
        if (selectedFactory) {
            fetchGroup(selectedFactory.factory);
            if (selectedGroup) {
                fetchWasteItem(selectedGroup.group);
            }
        }
      }, [selectedFactory , selectedGroup]);

    const handleFromYearChange = (event, newValue) => {
        // console.log('Selected From Year:', newValue);
        setSelectedFromYear(newValue);
        setSelectedToYear(null);
        setSelectedFactory(null);
        setSelectedGroup(null);
        setSelectedItem(null);
        // console.log('Updated Selected From Year:', selectedFromYear);
    }

    const handleToYearChange = (event,newValue) => {
        setSelectedToYear(newValue);
        setSelectedFactory(null);
        setSelectedGroup(null);
        setSelectedItem(null);
    }

    const handleFactoryChange = (event,newValue) => {
        setSelectedFactory(newValue);
        setSelectedGroup(null);
        setSelectedItem(null);
    }

    const handleGroupChange = (event,newValue) => {
        setSelectedGroup(newValue);
        setSelectedItem(null);
    }

    const handleItemChange = (event,newValue) => {
        setSelectedItem(newValue);
    }

    const handleSearch = () => {
        if (!selectedFromYear || !selectedToYear || !selectedFactory || !selectedGroup) {
            // Handle the case when either selectedFromYear or selectedToYear is null
            return;
        }
    
        const queryParams = {
            fromyear: selectedFromYear.year_inv,
            toyear: selectedToYear.year_inv,
            factory: selectedFactory.factory,
            group: selectedGroup.waste_group_name,
        };
    
        console.log('Query Params:', queryParams);
        onSearch(queryParams);
    };

    return (
        <React.Fragment>
            {/* <div>
                <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#6528F7' , 
                    backgroundColor: '#FAF1E4' , width: '380px' , paddingLeft: '5px' , marginBottom : '20px'}}>
                    Record weight daily transaction</h1>
            </div> */}
            <Box maxWidth="xl" sx={{ width: "100%" , height: 50}}>
                <Grid container spacing={0} style={{width: 1350 }}> 
                
                    <Grid item xs={2} md={2}>
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                options={distinctYears}
                                getOptionLabel={(option) => (option ? String(option.year_inv) : '')}
                                value={selectedFromYear}
                                onChange={handleFromYearChange}
                                sx={{ width: 220, height: '60px', marginTop: '8px' }}
                                renderInput={(params) => <TextField {...params} label="From year" />}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={2} md={2}>
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                options={distinctYears}
                                // getOptionLabel={(option) => option && option.year_inv}
                                getOptionLabel={(option) => (option ? String(option.year_inv) : '')}

                                value={selectedToYear}
                                onChange={handleToYearChange}
                                sx={{ width: 220, height: '60px', marginTop: '8px' , marginLeft: '5px'}}
                                renderInput={(params) => <TextField {...params} label="To year" />}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={2} md={2}>
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                options={distinctFactory}
                                // getOptionLabel={(option) => option && option.year_inv}
                                getOptionLabel={(option) => (option ? String(option.factory) : '')}

                                value={selectedFactory}
                                onChange={handleFactoryChange}
                                sx={{ width: 220, height: '60px', marginTop: '8px' , marginLeft: '5px'}}
                                renderInput={(params) => <TextField {...params} label="Factory" />}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={2} md={2}>
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                options={distinctGroup}
                                // getOptionLabel={(option) => option && option.year_inv}
                                getOptionLabel={(option) => (option ? String(option.waste_group_name) : '')}

                                value={selectedGroup}
                                onChange={handleGroupChange}
                                sx={{ width: 220, height: '60px', marginTop: '8px' , marginLeft: '5px'}}
                                renderInput={(params) => <TextField {...params} label="Group" />}
                            />
                        </div>
                    </Grid>

                    {/* <Grid item xs={2} md={2}>
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                options={distinctItem}
                                // getOptionLabel={(option) => option && option.year_inv}
                                getOptionLabel={(option) => (option ? String(option.waste_item) : '')}

                                value={selectedItem}
                                onChange={handleItemChange}
                                sx={{ width: 220, height: '60px', marginTop: '8px' , marginLeft: '5px'}}
                                renderInput={(params) => <TextField {...params} label="Waste Item" />}
                            />
                        </div>
                    </Grid> */}


                    <Grid  item xs={2} md={2} >
                        <Button 
                            variant="contained" 
                            // size="small"
                            style={{width: '120px', height: '50px' , marginTop: '10px', marginLeft: '10px'}}
                            onClick={handleSearch}
                            endIcon={<SearchIcon />}
                            >Search
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
}

export default Smart_Scrap_SearchMonitorItem
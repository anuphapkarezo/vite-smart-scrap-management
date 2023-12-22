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

function Smart_Scrap_SearchSummaryWeight({ onSearch }) {
    const [error , setError] = useState(null);

    //Set Dropdown List
    const [selectedFactory, setSelectedFactory] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);

    //Set Parameter from API
    const [distinctFactory, setDistinctFactory] = useState([]);
    const [distinctGroup, setDistinctGroup] = useState([]);
    // const [distinctGroup, setDistinctGroup] = useState([{ group: "All" }, ...distinctGroup]);


    const fetchFactory = async () => {
        try {
          const response = await axios.get("http://10.17.100.115:3001/api/smart_scrap/factorylist");
          const dataFactory  = response.data;
          setDistinctFactory(dataFactory);
        } catch (error) {
          console.error(`Error fetching distinct data Factory List: ${error}`);
        }
    };

    const fetchGroup = async (factory) => {
        try {
          const response = await axios.get(`http://10.17.100.115:3001/api/smart_scrap/grouplist?factory=${factory}`);
          const dataGroup  = response.data;
        // const dataGroup = await response.data;
          setDistinctGroup(dataGroup);
        } catch (error) {
          console.error(`Error fetching distinct data Group List: ${error}`);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    //สร้าง Function selection change
    const handleFromDateChange = (newValue) => {
        setSelectedFromDate(newValue);
        // setSelectedFactory(null);
        // setSelectedGroup(null);
    }

    const handleToDateChange = (newValue) => {
        setSelectedToDate(newValue);
        // setSelectedFactory(null);
        // setSelectedGroup(null);
    }

    const handleFactoryChange = (event, newValue) => {
        setSelectedFactory(newValue);
        setSelectedGroup({ group: "All Group" });
        // setSelectedGroup(null);
        setSelectedFromDate(null);
        setSelectedToDate(null);
    }

    const handleGroupChange = (event, newValue) => {
        setSelectedGroup(newValue);
        setSelectedFromDate(null);
        setSelectedToDate(null);
    }

    const handleSearch = () => {
        const formattedFromDate = selectedFromDate ? dayjs(selectedFromDate).format('DD/MM/YYYY') : null;
        const formattedToDate = selectedToDate ? dayjs(selectedToDate).format('DD/MM/YYYY') : null;

        const queryParams = {
            factory: selectedFactory.factory,
            group: selectedGroup.group,
            From_date_take_of: formattedFromDate,
            To_date_take_of: formattedToDate,
        };
        console.log('Query Params:', queryParams);
        onSearch(queryParams);
    };

    // useEffect(() => {
    //     fetchFactory();
    // }, []);

    useEffect(() => {
        fetchFactory();
        if (selectedFactory) {
            fetchGroup(selectedFactory.factory);
        }
    }, [selectedFactory]);

    return (
        <React.Fragment>
            {/* <div>
                <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#6528F7' , 
                    backgroundColor: '#FAF1E4' , width: '380px' , paddingLeft: '5px' , marginBottom : '20px'}}>
                    Record weight daily transaction</h1>
            </div> */}
            <Box maxWidth="xl" sx={{ width: "100%" , height: 50}}>
                <Grid container spacing={0} style={{width: 1350 }}> 
                    <Grid  item xs={2} md={2} >
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                // id="combo-box-demo-series"
                                // size="small"
                                options={distinctFactory}
                                getOptionLabel={(option) => option && option.factory}
                                value={selectedFactory}
                                onChange={handleFactoryChange}
                                sx={{ width: 220 , height: '60px' , marginTop: '8px' }}
                                renderInput={(params) => <TextField {...params} label="Factory" />}
                                isOptionEqualToValue={(option, value) =>
                                    option && value && option.factory === value.factory
                                }
                            />
                        </div>
                    </Grid>
                    <Grid  item xs={2} md={2} >
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                // freeSolo
                                // id="combo-box-demo-product"
                                // size="small"
                                options={distinctGroup}
                                getOptionLabel={(option) => option && option.group}
                                value={selectedGroup}
                                onChange={handleGroupChange}
                                sx={{ width: 250 , height: '60px' , marginTop: '8px' , marginLeft: '15px'}}
                                // renderInput={(params) => <TextField {...params} label="Group" />}
                                renderInput={(params) => <TextField {...params} label="Group" />}
                                isOptionEqualToValue={(option, value) =>
                                    option && value && option.group === value.group
                                }
                            />
                        </div>
                    </Grid>
                    <Grid  item xs={2} md={2} >
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker 
                                        label="From Date take off" 
                                        sx={{ height: '60px' , marginLeft: '90px' }}
                                        value={selectedFromDate}
                                        onChange={(newDate) => handleFromDateChange(newDate)}
                                        renderInput={(params) => <TextField {...params} />}
                                        format="DD/MM/YYYY"
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                    </Grid>

                    <Grid  item xs={2} md={2} >
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker 
                                        label="To Date take off" 
                                        sx={{ height: '60px' , marginLeft: '75px'}}
                                        value={selectedToDate}
                                        onChange={(newDate) => handleToDateChange(newDate)}
                                        renderInput={(params) => <TextField {...params} />}
                                        format="DD/MM/YYYY"
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                    </Grid>
                    <Grid  item xs={2} md={2} >
                        <Button 
                            variant="contained" 
                            // size="small"
                            style={{width: '120px', height: '50px' , marginTop: '10px', marginLeft: '70px' , backgroundColor: '#AEDEFC' , color:'black'}}
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

export default Smart_Scrap_SearchSummaryWeight
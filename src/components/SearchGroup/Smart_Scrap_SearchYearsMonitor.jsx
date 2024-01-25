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

function Smart_Scrap_SearchYearsMonitor({ onSearch }) {
    const [distinctYears, setDistinctYears] = useState([]);

    const [selectedFromYear, setSelectedFromYear] = useState(null);
    const [selectedToYear, setSelectedToYear] = useState(null);

    const [error , setError] = useState(null);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const fetchYears = async () => {
        try {
          const response = await axios.get("http://10.17.100.115:3001/api/smart_scrap/filter-years-monitoring");
          const data  = response.data;
          console.log('API Response:', data);

          setDistinctYears(data);
          console.log('Years' , distinctYears);
        } catch (error) {
          console.error(`Error fetching distinct data Factory List: ${error}`);
        }
    };

    useEffect(() => {
        fetchYears();
      }, []);

    const handleFromYearChange = (event, newValue) => {
        // console.log('Selected From Year:', newValue);
        setSelectedFromYear(newValue);
        setSelectedToYear(null);

        // console.log('Updated Selected From Year:', selectedFromYear);
    }

    const handleToYearChange = (event,newValue) => {
        setSelectedToYear(newValue);
    }

    const handleSearch = () => {
        if (!selectedFromYear || !selectedToYear) {
            // Handle the case when either selectedFromYear or selectedToYear is null
            return;
        }
    
        const queryParams = {
            fromyear: selectedFromYear.year_inv,
            toyear: selectedToYear.year_inv,
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
                                sx={{ width: 220, height: '60px', marginTop: '8px' , marginLeft: '10px'}}
                                renderInput={(params) => <TextField {...params} label="To year" />}
                            />
                        </div>
                    </Grid>


                    <Grid  item xs={2} md={2} >
                        <Button 
                            variant="contained" 
                            // size="small"
                            style={{width: '120px', height: '50px' , marginTop: '10px', marginLeft: '20px'}}
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

export default Smart_Scrap_SearchYearsMonitor
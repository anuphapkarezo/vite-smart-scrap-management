import * as React from "react"; // นำเข้าโมดูลทั้งหมดที่ต้องการจาก React, ให้เราสามารถใช้งานฟีเจอร์ต่างๆ ของ React
import { styled, useTheme } from "@mui/material/styles"; // นำเข้าโมดูล "styled" และ "useTheme" จาก "@mui/material/styles" สำหรับการใช้งาน Styled Components และเข้าถึง Theme จาก Material-UI
import Box from "@mui/material/Box"; // นำเข้า Box จาก "@mui/material/Box" ซึ่งเป็นคอมโพเนนต์ที่ให้ความสะดวกในการจัดการ layout และ spacing
import MuiDrawer from "@mui/material/Drawer"; // นำเข้า Drawer จาก "@mui/material/Drawer" ซึ่งเป็นคอมโพเนนต์ที่เปิดเมนูแบบเลื่อนได้จากข้าง
import MuiAppBar from "@mui/material/AppBar"; // นำเข้า AppBar จาก "@mui/material/AppBar" ซึ่งเป็นคอมโพเนนต์สำหรับส่วนหัวของหน้าเว็บ
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Fuji from "/Fuji.png";
import { Link } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined';

//*mui icon ******************************************************
import ComputerIcon from "@mui/icons-material/Computer";
import CableIcon from "@mui/icons-material/Cable";
import StayPrimaryPortraitIcon from "@mui/icons-material/StayPrimaryPortrait";
import MemoryIcon from "@mui/icons-material/Memory";
import DomainIcon from "@mui/icons-material/Domain";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import AccountMenu from "./AccountMenu";
//*---------------------------------------------------------------
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

// สร้าง mixin สำหรับสไตล์ของ Drawer เมื่อถูกปิด
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Navbar({ onToggle }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
    onToggle(true); // Notify parent component
  };

  const handleDrawerClose = () => {
    setOpen(false);
    onToggle(false); // Notify parent component
  };

  //bind value user from localstorage
  const userString = localStorage.getItem("userToken");
  const userObject = JSON.parse(userString);
  const userName = userObject?.user_name;
  const userSurname = userObject?.user_surname;
  // const userRole = userObject?.role_type;

  const userGuest = localStorage.getItem("guestToken");
  const userGuestObject = JSON.parse(userGuest);
  const userGuestName = userGuestObject?.user_login;
  // const userGuestRole = userGuestObject?.role_type;

  //*Menu name ******************************************************

  const [menuName, setMenuName] = React.useState("Smart Waste Management");
  const [menuIcon, setMenuIcon] = React.useState(
    <img src="/dashboard1.png" alt="" width={30} />
  );

  React.useEffect(() => {
    switch (location.pathname) {
      case "/env_scrap_record_weight_daily_transaction":
        setMenuName("Record weight daily transaction");
        setMenuIcon(<img src="/weight-scale.png" alt="" width={30} />);
        break;
      case "/env_scrap_summary_weight_date_take_off":
        setMenuName("Summary Weight by Date take off");
        setMenuIcon(<img src="/report-summary.png" alt="" width={30} />);
        break;
      case "/env_scrap_detail_weight_by_date":
        setMenuName("Details Weight by Date");
        setMenuIcon(<img src="/calendar.png" alt="" width={30} />);
        break;
      case "/env_scrap_prices_list":
        setMenuName("Master Prices List");
        setMenuIcon(<img src="/price-list.png" alt="" width={30} />);
        break;
      default:
        setMenuName("Smart Waste Management");
        setMenuIcon(<img src="/dashboard1.png" alt="" width={30} />);
    }
  }, [location.pathname]);
  
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* HEADER MUI APPBAR */}

        <AppBar position="fixed" open={open}>
          <Toolbar
            sx={{ display: "flex", justifyContent: "space-between" }} // Add this
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {" "}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  gap: 2
                }}
              >
                {menuIcon}
                {menuName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="p" sx={{ mr: 1, fontWeight: "Bold" }}>
                {userName && userSurname
                  ? `${userName} ${userSurname}`
                  : userGuestName}
              </Typography>

              <AccountMenu />

              {/* If you have other elements, you can continue adding them here */}
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <Link to="/home">
              <img
                src={Fuji}
                alt="คำอธิบายภาพ"
                style={{
                  width: 180, // กำหนดความกว้างของภาพให้เต็มขนาดของพื้นที่ที่รองรับ
                  height: 45, // กำหนดความสูงของภาพให้ปรับแต่งตามอัตราส่วนต้นฉบับ
                }}
              />
            </Link>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />

          {/* //*Menu list ****************************************************** */}

          {/* //Record weight daily transaction */}
          <List open={open}>
            <ListItem
              onClick={() => setMenuName("Record weight daily transaction")}
              disablePadding
              sx={{ display: "block", color: "black" }}
              component={Link}
              to="/env_scrap_record_weight_daily_transaction"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "inherit", // Set initial color
                    "&:hover": {
                      color: "primary.main", // Change color on hover
                    },
                  }}
                >
                  <img src="/weight-scale.png" alt="" width={30} />
                  {/* <ScaleOutlinedIcon />
                   */}
                </ListItemIcon>
                <ListItemText
                  primary="Record Weight (Daily)"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
          
          {/* // Summary weight by Date Take Off*/}
          <List open={open}>
            <ListItem
              onClick={() => setMenuName("Summary Weight by Date take off")}
              disablePadding
              sx={{ display: "block", color: "black" }}
              component={Link}
              to="/env_scrap_summary_weight_date_take_off"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "inherit", // Set initial color
                    "&:hover": {
                      color: "primary.main", // Change color on hover
                    },
                  }}
                >
                  <img src="/report-summary.png" alt="" width={30} />
                  {/* <ScaleOutlinedIcon />
                   */}
                </ListItemIcon>
                <ListItemText
                  primary="Summary Weight"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          {/* // Details weight by Date*/}
          <List open={open}>
            <ListItem
              onClick={() => setMenuName("Details weight by Date")}
              disablePadding
              sx={{ display: "block", color: "black" }}
              component={Link}
              to="/env_scrap_detail_weight_by_date"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "inherit", // Set initial color
                    "&:hover": {
                      color: "primary.main", // Change color on hover
                    },
                  }}
                >
                  <img src="/calendar.png" alt="" width={30} />
                  {/* <ScaleOutlinedIcon />
                   */}
                </ListItemIcon>
                <ListItemText
                  primary="Details Weight"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          {/* // Master Prices List*/}
          <List open={open}>
            <ListItem
              onClick={() => setMenuName("Master Prices List")}
              disablePadding
              sx={{ display: "block", color: "black" }}
              component={Link}
              to="/env_scrap_prices_list"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "inherit", // Set initial color
                    "&:hover": {
                      color: "primary.main", // Change color on hover
                    },
                  }}
                >
                  <img src="/price-list.png" alt="" width={30} />
                  {/* <ScaleOutlinedIcon />
                   */}
                </ListItemIcon>
                <ListItemText
                  primary="Master Prices List"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </>
  );
}

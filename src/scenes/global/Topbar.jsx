import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme.js";
import { InputBase } from "@mui/material";
import { LoginContext } from "../../contexts/Login.js";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from '@mui/icons-material/Logout';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user, setUser } = useContext(LoginContext);

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="flex-end"
      p={2} 
      top={0}
      right={0}
      position="fixed"
    >
      {/* SEARCH BAR */}
      {/*<Box 
        display="flex" 
        backgroundColor={colors.primary[400]} 
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search"></InputBase>
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>*/}
      
      <Box></Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {/*
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        */}
        { 
          user.user_id == undefined && user.isAdmin == undefined ? 
            <></>
          :
            <IconButton
              onClick={(e) => {setUser({})}}
            >
              <LogoutIcon />
            </IconButton>
        }
      </Box>

    </Box>
  )
}

export default Topbar;

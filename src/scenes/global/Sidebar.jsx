import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
//import Link from 'next/link'
import { tokens } from "../../theme.js";

import { LoginContext } from "../../contexts/Login.js";
import { ReloadContext } from "../../contexts/Reload.js";

import "react-pro-sidebar/dist/css/styles.css";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { setReload } = useContext(ReloadContext);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {setSelected(title); setReload(true)}}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const { user } = useContext(LoginContext);

  return !user.isAdmin ? (
    <></>
  ) : (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        width: isCollapsed ? 60 : 300
      }}
    >
    
      <ProSidebar collapsed={isCollapsed}         style={{
          position: 'fixed',
          height: '100%',
        }}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ROTARY
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {user.isAdmin ? (
              <Item 
                title="Ansøgninger"
                to="/admin/apps"
                icon={<ContentPasteIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            ) : (
               <Item 
                title="Ansøgninger"
                to="/app/"
                icon={<ContentPasteIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            )}
            {/*
            <Item 
              title="Afventende ansøgninger"
              to="/admin/log"
              icon={<BookmarksOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  )
}

export default Sidebar;

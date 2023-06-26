import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { LoginContext } from "./contexts/Login.js";
import { ReloadContext } from "./contexts/Reload.js";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import Topbar from "./scenes/global/Topbar.jsx";
import Sidebar from "./scenes/global/Sidebar.jsx";

import Login from "./scenes/login";
import Apps from "./scenes/applications";
import AdminApps from "./scenes/admin/applications";

import './index.css';
import App from './App';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [reload, setReload] = useState(false);

  if ((user.user_id == undefined && user.isAdmin == undefined) && !location.pathname.includes("/login")) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
  <React.StrictMode>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <LoginContext.Provider value={{ user, setUser }}>
          <ReloadContext.Provider value={{ reload, setReload }}>
            <CssBaseline />
            <div className="app">
              { user.user_id == undefined && user.isAdmin == undefined ? <></> : <Sidebar /> }
              <main className="content">
                <Topbar />
                <Routes>
                  <Route path="/login/:id?" element={<Login />} />
                  <Route path="/app/:id?" element={<Apps />} />
                  <Route path="/admin/apps" element={<AdminApps />} />
                </Routes>
              </main>
            </div>
          </ReloadContext.Provider>
          </LoginContext.Provider>
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  </React.StrictMode>
  )
}


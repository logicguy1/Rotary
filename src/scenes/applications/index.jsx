import { Box, Typography, useTheme, TextField, Snackbar, IconButton } from "@mui/material";
import Button, { ButtonProps } from '@mui/material/Button';
import { tokens } from "../../theme";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import CloseIcon from '@mui/icons-material/Close';

import { LoginContext } from "../../contexts/Login.js";
import { ReloadContext } from "../../contexts/Reload.js";

import { application_tmp } from "../../data/mockData.js";
import { getJson, postJson } from "../../data/dataHook.js";

import Header from "../../components/Header";
import QuestioneerInput from "../../components/QuestioneerInput";
import UserInfo from "../../components/UserInfo";
import TextComponent from "../../components/TextComponent";
import { useLocation } from 'react-router-dom';


const Apps = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  let id = -1
  if(urlParams.toString() !== ''){
    id = urlParams.get('id')
  }

  const { user, setUser } = useContext(LoginContext);
  const [ activeApp, setActiveApp ] = useState(-1);
  const [ application, setApplication ] = useState({});
  const [ awnsers, setAwnsers] = useState(null)
  const [ applications, setApplications ] = useState([]);
  const [ flag, setFlag ] = useState("Indsend");

  const [open, setOpen] = useState(false);
  const [ snackbarMsg, setSnackbarMsg ] = useState([]);
  const fromRef = useRef(null)

  const handleClick = () => {
    setOpen(true);
  };
  
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const submitForm = (e, flag, app, user) => {
    e.preventDefault();
    console.log(e, flag);

    if (flag == "Gem") {
      var form = fromRef.current
    } else {
      var form = e.target
    }

    // Isolate the application fields with data in them
    let filtered = app.form.filter((item) => {
      return !["plaintext"].includes(item.type);
    });
    
    let res = filtered.map((item) => {
      return [item.id, form[`inp${item.id}`].value]
    });
    let obj = Object.fromEntries(res);
    console.log(obj);

    // Obj er et objekt hvor keys er id og value er svar, brug når der skal gemmes 

    switch (flag) {
      case "Gem":
        const data = {
          appId: app.id,
          user: user,
          app: obj
        };
        postJson(`/saveApplication?id=${user.server_id}`, data).then((res) => {
          console.log(res);
          setSnackbarMsg("Din ansøgning / tilmælding er blevet gemt.")
          setOpen(true);
        });
        
        break;

      case "Indsend":
        const data2 = {
          appId: app.id,
          user: user,
          app: obj
        };
        postJson(`/submitApplication?id=${user.server_id}`, data2).then((res) => {
          console.log(res);
          setSnackbarMsg("Din ansøgning / tilmælding er blevet indsendt.")
          setOpen(true);
        
          window.location = "www.rotary.dk";
        });

        break;

      default:
        break;
    }
  }


  const { reload, setReload } = useContext(ReloadContext);
  useEffect(() => {
    setActiveApp(-1);
    setReload(false);
  }, [reload])

  useEffect(() => {
    console.log(id)
    if (id != undefined && id != -1) {
      setActiveApp(id);
    }
    console.log(activeApp)
  }, [id]);

  useEffect(() => {
    setApplication(application_tmp);
    console.log("THIS IS THE ACTIVE APP", activeApp);

    if (activeApp != undefined && activeApp != -1) {
      getJson(`/getApplication?id=${activeApp}&d=${Date.now()}`)
      .then(res => {
        console.log(res);
        getJson(`/getUserApplication?id=${user.server_id}&appid=${activeApp}&d=${Date.now()}`)
        .then(appSaved => {
          if (appSaved.status !== "Error") {
            setAwnsers(appSaved);
            console.log("NOTEICE ME", appSaved);
          }
          setApplication(res);
        });
      });
    } else {
      getJson(`/getAllApplications?id=${user.server_id}&d=${Date.now()}`).then(res => {
        console.log(res);
        setApplications(res);
      });
    }
  }, [activeApp])

  return (
    <Box 
      m="40px"
      sx={{ 
        '& .css-8er80j-MuiPaper-root-MuiTableContainer-root': { backgroundColor: colors.primary[800] },
        '& .MuiTableBody-root .MuiTableCell-root': { cursor: 'pointer' }
      }}
    >
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={snackbarMsg}
      action={action}
    />
      {
        activeApp == -1 ?
          <>
            <Header title="ANSØNINGER" subtitle="Alle aktive ansøgninger lige nu" />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell>Start dato</TableCell>
                    <TableCell>Slut dato</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((row) => ( 
                    (new Date(row.start.split(" ")[0]) < new Date() && new Date() < new Date(row.stop.split(" ")[0])) ? (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      onClick={(e) => {setActiveApp(row.id)}}
                    >
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.start.split(" ")[0]}</TableCell>
                      <TableCell>{row.stop.split(" ")[0]}</TableCell>
                    </TableRow>
                  ) : (<></>)
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </> : <Box
              component="form"
              onSubmit={(e) => {submitForm(e, flag, application, user)}}
              ref={fromRef}
            >
            <Header title={application.title} subtitle={application.subtitle} />        
            <TextComponent text={application.desc} />
            <Box mb={5} />
            <UserInfo />
            {application.form !== undefined ? application.form.map(row => {
              return <QuestioneerInput row={row} awnsers={awnsers} appId={application.id} />
            }) : <></>}
            <Button 
              variant="contained" 
              type="submit"
              color="success" 
              size="large" 
              sx={{ mt: 1, ml: 1, width: '16ch'}}
              onClick={(e) => {setFlag("Indsend")}}
            >Indsend</Button>
            <Button 
              variant="contained" 
              size="large" 
              color="info"
              sx={{ mt: 1, ml: 1, width: '16ch'}}
              onClick={(e) => {setFlag("Gem"); submitForm(e, flag, application, user)}}
            >Gem</Button>
          </Box>
      }
    </Box>
  )
}

export default Apps;

import { Box, Typography, useTheme, TextField, IconButton, Modal } from "@mui/material";
import Button, { ButtonProps } from '@mui/material/Button';
import { tokens } from "../../../theme";
import { useContext, useState, useEffect } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

import { LoginContext } from "../../../contexts/Login.js";
import { ReloadContext } from "../../../contexts/Reload.js";

import { application_tmp } from "../../../data/mockData.js";

import Header from "../../../components/Header";
import AdminQuestioneerInput from "../../../components/AdminQuestioneerInput";

import { getJson, postJson } from "../../../data/dataHook.js";

const createNewForm = (user, setActiveApp) => {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${month}/${day}/${year}`;

  const data = {
    title: "Ny ansøgning",
    subtitle: "",
    start: currentDate,
    stop: currentDate,
    desc: "",
    mail: "just@hartoft.dk",
    forms: [
      {
        label: "Dato",
        type: "text",
        required: true
      }
    ],
    token: user.auth
  };

  postJson("/createApplication", data).then(res => {
    setActiveApp(res.appId)
  });
}

const save_changes = (form, setActiveApp) => {
  postJson("/updateApplication", form).then(res => {
    console.log(res);
    setActiveApp(-1);
  });
}

const addQuestion = (application, setApplication) => {
  console.log("ADD QUESTION", application)
  const tmpApp = JSON.parse(JSON.stringify(application));
  tmpApp.form.push({
    "id": parseInt(Math.random()*1000000),
    "type": "text",
    "label": "Nyt Spøgsmål",
    "required": true,
  })
  setApplication(tmpApp);
}

const AdminApps = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { user, setUser } = useContext(LoginContext);
  const [ activeApp, setActiveApp ] = useState(-1);
  const [ application, setApplication ] = useState({});
  const [ applications, setApplications ] = useState([]);
  const [ flag, setFlag ] = useState("Indsend");

  useEffect(() => {
    setApplication(application_tmp);
    if (activeApp != -1 || activeApp == undefined) {
      console.log("Calling active app", activeApp)
      getJson(`/getApplication?id=${activeApp}&d=${Date.now()}`).then(res => {
        console.log(res);

        let date = new Date(res.start);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        res.start = `${month}/${day}/${year}`;

        date = new Date(res.stop);
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        res.stop = `${month}/${day}/${year}`;
        console.log(res);

        setApplication(res);
      });
    } else {
      getJson(`/getAllApplications?d=${Date.now()}`).then(res => {
        console.log(res);
        setApplications(res);
      });
    }
  }, [activeApp])

  const { reload, setReload } = useContext(ReloadContext);
  useEffect(() => {
    setActiveApp(-1);
    setReload(false);
  }, [reload])

  const update = (value) => {
    let updatedValue = {title: value};
    setApplication(application => ({
      ...application,
      ...updatedValue
    }))
  }

  const update_sub = (value) => {
    let updatedValue = {subtitle: value};
    setApplication(application => ({
      ...application,
      ...updatedValue
    }))
  }

  const update_desc = (e) => {
    let updatedValue = {desc: e.target.value};
    setApplication(application => ({
      ...application,
      ...updatedValue
    }))
  }

  const update_email = (e) => {
    let updatedvalue = {mail: e.target.value};
    setApplication(application => ({
      ...application,
      ...updatedvalue
    }))
  }

  const update_start = (day, month, year) => {
    let updatedvalue = {start: `${year}-${month}-${day}`};
    setApplication(application => ({
      ...application,
      ...updatedvalue
    }))
  }

  const update_stop = (day, month, year) => {
    let updatedvalue = {stop: `${year}-${month}-${day}`};
    setApplication(application => ({
      ...application,
      ...updatedvalue
    }))
  }
  // Handle namechange modals
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      m="40px"
      sx={{ 
        '& .css-8er80j-MuiPaper-root-MuiTableContainer-root': { backgroundColor: colors.primary[800] },
        '& .MuiTableBody-root .MuiTableCell-root': { cursor: 'pointer' }
      }}
    >
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
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      onClick={(e) => {setActiveApp(row.id)}}
                    >
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.start.split(" ")[0]}</TableCell>
                      <TableCell>{row.stop.split(" ")[0]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button 
              variant="contained" 
              type="submit"
              size="large" 
              color="info"
              sx={{ mt: 1, width: '16ch'}}
              onClick={e => (createNewForm(user, setActiveApp))}
            >Tilføj ny</Button>
          </> : <Box
              component="form"
            >
            <Box
              flexDirection="row"
              display="flex"
            >
              <Header title={application.title} subtitle={application.subtitle} />        
              <IconButton 
                onClick={handleOpen} 
                sx={{ width: 35, height: 35, ml: 1, mt: "44px" }}
              >
                <CreateOutlinedIcon />
              </IconButton>
            </Box>

            <Box
              flexDirection="row"
              display="flex"
              mb={2}
              pt={2}
              borderTop={`2px solid ${colors.primary[400]}`}
            >
              <TextField
                variant="outlined"
                name="description"
                InputLabelProps={{
                  shrink: true,
                }}
                multiline
                rows={5}
                sx={{ width: 700, mr: 1 }}
                label="Beskrivelse"
                value={application.desc}
                onChange={e => (update_desc(e))}
              />
            </Box>

            <Box
              flexDirection="row"
              display="flex"
              mb={2}
              pt={2}
              borderTop={`2px solid ${colors.primary[400]}`}
            >
              <TextField
                variant="outlined"
                name="emails"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: 700, mr: 1 }}
                label="Emails, seperet af et komma"
                value={application.mail}
                onChange={e => (update_email(e))}
              />
            </Box>

            <Box
              flexDirection="row"
              display="flex"
              mb={2}
              pt={2}
              borderTop={`2px solid ${colors.primary[400]}`}
              gap={2}
            >
              <DatePicker label="Start dato" value={dayjs(application.start)} onChange={e => (update_start(e["$D"], e["$M"]+1, e["$y"]))} />
              <DatePicker label="Slut dato" value={dayjs(application.stop)} onChange={e => (update_stop(e["$D"], e["$M"]+1, e["$y"]))} />
            </Box>

            {application.form.map(row => {
              return <AdminQuestioneerInput row={row} application={application} setApplication={setApplication} />
            })}
            <Button 
              variant="contained" 
              size="large" 
              color="success"
              sx={{ mt: 1, width: '16ch'}}
              onClick={(e) => {save_changes(application, setActiveApp)}}
            >Gem</Button>
            <Button 
              variant="contained" 
              size="large" 
              color="info"
              sx={{ mt: 1, ml: 1, width: '26ch'}}
              onClick={(e) => {addQuestion(application, setApplication)}}
            >Tilføj Spørgsmål</Button>



          <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{
                backgroundColor: colors.primary[400],
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 570,
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}>
                <TextField
                  variant="outlined"
                  name="title"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {update(e.target.value)}}
                  sx={{ width: 500, mr: 1 }}
                  label="Titel"
                  value={application.title}
                />
                <Box mb={3}></Box>
                <TextField
                  variant="outlined"
                  name="subtitle"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {update_sub(e.target.value)}}
                  sx={{ width: 500, mr: 1 }}
                  label="Undertitel"
                  value={application.subtitle}
                />
                  <Button 
                    variant="contained" 
                    type="submit"
                    size="large" 
                    color="info"
                    sx={{ mt: 1, width: '16ch'}}
                    onClick={handleClose}
                  >Luk</Button>
              </Box>
            </Modal>
          </Box>
      }
    </Box>
  )
}

export default AdminApps;

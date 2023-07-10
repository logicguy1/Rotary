import { Box, Typography, useTheme, TextField, IconButton, Modal, Select, MenuItem } from "@mui/material";
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

import CloseIcon from '@mui/icons-material/Close';

import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

import { LoginContext } from "../../../contexts/Login.js";
import { ReloadContext } from "../../../contexts/Reload.js";

import { application_tmp } from "../../../data/mockData.js";

import AlertDialog from '../../../components/ConfirmDialog';
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

const save_changes = (form, setActiveApp, user) => {
  postJson("/updateApplication", { ...form, token: user.auth }).then(res => {
    alert("Gemt");
    // setActiveApp(-1);
  });
}

const addQuestion = (application, setApplication) => {
  const tmpApp = JSON.parse(JSON.stringify(application));
  if (tmpApp.form === undefined) {
    tmpApp.form = [];
  }
  tmpApp.form.push({
    "id": parseInt(Math.random()*1000000),
    "type": "text",
    "label": "",
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
  const [ fonds, setFonds ] = useState([]);
  const [ flag, setFlag ] = useState("Indsend");

  const [confirm, setConfirm] = useState(false)

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mail, setMail] = useState("");
  const [count, setCount] = useState("");

  useEffect(() => {
    if (confirm) {
      deleteApp(application);
      setConfirm(false);
    }
  }, [confirm]);

  useEffect(() => {
    setApplication(application_tmp);
    if (activeApp != -1 || activeApp == undefined) {

      getJson(`/getFonds?d=${Date.now()}`).then(res => {
        setFonds(res)
      })

      getJson(`/getApplication?id=${activeApp}&d=${Date.now()}`).then(res => {

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

        setApplication(res);
        setTitle(res.title);
        setSubTitle(res.subtitle);
        setDesc(res.desc);
        setMail(res.mail);
        setCount(res.count);
      });
    } else {
      getJson(`/getAllApplications?d=${Date.now()}`).then(res => {
        setApplications(res);
      });
    }
  }, [activeApp])

  const { reload, setReload } = useContext(ReloadContext);
  useEffect(() => {
    setActiveApp(-1);
    setReload(false);
  }, [reload])

  const update_app = () => {
    setApplication(prevState => ({
      ...prevState,
      title: title,
      subtitle: subTitle,
      desc: desc,
      mail: mail,
      count: count
    }));
  }

  const update = (value) => {
    setTitle(value);
  }

  const update_sub = (value) => {
    setSubTitle(value);
  }

  const update_desc = (e) => {
    setDesc(e.target.value);
  }

  const update_email = (e) => {
    setMail(e.target.value);
  } 

  const updateCount = (e) => {
    setCount(e.target.value);
  }

  const update_start = (day, month, year) => {
    const formattedDate = `${year}-${month}-${day}`;
    setApplication(prevState => ({
      ...prevState,
      stop: formattedDate
    }));
  }

  const update_stop = (day, month, year) => {
    const formattedDate = `${year}-${month}-${day}`;
    setApplication(prevState => ({
      ...prevState,
      stop: formattedDate
    }));
  }

  const update_fond = (id) => {
    setApplication(prevState => ({
      ...prevState,
      fond_id: id
    }));
  }

  const handleCopy = () => {
    const { location } = window;
    navigator.clipboard.writeText(`https://${location.hostname}/login?id=${application.id}`)
  }

  const duplicate = (app) => {
    const data = {
      id: app.id,
      token: user.auth
    }
    postJson("/duplicateApplication", data).then(res => {
      setActiveApp(res.appId);
    })
  }

  const deleteApp = (app) => {
    const data = {
      id: app.id,
      token: user.auth
    }
    postJson("/deleteApplication", data).then(res => {
      setActiveApp(-1);
    })
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
                    <TableCell>ID</TableCell>
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
                      <TableCell>{row.id}</TableCell>
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
              onClick={() => (createNewForm(user, setActiveApp))}
            >Tilføj ny</Button>
          </> : <Box
              component="form"
            >
            <Box
              flexDirection="row"
              display="flex"
            >
              <Header title={title} subtitle={subTitle} />        
              <IconButton 
                onClick={handleOpen} 
                sx={{ width: 35, height: 35, ml: 1, mt: "44px" }}
              >
                <CreateOutlinedIcon />
              </IconButton>
              <IconButton 
                onClick={handleCopy} 
                sx={{ width: 35, height: 35, ml: 1, mt: "44px" }}
              >
                <ContentCopyOutlinedIcon />
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
                value={desc}
                onChange={e => (update_desc(e))}
                onBlur={e => update_app(e)}
              />
            </Box>

            <Box
              flexDirection="row"
              display="flex"
              mb={2}
              pt={2}
              borderTop={`2px solid ${colors.primary[400]}`}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{
                  width: 700,
                }}
                value={application.fond_id || ''}
                onChange={(e) => update_fond(e.target.value)}
              >
                {fonds.map(item => {
                  return <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                })}
              </Select>
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
                value={mail}
                onChange={e => (update_email(e))}
                onBlur={e => update_app(e)}
              />
            </Box>

            
              <TextField
                variant="outlined"
                name="count"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: 700, mr: 1 }}
                label="Sendte ansøgninger"
                value={count}
                onChange={e => (updateCount(e))}
                onBlur={e => update_app(e)}
              />
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

            {application.form !== undefined ? application.form.map(row => {
              return <AdminQuestioneerInput key={row.id} row={row} application={application} setApplication={setApplication} />
            }) : (<></>)}
            <Button 
              variant="contained" 
              size="large" 
              color="success"
              sx={{ mt: 1, width: '16ch'}}
              onClick={(e) => {save_changes(application, setActiveApp, user)}}
            >Gem</Button>
            <Button 
              variant="contained" 
              size="large" 
              color="info"
              sx={{ mt: 1, ml: 1, width: '26ch'}}
              onClick={(e) => {addQuestion(application, setApplication)}}
            >Tilføj Spørgsmål</Button>
            <Button 
              variant="contained" 
              size="large" 
              color="info"
              sx={{ mt: 1, ml: 1, width: '16ch'}}
              onClick={(e) => {duplicate(application)}}
            >Dupliker</Button>
            <AlertDialog 
              title={"Er du sikker?"} 
              text={"Ansøgningen kan ikke genskabes når den først er slettet"} 
              setConfirm={setConfirm} 
            />

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
                  value={title}
                  onBlur={e => update_app(e)}
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
                  value={subTitle}
                  onBlur={e => update_app(e)}
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

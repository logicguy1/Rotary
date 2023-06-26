
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

import { applications, application_tmp } from "../../../data/mockData.js";

import Header from "../../../components/Header";
import AdminQuestioneerInput from "../../../components/AdminQuestioneerInput";

const submitForm = (e, flag, app) => {
  e.preventDefault();
  console.log(e, flag);
  // TODO: Save output data

  // Isolate the application fields with data in them
  let filtered = app.form.filter((item) => {
    return !["plaintext"].includes(item.type);
  });
  
  let res = filtered.map((item) => {
    return [item.id, e.target[`inp${item.id}`].value]
  });
  let obj = Object.fromEntries(res);
  console.log(obj);

  // Obj er et objekt hvor keys er id og value er svar, brug når der skal gemmes 

  switch (flag) {
    case "Gem":
      
      break;

    case "Indsend":

      break;

    default:
      break;
  }
}


const AdminApps = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { user, setUser } = useContext(LoginContext);
  const [ activeApp, setActiveApp ] = useState(-1);
  const [ application, setApplication ] = useState({});
  const [flag, setFlag] = useState("Indsend");

  useEffect(() => {
    setApplication(application_tmp)
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
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.start}</TableCell>
                      <TableCell>{row.stop}</TableCell>
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
              onClick={(e) => {console.log(e)}}
            >Tilføj ny</Button>
          </> : <Box
              component="form"
              onSubmit={(e) => {submitForm(e, flag, application)}}
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
                defaultValue={application.desc}
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
                defaultValue={application.emails}
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
              <DatePicker label="Start dato" defaultValue={dayjs(application.start)} />
              <DatePicker label="Slut dato" defaultValue={dayjs(application.stop)} />
            </Box>

            {application.form.map(row => {
              return <AdminQuestioneerInput row={row} application={application} setApplication={setApplication} />
            })}
            <Button 
              variant="contained" 
              type="submit"
              size="large" 
              color="success"
              sx={{ mt: 1, width: '16ch'}}
              onClick={(e) => {setFlag("Gem")}}
            >Gem</Button>
            <Button 
              variant="contained" 
              size="large" 
              color="info"
              sx={{ mt: 1, ml: 1, width: '26ch'}}
              onClick={(e) => {setFlag("Gem")}}
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
                  defaultValue={application.title}
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
                  defaultValue={application.subtitle}
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

import { Box, Typography, useTheme, TextField, Modal } from "@mui/material";
import Button, { ButtonProps } from '@mui/material/Button';
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { tokens } from "../../theme";
import { Navigate, useParams } from "react-router-dom";

import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../contexts/Login.js";
import { getJson, postJson } from "../../data/dataHook.js";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Header from "../../components/Header";
import TextComponent from "../../components/TextComponent";

const onSubmitLogin = (e, setUser, isAdmin, setError) => {
  e.preventDefault();

  if (!isAdmin) {
    postJson(`/applicantLogin`, {
        "user_id": e.target.Medlemsnummer.value,
        "name": e.target.Navn.value,
        "distrikt": e.target.Distrikt.value,
        "klub": e.target.Klub.value,
        "email": e.target.Email.value,
        "number": e.target.Telefon.value,
      })
      .then(res => {
        setUser({
          "server_id": res.id,
          "user_id": e.target.Medlemsnummer.value,
          "name": e.target.Navn.value,
          "distrikt": e.target.Distrikt.value,
          "klub": e.target.Klub.value,
          "email": e.target.Email.value,
          "number": e.target.Telefon.value,
          "isAdmin": false
        });
      });
  } else {
    postJson(`/login`, {
        "email": e.target.EmailAdmin.value,
        "password": e.target.AdgangskodeAdmin.value
      })
      .then(res => {
        if (res.status == "Error") {
          setError(res.message);
        } else {
          let token = res.token;
          setUser({
            "email": e.target.EmailAdmin.value,
            "auth": token,
            "isAdmin": true
          });
        }
      });

    // let token = e.target.AdgangskodeAdmin.value
  }
};

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { user, setUser } = useContext(LoginContext);

  const [ title, setTitle ] = useState("Rotary Login")
  const [ subtitle, setSubtitle ] = useState("")
  const [ start, setStart ] = useState(null)
  const [ stop, setStop ] = useState(null)
  const [ modalText, setModalText ] = useState("")

  const [ isAdmin, setIsAdmin ] = useState(false);
  const [ error, setError ] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let { id } = useParams();

  useEffect(() => {
    // TODO: use the id to fetch title and set title using setTitle
    if (id !== -1 && id != undefined) {
      console.log("IT IS NOT UNDEFINED", id)
      getJson(`/getApplication?id=${id}&d=${Date.now()}`)
      .then(res => {
        console.log(res, res.subtitle)
        setTitle(res.title);
        setSubtitle(res.subtitle);
        setStop(res.start);
        setStop(res.stop);
        console.log(Date(res.start))
        // if (true) {
        if (new Date(res.start.split(" ")[0]) > new Date()) {
          setModalText(`<Big>Ansøgning / tilmælding starter den (${res.start.split(' ')[0]})</Big>`);
          setOpen(true);
        } else if (new Date(res.stop.split(" ")[0]) < new Date()) {
          setModalText(`<Big>Ansøngninsfristen var overskrevet den ${res.start.split(' ')[0]}, kontakt evnt Juat Hartoft, mail: just@hartoft.dk</Big>`);
          setOpen(true);
        }
      });
    } else {
      console.log("IT IS UNDEFINED", id)
    }
  }, [id])

  if (user.user_id != undefined) {
    return <Navigate to={id == undefined ? "/app" : `/app/${id}`} replace={true} />;
  } else if (user.isAdmin != undefined) {
    return <Navigate to="/admin/apps" replace={true} />;
  }

  return (
    <Box m="20px">
      <Box 
        className="centered" 
        backgroundColor={colors.primary[400]}
        p={5}
        component="form"
        onSubmit={(e) => {onSubmitLogin(e, setUser, isAdmin, setError)}}
        sx={{
          '& .MuiTextField-root': { m: 1, width: 'calc(50% - 16px)' },
          '& .Mui-focused': { color: colors.grey[200] }
        }}
      >
        { !isAdmin ? (
          <>
          <Box sx={{ ml: 1 }} >
            <Header title={title} subtitle={subtitle} margin={'none'} />        
          </Box>
          <div>
            <TextField id="outlined-basic" required label="Medlemsnummer" name="Medlemsnummer" variant="outlined" inputProps={{
              inputMode: 'numeric', 
              pattern: '[0-9]*', 
            }} />
            <TextField id="outlined-basic" required label="Navn" name="Navn" variant="outlined" />
          </div>
          <div>
            <TextField id="outlined-basic" required label="Distrikt" name="Distrikt" variant="outlined" />
            <TextField id="outlined-basic" required label="Klub" name="Klub" variant="outlined" />
          </div>
          <div>
            <TextField id="outlined-basic" required label="Email" name="Email" variant="outlined" />
            <TextField id="outlined-basic" required label="Telefon nr." name="Telefon" variant="outlined" />
          </div>
          </>
        ) : (
          <>
            <Box sx={{ ml: 1 }} >
            <Header title="Rotary Login" subtitle="" margin={'none'} />        
            </Box>
            <TextField 
              id="outlined-basic" 
              label="Email" 
              name="EmailAdmin" 
              sx={{ width: "72ch !important" }}
              variant="outlined" 
            />
            <div></div> {/* Create a newline */}
            <TextField 
              id="outlined-basic" 
              label="Adgangskode" 
              name="AdgangskodeAdmin" 
              sx={{ width: "72ch !important" }}
              variant="outlined" 
              type="password" 
            />
          </>
        )

        }
        <Typography 
          variant="h6"
          color={colors.redAccent[400]}
          sx={{ ml: 1 }}
        >
          {error}
        </Typography>  
        
        <Box
          flexDirection="row"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button 
            variant="contained" 
            type="submit"
            color="success" 
            size="large" 
            sx={{ mt: 1, ml: 1, width: '16ch'}}
          >LOGIN</Button>
        <Typography 
          variant="span"
          color={theme.palette.mode == "dark" ? colors.primary[300] : colors.primary[700]}
          sx={{ cursor: "pointer", mr: 1, pt: 2 }}
          onClick={(e) => {setIsAdmin(!isAdmin)}}
        >
          {!isAdmin ? "Admin" : "Bruger"} Login
        </Typography>  
        </Box>
        
      </Box>
      <Modal
        open={open}
        onClose={e => {console.log(e)}}
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
          <TextComponent text={modalText} />
        </Box>
      </Modal>
    </Box>
  )
}

export default Login;

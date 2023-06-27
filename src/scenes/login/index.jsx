import { Box, Typography, useTheme, TextField } from "@mui/material";
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
  const [title, setTitle] = useState("Rotary Login")
  const [ isAdmin, setIsAdmin ] = useState(false);
  const [error, setError] = useState("");

  let { id } = useParams();

  useEffect(() => {
    // TODO: use the id to fetch title and set title using setTitle
    if (id !== -1 && id != undefined) {
      console.log("IT IS NOT UNDEFINED", id)
      getJson(`/getApplication?id=${id}`)
      .then(res => {
        console.log(res)
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
          '& .MuiTextField-root': { m: 1, width: '35ch' },
          '& .Mui-focused': { color: colors.grey[200] }
        }}
      >
        <Typography 
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ mb: 1, ml: 1 }}
        >
          {title}
        </Typography>  
        { !isAdmin ? (
          <>
          <div>
            <TextField id="outlined-basic" required label="Medlemsnummer" name="Medlemsnummer" variant="outlined" inputProps={{
              inputMode: 'numeric', 
              pattern: '[0-9]*', 
            }}/>
            <TextField id="outlined-basic" required label="Navn" name="Navn" variant="outlined" />
          </div>
          <div>
            <TextField id="outlined-basic" required label="Distrikt" name="Distrikt" variant="outlined" />
            <TextField id="outlined-basic" required label="Klub" name="Klub" variant="outlined" />
          </div>
          <div>
            <TextField id="outlined-basic" required label="Email" name="Email" variant="outlined" inputProps={{
              inputMode: 'numeric', 
              pattern: '^[^\s@]+@[^\s@]+\.[^\s@]+$', 
            }}/>
            <TextField id="outlined-basic" required label="Telefon nr." name="Telefon" variant="outlined" />
          </div>
          </>
        ) : (
          <>
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
    </Box>
  )
}

export default Login;

import { Typography, Box, useTheme, TextField, MenuItem, Select, Checkbox, FormControlLabel, IconButton, Button } from "@mui/material";
import { tokens } from "../theme.js";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { MuiChipsInput } from 'mui-chips-input'
import { useState, useEffect } from "react";

const AwnserEnd = ({ checkState, rowId, disableCheck, application, setApplication }) => {

  const deleteClick = (rowId) => {
    for (let i = 0; i < application.form.length; i++) {
      if (application.form[i].id === rowId) {

        let tmpApp = { ...application };
        tmpApp.form.splice(i, 1);
        setApplication(tmpApp);
      }
    }
  }
  const updateClick = (rowId) => {
    for (let i = 0; i < application.form.length; i++) {
      if (application.form[i].id === rowId) {

        let tmpApp = { ...application };
        tmpApp.form[i].required = !application.form[i].required;
        setApplication(tmpApp);
      }
    }
  }
  const addNewBelow = () => {
    const updatedForm = [...application.form]; // Create a new copy of the form array

    for (let i = 0; i < application.form.length; i++) {
      if (application.form[i].id === rowId) {
        updatedForm.splice(i+1, 0, { type: "text", label: "", id: Math.floor(Math.random() * 10000), required: false });
        break;
      }
    }
    setApplication({ ...application, form: updatedForm }); // Update the state with the new form array
  }

  return (
    <Box>
      <FormControlLabel
        sx={{ ml: 1, display: "block", "& .css-112ysrj-MuiButtonBase-root-MuiCheckbox-root.Mui-checked": {color: "#b9bbc0"} }}
        control={
          disableCheck ?
            <Checkbox disabled checked={checkState} onChange={(e) => {updateClick(rowId)}} name={`inp${rowId}required`} />
          :
            <Checkbox checked={checkState} onChange={(e) => {updateClick(rowId)}} name={`inp${rowId}required`} />
          
        }
        label="Skal besvares"
      />
      <FormControlLabel
        sx={{ ml: 1, display: "block" }}
        control={
          <IconButton 
            onClick={() => {deleteClick(rowId)}} 
            sx={{ width: 35, height: 35, mr: .2, color: "#b00f09" }}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        }
        label="Slet spøgsmål"
      />
      <Button 
        variant="contained" 
        size="large" 
        color="inherit"
        sx={{ ml: 2, mt: 1, width: '26ch' }}
        onClick={() => (addNewBelow())}
      >Indsæt ny under</Button>
    </Box>
  );
}

const QuestioneerInput = ({ row, application, setApplication }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const type = row.type;
  const [inputValue, setInputValue] = useState(row.label);
  const [updateApplication, setUpdateApplication] = useState(false);

  useEffect(() => {
    for (let i = 0; i < application.form.length; i++) {
      if (application.form[i].id === row.id) {

        let tmpApp = { ...application };
        tmpApp.form[i].label = inputValue;
        setApplication(tmpApp);
      }
    }
    setUpdateApplication(false);
  }, [updateApplication])

  const selectChange = (rowId, value) => {
    for (let i = 0; i < application.form.length; i++) {
      if (application.form[i].id === rowId) {

        let tmpApp = { ...application };
        tmpApp.form[i].type = value;
        setApplication(tmpApp);
      }
    }
  }

  const handleChange = (newChips) => {
    for (let i = 0; i < application.form.length; i++) {
      if (application.form[i].id === row.id) {

        let tmpApp = { ...application };
        tmpApp.form[i].choices = newChips;
        setApplication(tmpApp);
      }
    }
  }

  const updateInput = (e, rowid) => {
    setInputValue(e.target.value);
  }

  switch (type) {
    case "plaintext":
      return (
        <Box
          flexDirection="row"
          display="flex"
          mb={2}
          pt={2}
          borderTop={`2px solid ${colors.primary[400]}`}
        >
          <TextField
            variant="outlined"
            name={`inp${row.id}`}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            rows={2}
            sx={{ width: 299, mr: 1 }}
            placeholder="Nyt spøgsmål"
            value={inputValue}
            onChange={e => (updateInput(e, row.id))}
            onBlur={() => (setUpdateApplication(true))}
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name={`inp${row.id}choice`}
            value="plaintext"
            sx={{
              width: 400,
            }}
            onChange={(e) => selectChange(row.id, e.target.value)}
          >
            <MenuItem value="plaintext">Textafsnit</MenuItem>
            <MenuItem value="text">Kort skrivefelt</MenuItem>
            <MenuItem value="longtext">Langt skrivefelt</MenuItem>
            <MenuItem value="dropdown">Dropdown menu</MenuItem>
          </Select>
          <AwnserEnd checkState={row.required} disableCheck={true} rowId={row.id} application={application} setApplication={setApplication} />
        </Box>
      );
      
    case "text":
      return (
        <Box
          flexDirection="row"
          display="flex"
          mb={2}
          pt={2}
          borderTop={`2px solid ${colors.primary[400]}`}
        >
          <TextField
            variant="outlined"
            name={`inp${row.id}`}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            rows={2}
            sx={{ width: 299, mr: 1 }}
            placeholder="Nyt spøgsmål"
            value={inputValue}
            onChange={e => (updateInput(e, row.id))}
            onBlur={() => (setUpdateApplication(true))}
          />
          

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name={`inp${row.id}choice`}
            value="text"
            sx={{
              width: 400,
            }}
            onChange={(e) => selectChange(row.id, e.target.value)}
          >
            <MenuItem value="plaintext">Textafsnit</MenuItem>
            <MenuItem value="text">Kort skrivefelt</MenuItem>
            <MenuItem value="longtext">Langt skrivefelt</MenuItem>
            <MenuItem value="dropdown">Dropdown menu</MenuItem>
          </Select>
          <AwnserEnd checkState={row.required} disableCheck={false} rowId={row.id} application={application} setApplication={setApplication} />
        </Box>
      );

    case "longtext":
      return (
        <Box
          flexDirection="row"
          display="flex"
          mb={2}
          pt={2}
          borderTop={`2px solid ${colors.primary[400]}`}
        >
          <TextField
            variant="outlined"
            name={`inp${row.id}`}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            rows={2}
            sx={{ width: 299, mr: 1 }}
            placeholder="Nyt spøgsmål"
            value={inputValue}
            onChange={e => (updateInput(e, row.id))}
            onBlur={() => (setUpdateApplication(true))}
          />

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name={`inp${row.id}choice`}
            value="longtext"
            sx={{
              width: 400,
            }}
            onChange={(e) => selectChange(row.id, e.target.value)}
          >
            <MenuItem value="plaintext">Textafsnit</MenuItem>
            <MenuItem value="text">Kort skrivefelt</MenuItem>
            <MenuItem value="longtext">Langt skrivefelt</MenuItem>
            <MenuItem value="dropdown">Dropdown menu</MenuItem>
          </Select>
          <AwnserEnd checkState={row.required} disableCheck={false} rowId={row.id} application={application} setApplication={setApplication} />

        </Box>
      );

    case "dropdown":
      return (
        <>
          <Box
            flexDirection="row"
            display="flex"
            mb={2}
            pt={2}
            borderTop={`2px solid ${colors.primary[400]}`}
            sx={{
              '& .MuiList-root': { backgroundColor: "#f00000" },
            }}
          >
            <TextField
              variant="outlined"
              name={`inp${row.id}`}
              InputLabelProps={{
                shrink: true,
              }}
              multiline
              rows={2}
              sx={{ width: 299, mr: 1 }}
              placeholder="Nyt spøgsmål"
              value={inputValue}
              onChange={e => (updateInput(e, row.id))}
              onBlur={() => (setUpdateApplication(true))}
            />


            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value="dropdown"
              name={`inp${row.id}choice`}
              sx={{
                width: 400,
              }}
              onChange={(e) => selectChange(row.id, e.target.value)}
            >
              <MenuItem value="plaintext">Textafsnit</MenuItem>
              <MenuItem value="text">Kort skrivefelt</MenuItem>
              <MenuItem value="longtext">Langt skrivefelt</MenuItem>
              <MenuItem value="dropdown">Dropdown menu</MenuItem>
            </Select>
            <AwnserEnd checkState={row.required} disableCheck={false} rowId={row.id} application={application} setApplication={setApplication} />
          </Box>
          <Box>
            <MuiChipsInput value={row.choices} onChange={handleChange} sx={{ width: 706, mb: 2 }}/>
          </Box>
        </>
      );

    default:
      return <></>
  }
};

export default QuestioneerInput;

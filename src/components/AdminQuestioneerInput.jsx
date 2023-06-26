import { Typography, Box, useTheme, TextField, MenuItem, Select, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import { tokens } from "../theme.js";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { MuiChipsInput } from 'mui-chips-input'
import { useState } from "react";

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
    </Box>
  );
}

const QuestioneerInput = ({ row, application, setApplication }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const type = row.type;

  const selectChange = (rowId, value) => {
    console.log(rowId, value);
    for (let i = 0; i < application.form.length; i++) {
      if (application.form[i].id === rowId) {

        let tmpApp = { ...application };
        tmpApp.form[i].type = value;
        setApplication(tmpApp);
      }
    }
  }

  const handleChange = (newChips) => {
    console.log(newChips)
    for (let i = 0; i < application.form.length; i++) {
      if (application.form[i].id === row.id) {

        let tmpApp = { ...application };
        tmpApp.form[i].choices = newChips;
        setApplication(tmpApp);
      }
    }
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
            value={row.label}
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
            value={row.label}
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
            value={row.label}
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
              value={row.label}
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

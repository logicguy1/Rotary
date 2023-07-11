import { Typography, Box, useTheme, TextField, MenuItem, Select } from "@mui/material";
import { useRef, useEffect, useState } from 'react';
import { tokens } from "../theme.js";
import TextComponent from "./TextComponent";

const Title = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return !Boolean(parseInt(row.required)) ? (
    <Typography 
      variant="h6"
      color={colors.grey[100]}
      name={`inp${row.id}`}
      fontWeight="bold"
      sx={{ width: 300 }}
    >
      {row.label !== "" ? row.label : " "}
    </Typography>  
  ) : (
    <Box sx={{ width: 300, display: "flex", pr: 2 }}>
      <TextComponent text={row.label !== "" ? row.label : " "} />
      <Typography 
        variant="h4"
        color={colors.redAccent[500]}
        name={`inp${row.id}`}
      >
        *
      </Typography>  
    </Box>
  )
}

const QuestioneerInput = ({ row, awnsers, appId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const type = row.type;
  const textFieldRef = useRef(null);
  const [ dropdown, setDropdown ] = useState("");
  const [value, setValue] = useState("")

  useEffect(() => {
    console.log("AAAAAA", appId, awnsers, row.id)
    if (appId != undefined && awnsers != null && awnsers.app[row.id] !== undefined) {
      // const defaultValue = awnsers[appId].app[row.id];
      if (row.type !== "dropdown") {
        // textFieldRef.current.lastChild.children[0].value = awnsers[appId].app[row.id];
        setValue(awnsers.app[row.id]);
      } else {
        setDropdown(awnsers.app[row.id])
      }
    }   
  }, [awnsers, appId])

  const updateSelect = (e) => {
    setDropdown(e.target.value);
  }
  const updateValue = (e) => {
    setValue(e.target.value);
  }

  switch (type) {
    case "plaintext":
      return (
        <Box
          mb={2}
          pt={2}
          borderTop={`2px solid ${colors.primary[400]}`}
        >
          <TextComponent text={row.label !== "" ? row.label : " "} />
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
          <Title row={row} />
          
          {
            Boolean(parseInt(row.required)) ? (
              <TextField
                required
                variant="outlined"
                name={`inp${row.id}`}
                inputLabelProps={{
                  shrink: true,
                }} sx={{ width: 400 }}
                ref={textFieldRef}
                value={value}
                onChange={(e) => updateValue(e)}
              />
            ) : (
              <TextField
                variant="outlined"
                name={`inp${row.id}`}
                inputLabelProps={{
                  shrink: true,
                }} sx={{ width: 400 }}
                ref={textFieldRef}
                value={value}
                onChange={(e) => updateValue(e)}
              />
            )
          }

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
          <Title row={row} />
{
            Boolean(parseInt(row.required)) ? (
              <TextField
                id="outlined-multiline-static"
                required
                variant="outlined"
                multiline
                rows={4}
                name={`inp${row.id}`}
                inputLabelProps={{
                  shrink: true,
                }} sx={{ width: 400 }}
                ref={textFieldRef}
                value={value}
                onChange={(e) => updateValue(e)}
              />
            ) : (
              <TextField
                id="outlined-multiline-static"
                variant="outlined"
                multiline
                name={`inp${row.id}`}
                rows={4}
                inputLabelProps={{
                  shrink: true,
                }} sx={{ width: 400 }}
                ref={textFieldRef}
                value={value}
                onChange={(e) => updateValue(e)}
              />
            )
          }
        </Box>
      );

    case "dropdown":
      return (
        <Box
          flexDirection="row"
          display="flex"
          mb={2}
          pt={2}
          borderTop={`2px solid ${colors.primary[400]}`}
          sx={{
            '& .muilist-root': { backgroundColor: "#f00000" },
          }}
        >
          <Title row={row} />
{
            Boolean(parseInt(row.required)) ? (
              <Select
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name={`inp${row.id}`}
                sx={{
                  width: 400,
                }}
                value={dropdown}
                onChange={(e) => updateSelect(e)}
              >
                {row.choices.map(item => {
                  return <MenuItem value={item}>{item}</MenuItem>
                })}
              </Select>
            ) : (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name={`inp${row.id}`}
                sx={{
                  width: 400,
                }}
                value={dropdown}
                onChange={(e) => updateSelect(e)}
              >
                {row.choices.map(item => {
                  return <MenuItem value={item}>{item}</MenuItem>
                })}
              </Select>
            )
          }
        </Box>
      );

    default:
      return <></>
  }
};

export default QuestioneerInput;

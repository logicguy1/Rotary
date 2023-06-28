import { Typography, Box, useTheme, TextField, MenuItem, Select } from "@mui/material";
import { useRef, useEffect, useState } from 'react';
import { tokens } from "../theme.js";

const Title = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return !row.required ? (
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
      <Typography 
        variant="h6"
        color={colors.grey[100]}
        name={`inp${row.id}`}
        fontWeight="bold"
        sx={{ mr: 1 }}
      >
        {row.label !== "" ? row.label : " "}
      </Typography>  
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
  const [ dropdown, setDropdown ] = useState(row.type == "dropdown" ? row.choices[0] : "");

  useEffect(() => {
    if (appId != undefined && awnsers != null && awnsers[appId] != undefined && awnsers[appId].app[row.id] !== undefined) {
      const defaultValue = awnsers[appId].app[row.id];
      if (row.type !== "dropdown") {
        textFieldRef.current.lastChild.children[0].value = awnsers[appId].app[row.id];
      } else {
        setDropdown(awnsers[appId].app[row.id])
        //textFieldRef.current.children[1].value = awnsers[appId].app[row.id]
      }
    }   
  }, [awnsers, appId])

  const updateSelect = (e) => {
    setDropdown(e.target.value);
  }

  switch (type) {
    case "plaintext":
      return (
        <Box
          mb={2}
          pt={2}
          borderTop={`2px solid ${colors.primary[400]}`}
        >
          <Typography 
            variant="h6"
            color={colors.grey[100]}
            fontWeight="bold"
          >
            {row.label !== "" ? row.label : " "}
          </Typography>  
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
          
          <TextField
            variant="outlined"
            name={`inp${row.id}`}
            inputLabelProps={{
              shrink: true,
            }}
            sx={{ width: 400 }}
            ref={textFieldRef}
          />

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

          <TextField
            id="outlined-multiline-static"
            multiline
            rows={4}
            name={`inp${row.id}`}
            sx={{ width: 400 }}
            ref={textFieldRef}
          />
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

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name={`inp${row.id}`}
            sx={{
              width: 200,
            }}
            value={dropdown}
            onChange={(e) => updateSelect(e)}
          >
            {row.choices.map(item => {
              return <MenuItem value={item}>{item}</MenuItem>
            })}
          </Select>
        </Box>
      );

    default:
      return <></>
  }
};

export default QuestioneerInput;

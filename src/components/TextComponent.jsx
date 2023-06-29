import { Typography, Box, useTheme, TextField, MenuItem, Select } from "@mui/material";
import { useRef, useEffect, useState } from 'react';
import { tokens } from "../theme.js";

const TextComponenet = ({ text }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const textFieldRef = useRef(null);

  useEffect(() => {
    textFieldRef.current.innerHTML = text
    .replace(/\<Big1\>/g, "<span style='font-size: 15pt'>")
    .replace(/\<Big2\>/g, "<span style='font-size: 20pt'>")
    .replace(/\<Big3\>/g, "<span style='font-size: 25pt'>")
    .replace(/\<Big4\>/g, "<span style='font-size: 30pt'>")
    .replace(/\<\/Big1\>/g, "</span>")
    .replace(/\<\/Big2\>/g, "</span>")
    .replace(/\<\/Big3\>/g, "</span>")
    .replace(/\<\/Big4\>/g, "</span>")
    .replace(/\<ColorRed\>/g, "<span style='color: #d02020'>")
    .replace(/\<\/ColorRed\>/g, "</span>")
    .replace(/\<Bold\>/g, "<span style='font-weight: bold>")
    .replace(/\<\/Bold\>/g, "</span>")

    ;
  }, [text])

  return (
    <Box>
      <Typography
        variant="p"
        color={colors.grey[100]}
        sx={{ width: "100%", mr: 1, whiteSpace: "pre-wrap" }}
        ref={textFieldRef}
      >
      </Typography>  
    </Box>
  )
}

export default TextComponenet;

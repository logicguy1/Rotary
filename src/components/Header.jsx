import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme.js";

const Header = ({ title, subtitle, margin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography 
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: margin !== "none" ? "40px 0 15px 0" : "0 0 15px 0" }}
      >
        {title}
      </Typography>  
      <Typography
        varient="h4"
        sx={{ fontSize: 17 }}
      >{subtitle}</Typography>  
    </Box>
  );
};

export default Header;

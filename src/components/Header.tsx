import { AppBar, Toolbar, IconButton, Typography, Link } from "@mui/material";
import PowerOffIcon from '@mui/icons-material/PowerOff';
import GitHubIcon from '@mui/icons-material/GitHub';


export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <img src="/logo.svg" width={36} />
        </IconButton>
        <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
          Tile38 Viewer
        </Typography>
        <IconButton title="Disconnect"><PowerOffIcon /></IconButton>
        <Link href="https://github.com/Kilowhisky/tile38-viewer" target="_BLANK"><GitHubIcon /></Link>
      </Toolbar>
    </AppBar>
  )
}
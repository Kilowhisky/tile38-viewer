import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import { IconButton, Popover } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

export type ColorHex = `#${string}`;

export function ColorPicker({ color, onChange }: { color: ColorHex, onChange: (color: ColorHex) => unknown }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return <div>
    <IconButton size="small" sx={{ color }} onClick={handleClick}><CircleIcon /></IconButton>
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
      <SketchPicker color={color} onChange={c => onChange(c.hex)} />
    </Popover>
  </div>
}

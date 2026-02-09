import { Button, IconButton, Popover } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { useMemo, useState } from "react"
import { ItemCollection, useMapStore } from "./Map.store"
import ClearIcon from "@mui/icons-material/Clear"
import { ColorHex, ColorPicker } from "./ColorPicker"
import "./MapItemCollectionManager.css"

export function MapItemCollectionManager() {
  const itemCollections = useMapStore(x => x.items)
  const addItemCollection = useMapStore(x => x.addItemCollection)
  const removeItemCollection = useMapStore(x => x.removeItemCollection)
  const collections = useMemo(() => [...itemCollections.values()], [itemCollections])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    if (itemCollections.size) {
      setAnchorEl(event.currentTarget)
    }
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function colorChange(collection: ItemCollection, color: ColorHex) {
    addItemCollection({
      ...collection,
      color,
    })
  }

  return (
    <>
      <Button
        size="small"
        variant="contained"
        sx={{
          color: "text.primary",
          backgroundColor: "background.paper",
          ":hover": {
            color: "text.secondary",
            backgroundColor: "background.paper",
          },
        }}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {itemCollections.size} Collections
      </Button>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {" "}
        {collections.map(collection => (
          <div key={collection.id} className="collection">
            <span className="collection-color">
              <ColorPicker color={collection.color} onChange={c => colorChange(collection, c)} />
            </span>
            <span className="collection-key">{collection.name}</span>
            <span className="collection-delete">
              <IconButton color="error" size="small" title="Remove" onClick={() => removeItemCollection(collection.id)}>
                <ClearIcon />
              </IconButton>
            </span>
          </div>
        ))}
      </Popover>
    </>
  )
}

import { Popup } from "react-leaflet";
import { KeyData } from "./KeyItemList.store";
import { KeyItemView } from "./KeyItemView";
import { usePanelTopStore } from "./PanelTop.store";
import { Link } from "@mui/material";
import './MapPopup.css';

export function MapPopup({ data }: { data: KeyData; }) {
  const addTopPanel = usePanelTopStore(x => x.addPanel);

  function onViewItem() {
    addTopPanel({
      id: data.id,
      label: data.id,
      closable: true,
      component: <KeyItemView item={data} />
    });
  }

  return (
    <Popup>
      <div className="map-popup">
        <div className="kv-row">
          <span className="key">Key</span>
          <span className="value">{data.key}</span>
        </div>
        <div className="kv-row">
          <span className="key">Id</span>
          <span className="value">
            <Link
              component="button"
              underline="hover"
              onClick={() => onViewItem()}
            >{data.id}</Link>
          </span>
        </div>
        {data.fields && Object.keys(data.fields).map(key => (
          <div key={key} className="kv-row">
            <span className="key">{key}</span>
            <span className="value">{data.fields![key]}</span>
          </div>
        ))}
      </div>
    </Popup>
  );
}

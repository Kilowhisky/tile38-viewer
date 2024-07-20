import { Popup } from "react-leaflet";
import { KeyData, useKeyItemStore } from "./KeyItemList.store";
import { KeyItem, KeyItemView } from "./KeyItemView";
import { usePanelTopStore } from "./PanelTop.store";
import { useMemo } from "react";
import { Link } from "@mui/material";
import './MapPopup.css';

interface NameValue { name: string, value: string | number }

export function MapPopup({ data }: { data: KeyData; }) {
  const fields = useKeyItemStore(data.key, x => x.fields);
  const addTopPanel = usePanelTopStore(x => x.addPanel);
  const mappedFields = useMemo<NameValue[]>(() => {
    return fields.reduce((o, k, i) => {
      if (data.fields.length > i) {
        o.push({
          name: k,
          value: data.fields[i]
        })
      }
      return o;
    }, [] as NameValue[]);
  }, [data, fields])

  function onViewItem() {
    const item: KeyItem = {
      key: data.key,
      id: data.id,
      object: data.object,
      fields: fields.reduce((o, k, i) => {
        if (data.fields.length > i) {
          o[k] = data.fields[i];
        }
        return o;
      }, {} as Record<string, string | number>)
    };
    addTopPanel({
      id: data.id,
      label: data.id,
      closable: true,
      component: <KeyItemView item={item} />
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
        {mappedFields.map(kv => (
          <div key={kv.name} className="kv-row">
            <span className="key">{kv.name}</span>
            <span className="value">{kv.value}</span>
          </div>
        ))}
      </div>
    </Popup>
  );
}

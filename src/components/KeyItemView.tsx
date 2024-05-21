import { JSONTree } from "react-json-tree";
import theme from 'react-base16-styling/src/themes/apathy';
import { Geometry } from "geojson";

export interface KeyItem {
  key: string
  id: string
  object: string | Geometry
  fields?: Record<string, string | number>
}

export function KeyItemView({ item }: { item: KeyItem }) {
  return <JSONTree
    data={item}
    hideRoot={true}
    theme={theme}
    shouldExpandNodeInitially={(kp, d, l) => l < 3}
  />
}
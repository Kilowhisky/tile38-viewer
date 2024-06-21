import { JSONTree } from "react-json-tree";
import theme from 'react-base16-styling/src/themes/apathy';
import { Tile38Object } from "../lib/tile38Connection.models";

export interface KeyItem {
  key: string
  id: string
  object: Tile38Object
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
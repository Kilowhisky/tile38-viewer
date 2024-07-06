import { Tile38Object } from "../lib/tile38Connection.models";
import { JsonView } from "./JsonView";

export interface KeyItem {
  key: string
  id: string
  object: Tile38Object
  fields?: Record<string, string | number>
}

export function KeyItemView({ item }: { item: KeyItem }) {
  return <JsonView data={item}  />
}
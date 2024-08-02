import { JsonView } from "./JsonView";
import { KeyData } from "./KeyItemList.store";

export function KeyItemView({ item }: { item: KeyData }) {
  return <JsonView data={item}  />
}

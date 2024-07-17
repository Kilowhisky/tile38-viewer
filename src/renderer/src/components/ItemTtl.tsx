import { useEffect, useState } from "react";
import { TtlResponse } from "../lib/tile38Connection.models";
import { useTile38 } from "../lib/tile38Connection.store";


export function ItemTtl({ itemKey, id }: { itemKey: string, id: string }) {
  const tile38 = useTile38();
  const [ttl, setTtl] = useState<number>(-1);

  useEffect(() => {
    async function load(key: string, id: string) {
      const response = await tile38.connection!.raw<TtlResponse>(`TTL ${key} ${id}`);
      setTtl(response.ttl);
    }
    load(itemKey, id);
  }, [tile38, itemKey, id]);

  if (ttl == -1 || !ttl) {
    return '∞';
  }

  const hours = (ttl / 3600).toFixed();
  const minutes = (ttl % 3600 / 60).toFixed().padStart(2, '0');
  const seconds = (ttl % 60).toFixed().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

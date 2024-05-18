import { useContext, useEffect, useState } from "react";
import { Tile38Context } from "../lib/tile38Connection";
import { TtlResponse } from "../lib/tile38Connection.models";


export function ItemTtl({ itemKey, id }: { itemKey: string, id: string }) {
  const tile38 = useContext(Tile38Context);
  const [ttl, setTtl] = useState<number>(-1);

  useEffect(() => {
    async function load(key: string, id: string) {
      const response = await tile38.raw<TtlResponse>(`TTL ${key} ${id}`);
      setTtl(response.ttl);
    }
    load(itemKey, id);
  }, [tile38, itemKey, id]);

  return <span>{ttl}</span>
}
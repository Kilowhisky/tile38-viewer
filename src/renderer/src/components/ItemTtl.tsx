import { useEffect, useState } from "react";
import { TtlResponse } from "../lib/tile38Connection.models";
import { useTile38 } from "../lib/tile38Connection.store";
import { CircularProgress } from "@mui/material";


export function ItemTtl({ itemKey, id }: { itemKey: string, id: string }) {
  const tile38 = useTile38();
  const [ttl, setTtl] = useState<number>(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load(key: string, id: string) {
      const response = await tile38.connection!.raw<TtlResponse>(`TTL ${key} ${id}`);
      setTtl(response.ttl);
      setLoading(false);
    }
    load(itemKey, id);
  }, [tile38, itemKey, id]);

  if (loading) {
    return <CircularProgress size={"1em"} sx={{ verticalAlign: 'middle' }} />
  }

  if (ttl == -1 || !ttl) {
    return '∞';
  }

  const hours = (ttl / 3600).toFixed();
  const minutes = (ttl % 3600 / 60).toFixed().padStart(2, '0');
  const seconds = (ttl % 60).toFixed().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

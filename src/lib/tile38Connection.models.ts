import { Geometry } from "geojson"

export interface CmdResponse {
  ok: boolean
  err?: string
  elapsed: string
}

export interface PingResponse extends CmdResponse {
  ping: string
}

export interface KeysResponse extends CmdResponse {
  keys: string[]
}

export interface CountResponse extends CmdResponse {
  count: number
}

export interface TtlResponse extends CmdResponse {
  ttl: number
}

export interface KeyStats {
  in_memory_size: number
  num_objects: number
  num_points: number
  num_strings: number
}

export interface PagingResponse {
  count: number
  cursor: number
}

export interface StatsResponse extends CmdResponse {
  stats: Array<KeyStats | null>
}

export interface ScanObject {
  id: string
  fields?: Array<string | number>
  object: string | Geometry
}

export interface ScanObjectResponse extends CmdResponse, PagingResponse  {
  objects: Array<ScanObject>
  fields?: string[]
}
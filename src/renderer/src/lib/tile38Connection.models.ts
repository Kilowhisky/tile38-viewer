import { Feature, FeatureCollection, Geometry } from "geojson"

export type Tile38Object = string | Geometry | FeatureCollection | Feature

export interface CmdResponse {
  command: string
  ok: boolean
  error?: string
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
  object: Tile38Object
}

export function GetFieldsFromScanObject(scanResult: ScanObject): Record<string, string | number> | undefined {
  if (scanResult.fields) {
    return scanResult.fields.reduce((result, key, index) => {
      if (scanResult.fields!.length > index) {
        result[key] = scanResult.fields![index]
      }
      return result
    }, {})
  }
  return undefined;
}

export interface ScanObjectResponse extends CmdResponse, PagingResponse {
  objects: Array<ScanObject>
  fields?: string[]
}

export function IsScanObjectResponse(response: CmdResponse): response is ScanObjectResponse {
  return !!(response as ScanObjectResponse).objects
}

export interface ObjectResponse extends CmdResponse {
  object: Tile38Object
  fields?: Record<string, string | number>
}

export function IsObjectResponse(response: CmdResponse): response is ObjectResponse {
  return !!(response as ObjectResponse).object
}

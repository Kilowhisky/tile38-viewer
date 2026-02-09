import { ConnectionInfo } from "../components/Connection"
import { PingResponse, CmdResponse, CountResponse, StatsResponse, ObjectResponse } from "./tile38Connection.models"

export class Tile38Connection {
  ready = false

  constructor(private _info: ConnectionInfo) {
    if (!_info.address.startsWith("http")) {
      _info.address = `http://${_info.address}`
    }
  }

  async connect(): Promise<boolean> {
    return (this.ready = (await this.raw("SERVER")).ok)
  }

  async ping(): Promise<boolean> {
    const response = await this._makeRequest<PingResponse>("PING")
    return response.ok && response.ping == "pong"
  }

  async raw<TResponse extends CmdResponse = CmdResponse>(command: string): Promise<TResponse> {
    return this._makeRequest<TResponse>(command)
  }

  async keysCount(key: string): Promise<CountResponse> {
    return await this._makeRequest<CountResponse>(`SCAN ${key} MATCH * COUNT`)
  }

  async stats(...keys: string[]): Promise<StatsResponse> {
    return await this._makeRequest<StatsResponse>(`STATS ${keys.join(" ")}`)
  }

  async get(key: string, id: string, type: "OBJECT" | "POINT" | "BOUNDS"): Promise<ObjectResponse> {
    return await this._makeRequest<ObjectResponse>(`GET ${key} ${id} ${type}`)
  }

  private async _makeRequest<RType extends CmdResponse>(command: string): Promise<RType> {
    try {
      const request: Request = new Request(this._info.address, {
        method: "POST",
        body: command,
        headers: {
          "Content-Type": "text/plain",
        },
      })
      if (this._info.password) {
        request.headers.set("Authorization", this._info.password)
      }

      const response = await fetch(request)
      const result = await response.text()
      if (response.ok) {
        return {
          command,
          ...JSON.parse(result),
        }
      }
      throw new Error(`Bad result returned from Til38: ${result}`)
    } catch (err) {
      return {
        command,
        ok: false,
        elapsed: "0µs",
        error: err,
      } as RType
    }
  }
}

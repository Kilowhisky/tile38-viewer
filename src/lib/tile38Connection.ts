import { createContext } from "react";
import { ConnectionInfo } from "../components/Connection";

export class Tile38Connection {
  ready = false;

  constructor(private _info: ConnectionInfo) {
    if (!_info.address.startsWith("http")) {
      _info.address = `http://${_info.address}`;
    }
  }

  async connect(): Promise<boolean> {
    return this.ready = await this.ping();
  }

  async ping(): Promise<boolean> {
    const response = await this._makeRequest<PingResponse>("PING");
    return response.ok && response.ping == "pong";
  }

  async raw(command: string): Promise<CmdResponse> {
    return this._makeRequest(command);
  }

  async keysCount(key: string): Promise<CountResponse> { 
    return await this._makeRequest<CountResponse>(`SCAN ${key} MATCH * COUNT`)
  }

  async stats(...keys: string[]): Promise<StatsResponse> {
    return await this._makeRequest<StatsResponse>(`STATS ${keys.join(' ')}`)
  }

  private async _makeRequest<RType extends CmdResponse>(command: string): Promise<RType> {
    const request: Request = new Request(this._info.address, {
      method: 'POST',
      body: command,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
    if (this._info.password) {
      request.headers.set("Authorization", this._info.password);
    }

    const response = await fetch(request);
    const result = await response.text();
    if (!response.ok) {
      console.error('Tile38 sent bad response', result);
      return {
        ok: false,
        elapsed: "0µs",
        err: `Tile38 sent bad response: ${result}`
      } as RType
    }

    return JSON.parse(result);
  }
}
export const Tile38Context = createContext<Tile38Connection>(new Tile38Connection({
  id: 'fake',
  address: ''
}));

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

export interface KeyStats {
  in_memory_size: number
  num_objects: number
  num_points: number
  num_strings: number
}

export interface StatsResponse extends CmdResponse {
  stats: Array<KeyStats | null>
}
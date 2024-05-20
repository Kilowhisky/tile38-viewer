import { ConnectionInfo } from "../components/Connection";
import { PingResponse, CmdResponse, CountResponse, StatsResponse } from "./tile38Connection.models";

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

  async raw<TResponse extends CmdResponse = CmdResponse>(command: string): Promise<TResponse> {
    return this._makeRequest<TResponse>(command);
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

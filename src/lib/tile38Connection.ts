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
    const response = await this._makeRequest("PING") as PingResponse;
    return response.ok && response.ping == "pong";
  }

  private async _makeRequest(command: string): Promise<Response> {
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
      }
    }

    return JSON.parse(result);
  }
}

export interface Response {
  ok: boolean
  err?: string
  elapsed: string
}

export interface PingResponse extends Response {
  ping: string
}
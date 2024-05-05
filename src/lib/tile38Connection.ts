import { ConnectionInfo } from "../components/Connection";



export class Tile38Connection {
  private _conn: WebSocket | undefined;

  private get _ready() {
    return this._conn?.readyState == WebSocket.OPEN
  }

  constructor(private _info: ConnectionInfo) { }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this._conn = new WebSocket(this._info.address);
        this._conn.onmessage = this._handleMessage;
        this._conn.onopen = () => {
          if (this._info.password) {
            this._conn?.send(`AUTH ${this._info.password}`)
          }
          this._conn?.send(`SERVER`);
          resolve();
        };
        this._conn.onerror = (e) => {
          console.error(this._conn, e);
          reject();
        }

      } catch (e) {
        console.error(e);
        reject();
      }
    });
  }

  _handleMessage(me: MessageEvent) {
    console.log(me);
  }
}
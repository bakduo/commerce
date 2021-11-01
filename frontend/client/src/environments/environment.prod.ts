import { SocketIoConfig } from "ngx-socket-io";

export const environment = {
  production: true,
  backend: 'http://localhost:3000'
};

export const configSocket: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

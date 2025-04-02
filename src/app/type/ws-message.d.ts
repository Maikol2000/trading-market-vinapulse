export interface WSMessage {
  op?: string;
  arg?: Arg;
  data?: any[];
}

interface Arg {
  channel: string;
  instId: string;
}

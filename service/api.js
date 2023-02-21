import base from './base';

export default class api extends base {
  // 发送消息
  static sendMessage(data) {
    const url = `/conversation`;
    return this.post(url, data);
  }
}

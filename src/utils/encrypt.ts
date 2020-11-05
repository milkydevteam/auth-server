export default class Encryption {
  static a0 = 1;
  static a21 = 3;
  static k1 =
    "0123456789zxcvbnmasdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP=-";
  static k2 = "314838954267";
  static flag = "_";
  public initial(_msg: string) {
    const addIndex = Number.parseInt(
      _msg.substring(_msg.length - 1, _msg.length)
    );
    const msg =
      _msg.substring(0, addIndex) +
      Encryption.k2.substring(addIndex, addIndex + 2) +
      _msg.substring(addIndex, _msg.length);
    return msg;
  }

  public encryptedObjectData(_data: any) {
    if (!_data) throw new Error("data encrypted is undefined");
    const dataString = JSON.stringify(_data);
    let tokenNumber = "";
    for (const charCode of dataString) {
      const code = charCode.charCodeAt(0);
      if (code >= 100) {
        tokenNumber += `${Encryption.flag}${code}`;
      } else {
        tokenNumber += code;
      }
    }
    const token = this.encrypted(tokenNumber);
    return token;
  }

  public encrypted(_msg: string) {
    const msg = this.initial(_msg);

    let index = 0;
    let token = "";
    let soDu = 0;
    let soDuA1 = 0;
    while (index < msg.length) {
      const keyChar = msg.substring(index, index + 1);
      if (keyChar === Encryption.flag) {
        token += keyChar;
        index++;
        continue;
      }
      const xi = Number.parseInt(keyChar);
      const tmpi = soDu + Encryption.a0 + Encryption.a21 + xi * 4;
      soDu = Math.floor(tmpi / 8);
      const p2 = tmpi % 8;
      let p1 = 0;
      if (index === 0) {
        p1 = 0;
        soDuA1 = soDu;
      } else {
        p1 = soDu;
      }
      token += Encryption.k1.substring(p1 * 8 + p2, p1 * 8 + p2 + 1);
      ++index;
    }
    token += Encryption.k1.substring(soDuA1 * 8 + 1, soDuA1 * 8 + 1 + 1);
    return token;
  }
}

/*
public encryptedWithRefCode(...args: string[]) {
    let token = "";
    for (const item of args) {
      let numberToken = "";
      if (!/^[0-9]+$/gi.test(item)) {
        for (const charCode of item) {
          const code = charCode.charCodeAt(0);
          if (code >= 100) {
            numberToken += `${Encryption.flag}${code}`;
          } else {
            numberToken += code;
          }
        }
      } else {
        numberToken = item;
      }
      const encryptedToken = this.encrypted(numberToken);
      token = token ? `${token}.${encryptedToken}` : encryptedToken;
    }
    return token;
  }
*/

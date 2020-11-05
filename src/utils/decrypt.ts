import Encryption from "./encrypt";

export default class Decryption {
  public static decrypted(token: string) {
    if (!token) throw new Error("token must not null");
    let index = 0;
    let tmpPan = "";
    if (token.substring(0, 1) === Encryption.flag) {
      index++;
      tmpPan += Encryption.flag;
    }
    const i0 = Encryption.k1.indexOf(token.substring(index, index + 1));
    const lastIndex = Encryption.k1.indexOf(
      token.substring(token.length - 1, token.length)
    );
    const a0 = Encryption.a0;
    const a21 = Encryption.a21;
    let soDu = Math.floor(lastIndex / 8);
    tmpPan += "" + Math.abs(Math.floor(((i0 % 8) + soDu * 8 - a0 - a21) / 4));

    ++index;
    while (index < token.length - 1) {
      const keyChar = token.substring(index, index + 1);
      if (keyChar !== Encryption.flag) {
        const ai = Encryption.k1.indexOf(token.substring(index, index + 1));
        const xi = Math.floor((ai - soDu - a0 - a21) / 4);
        soDu = Math.floor(ai / 8);
        tmpPan += "" + xi;
      } else {
        tmpPan += keyChar;
      }
      ++index;
    }
    const addIndex = Number.parseInt(
      tmpPan.substring(tmpPan.length - 1, tmpPan.length)
    );
    const pan =
      tmpPan.substring(0, addIndex) +
      tmpPan.substring(addIndex + 2, tmpPan.length);
    return pan;
  }
  public static decryptedTokenToObject(_token: string) {
    let dataString = "";
    let i = 0;
    const token = Decryption.decrypted(_token);
    while (i < token.length) {
      const count = token[i] === "_" ? 4 : 2;
      let currentChar = "";
      if (count === 4) {
        currentChar = token.substring(i+1, i + 4);
        // currentChar = tmpChar.substring(1, 4);
      } else {
        currentChar = token.substring(i, i + 2);
      }

      const numberOfString = Number.parseInt(currentChar);
      const charOfNumber = String.fromCharCode(numberOfString);
      dataString += charOfNumber;
      i += count;
    }

    try {
      return JSON.parse(dataString);
    } catch (error) {
      return null;
    }
  }
}

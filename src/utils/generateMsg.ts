export const generateHSMMessage = ({so_tham_chieu, pan,expire_date,service_code}: {so_tham_chieu: string, pan: string, expire_date: string, service_code: number}) => {
    const CVV_A_KEY = 'D9CDB44E5E7ED637';
    const CVV_B_KEY = '8D0DA9BB882BD590';
    let ascii = `${so_tham_chieu}CW${CVV_A_KEY}${CVV_B_KEY}${pan};${expire_date}${service_code}`;
    ascii = `${String.fromCharCode(ascii.length)}${ascii}`.toUpperCase();
    let hexMsg = '';
    for(let i = 0; i < ascii.length; i++) {
        hexMsg += Number(ascii.charCodeAt(i)).toString(16).toLocaleUpperCase();
    }
    hexMsg = `00${hexMsg}`;
    return hexMsg;
}

const getPanTemplate = (pan: string) => {
  const template = 'xxxxxxxx xxxxxxxx xxx';
  let str = '';
  let count = 0;
  for(let i = 0; i < template.length; i++) {
    if(template[i] === 'x') {
        str += pan[count++];
        if(count === pan.length) break;
    } else {
        str += template[i];
    }
  }
  return str;
}

const getPan = () => {
    const product_code = '970436';
    const BIN = '68';
    return '9704368612912983166';
}
const fillStringToStack = (txt: string, stack_length: number) => {
    let str = `${txt.toLocaleUpperCase()}`;
    for(let i =0; i < stack_length - txt.length; i++) {
        str = `${str} `;
    }
    return str;
}

const getTrack1DD = () => {
    return '688000000000000000000';
}

const getTrack2DD = () => {
    return '6880000000';
}

const getCVV = () => {
    return '730';
}
export const generateEmbossing = () => {
    const institute_id = '000001'; // vcb => other = 000002 3 4
    
    const pan = getPan();
    const emb_char = 'D'; // the tu
    const start_time = '11/19';
    const expire_time = '12/24';
    const name = 'VU MANH CHIEN';
    const service_code = '101';
    const CVV = getCVV();
    
    const reseverExpireTime = `${expire_time.split('/')[0]}${expire_time.split('/')[1]}`;
    const physical_card_define = `${institute_id}\\${getPanTemplate(pan)}${emb_char}    ${start_time}     ${expire_time} |      )                           #${fillStringToStack(name, 27)}%${pan} 000       `;
    const track1_define = `"%B${pan}^${fillStringToStack(name, 26)}^${reseverExpireTime}${service_code}${getTrack1DD()}?`;
    const track2_define = `;${pan}=${reseverExpireTime}${service_code}${getTrack2DD()}?`; // length = 78
    const track3_define = fillStringToStack('', 90);
    const str = physical_card_define + track1_define + track2_define + track3_define + CVV;
    return str;
}
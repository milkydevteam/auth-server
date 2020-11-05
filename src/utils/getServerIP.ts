import * as os from "os";


function getServerIP(encrypted = false) {
    const nets = os.networkInterfaces();
    const t = Object.values(nets).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), []);
    return t[0];
}
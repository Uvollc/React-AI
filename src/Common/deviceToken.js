import axios from 'axios';
import { ClientJS } from 'clientjs';

const client = new ClientJS();
const fingerprint = client.getFingerprint();
let ip;

const getIP = async () => {
  const res = await axios.get('https://api.ipify.org/?format=json');
  ip = res.data.ip;
}
const ipAddress = ip;
getIP();

export { fingerprint as deviceToken };
export { ipAddress as ip };
import { ClientJS } from 'clientjs';
import { Cookies, useCookies } from 'react-cookie';

// const [cookies, setCookies] = useCookies();
// console.log('coookiesss', cookies['deviceToken']);
const cookies = new Cookies();
const deviceToken = cookies.cookies.deviceToken;
// console.log('line 7', cookies.cookies.deviceToken);
// const client = new ClientJS();
// const fingerprint = client.getFingerprint();

export { deviceToken as deviceToken };
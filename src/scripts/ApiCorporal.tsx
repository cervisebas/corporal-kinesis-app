import { encode } from "base-64";
import AccountSystem from "./ApiCorporal/accounts";
import TrainingSystem from "./ApiCorporal/training";

const host: string = 'http://192.168.1.34/CorporalKinesisApi';
//const host: string = 'https://api.corporalkinesis.com.ar';
const keyAccess: string = encode('pFQVXt&yC%aa8e-^&cY4FRtXm&s87$6%3+6D+REGK4bQNLeY');

const Account = new AccountSystem(host, keyAccess);
const Training = new TrainingSystem(host, keyAccess);

const HostServer = host;
export {
    HostServer,
    Account,
    Training
};
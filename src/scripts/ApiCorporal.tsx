import { encode } from "base-64";
import AccountSystem from "./ApiCorporal/accounts";
import TrainingSystem from "./ApiCorporal/training";

const HostServer: string = 'http://192.168.1.36/CorporalKinesisApi';
//const host: string = 'https://api.corporalkinesis.com.ar';
const keyAccess: string = encode('pFQVXt&yC%aa8e-^&cY4FRtXm&s87$6%3+6D+REGK4bQNLeY');

const Account = new AccountSystem(HostServer, keyAccess);
const Training = new TrainingSystem(HostServer, keyAccess);

export {
    HostServer,
    Account,
    Training
};
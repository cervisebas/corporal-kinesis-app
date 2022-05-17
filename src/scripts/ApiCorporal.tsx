import { encode } from "base-64";
import AccountSystem from "./ApiCorporal/accounts";
import CommentSystem from "./ApiCorporal/comments";
import { ExerciseSystem } from "./ApiCorporal/exercises";
import PermissionSystem from "./ApiCorporal/permissions";
import TrainingSystem from "./ApiCorporal/training";
import SystemChangeLog from "./ChangeLog";

//const HostServer: string = 'http://192.168.1.37/CorporalKinesisApi';
const HostServer: string = 'https://api.corporalkinesis.com.ar';
const keyAccess: string = encode('pFQVXt&yC%aa8e-^&cY4FRtXm&s87$6%3+6D+REGK4bQNLeY');

const Account = new AccountSystem(HostServer, keyAccess);
const Training = new TrainingSystem(HostServer, keyAccess);
const Permission = new PermissionSystem(HostServer, keyAccess);
const Comment = new CommentSystem(HostServer, keyAccess);
const Exercise = new ExerciseSystem(HostServer, keyAccess);
const ChangeLogSystem = new SystemChangeLog();

export {
    HostServer,
    Account,
    Training,
    Permission,
    Comment,
    Exercise,
    ChangeLogSystem
};
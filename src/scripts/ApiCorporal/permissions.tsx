import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode } from "base-64";
import QueryString from "qs";
import { getPermission, storageData } from "./types";

export default class PermissionSystem {
    private urlBase: string = '';
    private header_access: { headers: { Authorization: string } } = { headers: { Authorization: '' } };
    constructor(setUrl: string, setHeaderAccess: string) {
        this.urlBase = setUrl;
        this.header_access.headers.Authorization = setHeaderAccess;
    }
    get(): Promise<string> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                axios.post(`${this.urlBase}/index.php`, QueryString.stringify({ getPermission: true, email: datas.email, password: datas.password }), this.header_access).then((html)=>{
                    try {
                        var result: getPermission = html.data;
                        if (result.ok) {
                            var permission: any = result.permission;
                            resolve(permission);
                        } else {
                            reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                        }
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>{
                    reject({ cause: 'Error de conexión.', error });
                });
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
}
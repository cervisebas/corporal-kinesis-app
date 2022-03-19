import { encode, decode } from "base-64";
import { openAccount, storageData, tipical } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import qs from "qs";

export default class AccountSystem {
    private urlBase: string = '';
    private header_access: { headers: { Authorization: string } } = { headers: { Authorization: '' } };
    constructor(setUrl: string, setHeaderAccess: string) {
        this.urlBase = setUrl;
        this.header_access.headers.Authorization = setHeaderAccess;
    }
    create(name: string, email: string, password: string, birthday: string, dni: string, phone: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            try {
                var data = { createAccount: true, name: encode(name), email: encode(email), password: encode(password), birthday: encode(birthday), dni: encode(dni), phone: encode(phone) };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(data), this.header_access).then((result)=>{
                    var data: tipical = result.data;
                    if (data.ok) resolve(true); else reject({ cause: data.cause, error: data.ok });
                }).catch((error)=>reject({ cause: 'Error de conexión.', error }));
            } catch (error) {
                reject({ cause: 'Ocurrió un error inesperadamente.', error });
            }
        });
    }
    open(email: string, password: string): Promise<storageData> {
        return new Promise(async(resolve, reject)=>{
            try {
                var data = { openAccount: true, email: encode(email), password: encode(password) };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(data), this.header_access).then((result)=>{
                    var data: openAccount = result.data;
                    if (data.ok) {
                        AsyncStorage.setItem('account_session', encode(JSON.stringify(data.datas)), (error)=>{
                            if (error) return reject({ cause: 'Hubo un error al almacenar los datos de sesión.', error });
                            var datas: any = data.datas;
                            resolve(datas);
                        });
                    } else {
                        reject({ cause: data.cause, error: data.ok });
                    }
                }).catch((error)=>{
                    console.log(error);
                    reject({ cause: 'Error de conexión.', error });
                });
            } catch (error) {
                reject({ cause: 'Ocurrió un error inesperadamente.', error });
            }
        });
    }
    verify(): Promise<storageData | boolean> {
        return new Promise(async(resolve, reject)=>{
            try {
                AsyncStorage.getItem('account_session').then((value)=>{
                    if (!value) return resolve(false);
                    var datas: storageData = JSON.parse(decode(String(value)));
                    this.open(decode(datas.email), decode(datas.password)).then((value)=>resolve(value)).catch((error)=>reject(error));
                }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
            } catch (error) {
                reject({ cause: 'Ocurrió un error inesperadamente.', error });
            }
        });
    }
}
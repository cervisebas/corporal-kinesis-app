import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode, encode } from "base-64";
import moment from "moment";
import QueryString from "qs";
import { commentsData, getCommentsAll, storageData, tipical } from "./types";

export default class CommentSystem {
    private urlBase: string = '';
    private header_access: { headers: { Authorization: string } } = { headers: { Authorization: '' } };
    constructor(setUrl: string, setHeaderAccess: string) {
        this.urlBase = setUrl;
        this.header_access.headers.Authorization = setHeaderAccess;
    }
    getAll(): Promise<commentsData[]> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', action: 1, error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                axios.post(`${this.urlBase}/index.php`, QueryString.stringify({ getAllComments: true, email: datas.email, password: datas.password }), this.header_access).then((html)=>{
                    try {
                        var result: getCommentsAll = html.data;
                        if (result.ok) {
                            var res: any = result.data;
                            resolve(res);
                        } else {
                            reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                        }
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>reject({ cause: 'Error de conexión.', error }));
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
    admin_create(idAccount: string, comment: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', action: 1, error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                var dataPost = { setNewComment: true, email: datas.email, password: datas.password, idAccount, comment, date: encode(moment(new Date()).format('DD/MM/YYYY HH:mm[hs]')) };
                axios.post(`${this.urlBase}/index.php`, QueryString.stringify(dataPost), this.header_access).then((html)=>{
                    try {
                        var result: tipical = html.data;
                        if (result.ok) resolve(true); else reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>reject({ cause: 'Error de conexión.', error }));
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
}
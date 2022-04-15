import { decode, encode } from "base-64";
import axios from "axios";
import qs from 'qs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DetailsTrainings, statisticData, storageData, tipical, trainingData, trainings, trainingsData } from "./types";

export default class TrainingSystem {
    private urlBase: string = '';
    private header_access: { headers: { Authorization: string } } = { headers: { Authorization: '' } };
    constructor(setUrl: string, setHeaderAccess: string) {
        this.urlBase = setUrl;
        this.header_access.headers.Authorization = setHeaderAccess;
    }
    create(idUser: string, date: string, rds: string, rpe: string, pulse: string, repetitions: string, kilage: string, tonnage: string): Promise<tipical> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                var datas: storageData = JSON.parse(decode(String(value)));
                var dataPost = {
                    setTraining: true,
                    email: datas.email,
                    password: datas.password,
                    idUser,
                    date: encode(date),
                    rds: encode(rds),
                    rpe: encode(rpe),
                    pulse: encode(pulse),
                    repetitions: encode(repetitions),
                    kilage: encode(kilage),
                    tonnage: encode(tonnage)
                };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(dataPost), this.header_access).then((html)=>{
                    try {
                        var result: tipical = html.data;
                        if (result.ok) resolve(result); else reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>reject({ cause: 'Error de conexión.', error }));
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
    getActual(): Promise<DetailsTrainings> {
        return new Promise(async(resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{;
                var datas: storageData = JSON.parse(decode(String(value)));
                axios.post(`${this.urlBase}/index.php`, qs.stringify({ getAllTraining: true, email: datas.email, password: datas.password }), this.header_access).then((value)=>{
                    try {
                        var datas: trainingData = value.data;
                        if (datas.ok) {
                            var trainings: any = datas.trainings;
                            var results: DetailsTrainings = {
                                date: { value: decode(trainings[trainings.length - 1].date), status: -1 },
                                session_number: { value: decode(trainings[trainings.length - 1].session_number), status: -1 },
                                rds: { value: decode(trainings[trainings.length - 1].rds), status: this.calculate('RDS', parseFloat(decode(trainings[trainings.length - 2].rds)), parseFloat(decode(trainings[trainings.length - 1].rds))) },
                                rpe: { value: decode(trainings[trainings.length - 1].rpe), status: this.calculate('RPE', parseFloat(decode(trainings[trainings.length - 2].rpe)), parseFloat(decode(trainings[trainings.length - 1].rpe))) },
                                pulse: { value: decode(trainings[trainings.length - 1].pulse), status: this.calculate('Pulso', parseFloat(decode(trainings[trainings.length - 2].pulse)), parseFloat(decode(trainings[trainings.length - 1].pulse))) },
                                repetitions: { value: decode(trainings[trainings.length - 1].repetitions), status: this.calculate('RDS', parseFloat(decode(trainings[trainings.length - 2].repetitions)), parseFloat(decode(trainings[trainings.length - 1].repetitions))) },
                                kilage: { value: decode(trainings[trainings.length - 1].kilage), status: this.calculate('Kilaje', parseFloat(decode(trainings[trainings.length - 2].kilage)), parseFloat(decode(trainings[trainings.length - 1].kilage))) },
                                tonnage: { value: decode(trainings[trainings.length - 1].tonnage), status: this.calculate('Tonelaje', parseFloat(decode(trainings[trainings.length - 2].tonnage)), parseFloat(decode(trainings[trainings.length - 1].tonnage))) },
                            };
                            return resolve(results);
                        } else {
                            return reject({ cause: datas.cause, error: datas.ok });
                        }
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>reject({ cause: 'Error de conexión.', error }));
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
    getAllOne(get: number): Promise<statisticData> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{;
                var datas: storageData = JSON.parse(decode(String(value)));
                axios.post(`${this.urlBase}/index.php`, qs.stringify({ getAllTraining: true, email: datas.email, password: datas.password }), this.header_access).then((value)=>{
                    try {
                        var datas: trainingsData = value.data;
                        if (datas.ok) {
                            var labels: string[] = [];
                            var values: number[] = [];
                            var singles: { label: string; value: string; }[] = [];
                            datas.trainings?.forEach((element)=>{
                                let label: string = decode(element.date);
                                let value: string = decode((get == 1)? element.date: (get == 2)? element.session_number: (get == 3)? element.rds: (get == 4)? element.rpe: (get == 5)? element.pulse: (get == 6)? element.repetitions: (get == 7)? element.kilage: element.tonnage);
                                let medite: string = (get == 1)? '': (get == 2)? '': (get == 3)? '': (get == 4)? '': (get == 5)? 'PPM': (get == 6)? '': (get == 7)? 'kg': 't';
                                labels.push(label.replace('/2022', '').replace('/2023', '').replace('/2024', ''));
                                values.push(parseFloat(value));
                                singles.push({ label: label, value: value+medite });
                            });
                            return resolve({ separate: { labels: labels, values: values }, singles: singles });
                        } else {
                            return reject({ cause: datas.cause, error: datas.ok });
                        }
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>reject({ cause: 'Error de conexión.', error }));
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
    calculate(name: string, past: number | undefined, actual: number | undefined) {
        if (name == 'RPE') {
            return (past)? (actual)? (past == actual)? 3: (actual < past)? 2: 1: 0: 0;
        }
        return (past)? (actual)? (past == actual)? 3: (actual > past)? 1: 2: 0: 0;
    }
}
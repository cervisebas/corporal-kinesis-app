import { decode, encode } from "base-64";
import axios from "axios";
import qs from 'qs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { commentsData, dataExercise, DetailsTrainings, statisticData, storageData, tipical, trainingData, trainings, trainingsData } from "./types";
import CommentSystem from "./comments";

const parseOrUndefinded = (number: string | undefined)=>(number !== undefined)? parseFloat(decode(number)): undefined;

export default class TrainingSystem {
    private urlBase: string = '';
    private header_access: { headers: { Authorization: string } } = { headers: { Authorization: '' } };
    constructor(setUrl: string, setHeaderAccess: string) {
        this.urlBase = setUrl;
        this.header_access.headers.Authorization = setHeaderAccess;
    }
    create(idUser: string, idExercise: string, date: string, rds: string, rpe: string, pulse: string, repetitions: string, kilage: string, tonnage: string): Promise<string> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                var datas: storageData = JSON.parse(decode(String(value)));
                var dataPost = {
                    setTraining: true,
                    email: datas.email,
                    password: datas.password,
                    idUser,
                    idExercise,
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
                        if (result.ok) resolve(result.datas); else reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>reject({ cause: 'Error de conexión.', error }));
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
    getActual(): Promise<DetailsTrainings> {
        return new Promise(async(resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                var datas: storageData = JSON.parse(decode(String(value)));
                axios.post(`${this.urlBase}/index.php`, qs.stringify({ getAllTraining: true, email: datas.email, password: datas.password }), this.header_access).then((value)=>{
                    try {
                        var datas: trainingData = value.data;
                        if (datas.ok) {
                            var trainings: any = datas.trainings;
                            if (trainings.length == 0) {
                                var results: DetailsTrainings = { id: '-1', date: { value: 'Sin datos', status: -1, difference: undefined }, session_number: { value: 'Sin datos', status: -1, difference: undefined }, rds: { value: 'Sin datos', status: -1, difference: undefined }, rpe: { value: 'Sin datos', status: -1, difference: undefined }, pulse: { value: 'Sin datos', status: -1, difference: undefined }, repetitions: { value: 'Sin datos', status: -1, difference: undefined }, kilage: { value: 'Sin datos', status: -1, difference: undefined }, tonnage: { value: 'Sin datos', status: -1, difference: undefined }, exercise: { name: 'No se encontro', description: '', status: -1 } };
                                return resolve(results);
                            }
                            if (trainings.length == 1) {
                                var results: DetailsTrainings = {
                                    id: trainings[trainings.length - 1].id,
                                    date: { value: decode(trainings[trainings.length - 1].date), status: -1, difference: -9999999999 },
                                    session_number: { value: decode(trainings[trainings.length - 1].session_number), status: -1, difference: -9999999999 },
                                    rds: { value: decode(trainings[trainings.length - 1].rds), status: 0, difference: -9999999999 },
                                    rpe: { value: decode(trainings[trainings.length - 1].rpe), status: 0, difference: -9999999999 },
                                    pulse: { value: decode(trainings[trainings.length - 1].pulse), status: 0, difference: -9999999999 },
                                    repetitions: { value: decode(trainings[trainings.length - 1].repetitions), status: 0, difference: -9999999999 },
                                    kilage: { value: decode(trainings[trainings.length - 1].kilage), status: 0, difference: -9999999999 },
                                    tonnage: { value: decode(trainings[trainings.length - 1].tonnage), status: 0, difference: -9999999999 },
                                    exercise: { name: decode(trainings[trainings.length - 1].exercise.name), status: 0, description: decode(trainings[trainings.length - 1].exercise.description) },
                                };
                                return resolve(results);
                            }
                            var results: DetailsTrainings = {
                                id: trainings[trainings.length -1].id,
                                date: { value: decode(trainings[trainings.length - 1].date), status: -1, difference: undefined },
                                session_number: { value: decode(trainings[trainings.length - 1].session_number), status: -1, difference: undefined },
                                rds: { value: decode(trainings[trainings.length - 1].rds), status: this.calculate('RDS', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].rds), parseFloat(decode(trainings[trainings.length - 1].rds))), difference: this.calculate2('RDS', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].rds), parseFloat(decode(trainings[trainings.length - 1].rds))) },
                                rpe: { value: decode(trainings[trainings.length - 1].rpe), status: this.calculate('RPE', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].rpe), parseFloat(decode(trainings[trainings.length - 1].rpe))), difference: this.calculate2('RPE', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].rpe), parseFloat(decode(trainings[trainings.length - 1].rpe))) },
                                pulse: { value: decode(trainings[trainings.length - 1].pulse), status: this.calculate('Pulso', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].pulse), parseFloat(decode(trainings[trainings.length - 1].pulse))), difference: this.calculate2('Pulso', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].pulse), parseFloat(decode(trainings[trainings.length - 1].pulse))) },
                                repetitions: { value: decode(trainings[trainings.length - 1].repetitions), status: this.calculate('RDS', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].repetitions), parseFloat(decode(trainings[trainings.length - 1].repetitions))), difference: this.calculate2('RDS', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].repetitions), parseFloat(decode(trainings[trainings.length - 1].repetitions))) },
                                kilage: { value: decode(trainings[trainings.length - 1].kilage), status: this.calculate('Kilaje', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].kilage), parseFloat(decode(trainings[trainings.length - 1].kilage))), difference: this.calculate2('Kilaje', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].kilage), parseFloat(decode(trainings[trainings.length - 1].kilage))) },
                                tonnage: { value: decode(trainings[trainings.length - 1].tonnage), status: this.calculate('Tonelaje', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].tonnage), parseFloat(decode(trainings[trainings.length - 1].tonnage))), difference: this.calculate2('Tonelaje', parseOrUndefinded((trainings[trainings.length - 2])&&trainings[trainings.length - 2].tonnage), parseFloat(decode(trainings[trainings.length - 1].tonnage))) },
                                exercise: { name: decode(trainings[trainings.length - 1].exercise.name), status: 0, description: decode(trainings[trainings.length - 1].exercise.description) },
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
            AsyncStorage.getItem('account_session').then((value)=>{
                var datas: storageData = JSON.parse(decode(String(value)));
                axios.post(`${this.urlBase}/index.php`, qs.stringify({ getAllTraining: true, email: datas.email, password: datas.password }), this.header_access).then((value)=>{
                    try {
                        var datas: trainingsData = value.data;
                        if (datas.ok) {
                            var labels: string[] = [];
                            var values: number[] = [];
                            var singles: { label: string; value: string; }[] = [];
                            var exercises: dataExercise[] = [];
                            datas.trainings?.forEach((element)=>{
                                let label: string = decode(element.date);
                                let value: string = decode((get == 1)? element.date: (get == 2)? element.session_number: (get == 3)? element.rds: (get == 4)? element.rpe: (get == 5)? element.pulse: (get == 6)? element.repetitions: (get == 7)? element.kilage: element.tonnage);
                                let medite: string = (get == 1)? '': (get == 2)? '': (get == 3)? '': (get == 4)? '': (get == 5)? 'PPM': (get == 6)? '': (get == 7)? 'kg': 't';
                                labels.push(label.replace('/2022', '').replace('/2023', '').replace('/2024', ''));
                                values.push(parseFloat(value));
                                singles.push({ label: label, value: value+medite });
                                exercises.push(element.exercise);
                            });
                            return resolve({ separate: { labels: labels, values: values }, singles: singles, exercises: exercises });
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
    admin_getEspecificTraining(idTraining: string, idAccount: string): Promise<{ t: DetailsTrainings, c: commentsData | undefined }> {
        return new Promise(async(resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                var datas: storageData = JSON.parse(decode(String(value)));
                axios.post(`${this.urlBase}/index.php`, qs.stringify({ adminGetAllTrainigs: true, email: datas.email, password: datas.password, idAccount }), this.header_access).then((value)=>{
                    try {
                        const Comment = new CommentSystem(this.urlBase, this.header_access.headers.Authorization);
                        var resultTraining: any = undefined;
                        var datas: trainingsData = value.data;
                        if (datas.ok) {
                            var trainings: any = datas.trainings;
                            if (trainings.length == 1) {
                                resultTraining = {
                                    id: trainings[trainings.length - 1].id,
                                    date: { value: decode(trainings[trainings.length - 1].date), status: -1, difference: -9999999999 },
                                    session_number: { value: decode(trainings[trainings.length - 1].session_number), status: -1, difference: -9999999999 },
                                    rds: { value: decode(trainings[trainings.length - 1].rds), status: 0, difference: -9999999999 },
                                    rpe: { value: decode(trainings[trainings.length - 1].rpe), status: 0, difference: -9999999999 },
                                    pulse: { value: decode(trainings[trainings.length - 1].pulse), status: 0, difference: -9999999999 },
                                    repetitions: { value: decode(trainings[trainings.length - 1].repetitions), status: 0, difference: -9999999999 },
                                    kilage: { value: decode(trainings[trainings.length - 1].kilage), status: 0, difference: -9999999999 },
                                    tonnage: { value: decode(trainings[trainings.length - 1].tonnage), status: 0, difference: -9999999999 },
                                    exercise: { name: decode(trainings[trainings.length - 1].exercise.name), status: 0, description: decode(trainings[trainings.length - 1].exercise.description) },
                                };
                            } else {
                                var searchLocation: any = (datas.trainings)&&datas.trainings.findIndex((value)=>value.id == idTraining);
                                resultTraining = {
                                    id: trainings[trainings.length -1].id,
                                    date: { value: decode(trainings[searchLocation].date), status: -1, difference: undefined },
                                    session_number: { value: decode(trainings[searchLocation].session_number), status: -1, difference: undefined },
                                    rds: { value: decode(trainings[searchLocation].rds), status: this.calculate('RDS', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].rds), parseFloat(decode(trainings[searchLocation].rds))), difference: this.calculate2('RDS', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].rds), parseFloat(decode(trainings[searchLocation].rds))) },
                                    rpe: { value: decode(trainings[searchLocation].rpe), status: this.calculate('RPE', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].rpe), parseFloat(decode(trainings[searchLocation].rpe))), difference: this.calculate2('RPE', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].rpe), parseFloat(decode(trainings[searchLocation].rpe))) },
                                    pulse: { value: decode(trainings[searchLocation].pulse), status: this.calculate('Pulso', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].pulse), parseFloat(decode(trainings[searchLocation].pulse))), difference: this.calculate2('Pulso', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].pulse), parseFloat(decode(trainings[searchLocation].pulse))) },
                                    repetitions: { value: decode(trainings[searchLocation].repetitions), status: this.calculate('RDS', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].repetitions), parseFloat(decode(trainings[searchLocation].repetitions))), difference: this.calculate2('RDS', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].repetitions), parseFloat(decode(trainings[searchLocation].repetitions))) },
                                    kilage: { value: decode(trainings[searchLocation].kilage), status: this.calculate('Kilaje', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].kilage), parseFloat(decode(trainings[searchLocation].kilage))), difference: this.calculate2('Kilaje', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].kilage), parseFloat(decode(trainings[searchLocation].kilage))) },
                                    tonnage: { value: decode(trainings[searchLocation].tonnage), status: this.calculate('Tonelaje', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].tonnage), parseFloat(decode(trainings[searchLocation].tonnage))), difference: this.calculate2('Tonelaje', parseOrUndefinded((trainings[searchLocation - 1])&&trainings[searchLocation - 1].tonnage), parseFloat(decode(trainings[searchLocation].tonnage))) },
                                    exercise: { name: decode(trainings[searchLocation].exercise.name), status: 0, description: decode(trainings[searchLocation].exercise.description) },
                                };
                            }
                            Comment.admin_getAllAccount(idAccount)
                                .then((comments)=>{
                                    var searchData = comments.find((comment)=>comment.id_training == idTraining);
                                    return resolve({ t: resultTraining, c: searchData });
                                })
                                .catch((error)=>reject({ cause: 'Error de conexión.', error }));
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
    admin_getAllAccount(idAccount: string): Promise<trainings[]> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', action: 1, error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                var dataPost = { adminGetAllTrainigs: true, email: datas.email, password: datas.password, idAccount };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(dataPost), this.header_access).then((html)=>{
                    try {
                        var result: trainingData = html.data;
                        if (result.ok) {
                            var res: any = result.trainings;
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

    admin_delete(idTraining: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', action: 1, error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                var dataPost = { adminDeleteTraining: true, email: datas.email, password: datas.password, idTraining };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(dataPost), this.header_access).then((html)=>{
                    try {
                        var result: tipical = html.data;
                        return (result.ok)? resolve(true): reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>reject({ cause: 'Error de conexión.', error }));
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }

    calculate(name: string, past: number | undefined, actual: number | undefined) {
        if (name == 'RPE') return (past !== undefined)? (actual !== undefined)? (past == actual)? 3: (actual < past)? 2: 1: 0: 0;
        return (past !== undefined)? (actual !== undefined)? (past == actual)? 3: (actual > past)? 1: 2: 0: 0;
    }
    calculate2(name: string, past: number | undefined, actual: number | undefined): number {
        if (name == 'RPE') return (past !== undefined)? (actual !== undefined)? (past == actual)? -9999999999: (actual < past)? -(past - actual): (actual - past): 0: 0;
        return (past !== undefined)? (actual !== undefined)? (past == actual)? -9999999999: (actual > past)? -(past - actual): (actual - past): 0: 0;
    }
}
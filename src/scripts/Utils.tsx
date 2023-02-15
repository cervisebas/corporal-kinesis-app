import moment from "moment";

export function calcYears(date: string): string {
    let dateNow = new Date();
    let processDate = moment(date, 'DD-MM-YYYY').toDate();
    let years = dateNow.getFullYear() - processDate.getFullYear();
    let months = dateNow.getMonth() - processDate.getMonth();
    if (months < 0 || (months === 0 && dateNow.getDate() < processDate.getDate())) years--;
    return String(years);
}
export function getForPercentScale(maxWidth: number, width: number, height: number, percent: number): { height: number; width: number; } {
    const perWidth = Math.fround((percent * maxWidth)/100);
    const _widthScale = perWidth/width;
    const _height = Math.fround(height * _widthScale);
    return({
        width: perWidth,
        height: _height
    });
}
import { useContext, useEffect, useState } from "react";
import { DataContext, ThemeStatus } from "../GlobalComponents/DataProvider";
import { waitTo } from "./Utils";

export default function statusEffect(status: (ThemeStatus | undefined)[], dependencie: boolean, statusClose?: (ThemeStatus | undefined)[], delay?: number) {
    const { setThemeStatus, themeStatus, theme } = useContext(DataContext);
    const [actual, setActual] = useState<ThemeStatus[]>([]);

    function open() {
        // Guardar thema actual.
        setActual(themeStatus);
        // Calcular los estilos.
        let part1: ThemeStatus = (status[0])? status[0]: { color: theme.colors.background, style: (theme.dark)? 'light': 'dark' };
        let part2: ThemeStatus = (status[1])? status[1]: { color: theme.colors.background, style: (theme.dark)? 'light': 'dark' };
        // Set status
        setThemeStatus([part1, part2]);
    }

    // Restaurar tema guardado.
    async function close() {
        if (delay) await waitTo(delay);
        setThemeStatus(statusClose??actual);
    }

    useEffect(()=>{
        if (dependencie) open(); else close();
    }, [dependencie]);
}
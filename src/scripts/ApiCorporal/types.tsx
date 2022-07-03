type tipical = {
    ok?: boolean;
    cause?: string;
    datas?: any;
};
type openAccount = {
    ok?: boolean;
    cause?: string;
    datas?: {
        name: string;
        email: string;
        password: string;
        image: string;
    }
};
type storageData = {
    name: string;
    email: string;
    password: string;
    image: string;
};
type trainingData = {
    ok?: boolean;
    cause?: string;
    trainings?: trainings
};
type trainingsData = {
    ok?: boolean;
    cause?: string;
    trainings?: trainings[]
};
type trainings = {
    id: string;
    date: string;
    session_number: string;
    rds: string;
    rpe: string;
    pulse: string;
    repetitions: string;
    kilage: string;
    tonnage: string;
    exercise: {
        id: string;
        name: string;
        description: string;
    }
};
type details = {
    value: string;
    status: number;
    difference?: number;
};
type DetailsTrainings = {
    id: string;
    date: details;
    session_number: details;
    rds: details;
    rpe: details;
    pulse: details;
    repetitions: details;
    kilage: details;
    tonnage: details;
    exercise: {
        status: number;
        name: string;
        description: string;
    }
};
type statisticData = {
    separate: {
        labels: string[];
        values: number[];
    },
    singles: {
        label: string;
        value: string;
    }[],
    exercises: dataExercise[];
};
type statisticData2 = {
    exercise: string;
    separate: { labels: string[]; values: number[]; };
    singles: { label: string; value: string; id: string; }[];
};
type listUsers = {
    ok?: boolean;
    cause?: string;
    data?: dataListUsers[]
};
type dataListUsers = {
    id: string;
    name: string;
    experience: string;
    email: string;
    image: string;
    permission: string;
};
type getUserData = {
    ok?: boolean;
    cause?: string;
    data?: userData[];
};
type userData = {
    id: string;
    name: string;
    email: string;
    birthday: string;
    dni: string;
    phone: string;
    experience: string;
    image: string;
    type: string;
    num_trainings: string;
};

type commentsData = {
    id: string;
    id_training: string;
    id_issuer: string;
    comment: string;
    date: string;
    edit: boolean;
    accountData: {
        name: string;
        image: string;
        birthday: string;
    };
};
type getCommentsAll = {
    ok?: boolean;
    cause?: string;
    data?: commentsData[]
};
type getPermission = {
    ok?: boolean;
    cause?: string;
    permission?: string;
};
type permissionItem = {
    id: string;
    idUser: string;
    idDeclare: string;
    permission: string;
    accountData: {
        name: string;
        image: string;
        birthday: string;
    };
};
type getAllPermissions = {
    ok?: boolean;
    cause?: string;
    permissions?: permissionItem[];
};
type dataExercise = {
    id: string;
    name: string;
    description: string;
};
type getAllExercises = {
    ok?: boolean;
    cause?: string;
    data?: dataExercise[];
};

type infoAccount = {
    id: string;
    name: string;
    email: string;
    birthday: string;
    dni: string;
    phone: string;
    experience: string;
    image: string;
    type: string; 
};
type getInfoAccount = {
    ok?: boolean;
    cause?: string;
    data?: infoAccount
};

type TypeOptions = {
    viewAdmins1: boolean;
    viewDev: boolean;
    viewAdmins2: boolean;
    activeFilters: boolean;
};

export type {
    tipical,
    openAccount,
    storageData,
    trainingData,
    trainingsData,
    trainings,
    statisticData,
    DetailsTrainings,
    listUsers,
    dataListUsers,
    getUserData,
    userData,
    commentsData,
    getCommentsAll,
    getPermission,
    permissionItem,
    getAllPermissions,
    dataExercise,
    getAllExercises,
    details,
    statisticData2,
    infoAccount,
    getInfoAccount,
    TypeOptions
};
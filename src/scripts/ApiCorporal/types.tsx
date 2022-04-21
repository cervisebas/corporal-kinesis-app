type tipical = {
    ok?: boolean;
    cause?: string;
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
    trainings?: {
        date: string;
        session_number: string;
        rds: string;
        rpe: string;
        pulse: string;
        repetitions: string;
        kilage: string;
        tonnage: string;
    }
};
type trainingsData = {
    ok?: boolean;
    cause?: string;
    trainings?: {
        date: string;
        session_number: string;
        rds: string;
        rpe: string;
        pulse: string;
        repetitions: string;
        kilage: string;
        tonnage: string;
    }[]
};
type trainings = {
    date: string;
    session_number: string;
    rds: string;
    rpe: string;
    pulse: string;
    repetitions: string;
    kilage: string;
    tonnage: string;
};
type DetailsTrainings = {
    date: {
        value: string;
        status: number;
    };
    session_number: {
        value: string;
        status: number;
    };
    rds: {
        value: string;
        status: number;
    };
    rpe: {
        value: string;
        status: number;
    };
    pulse: {
        value: string;
        status: number;
    };
    repetitions: {
        value: string;
        status: number;
    };
    kilage: {
        value: string;
        status: number;
    };
    tonnage: {
        value: string;
        status: number;
    };
};
type statisticData = {
    separate: {
        labels: string[];
        values: number[];
    },
    singles: {
        label: string;
        value: string;
    }[]
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
};

type commentsData = {
    id: string;
    id_training: string;
    id_issuer: string;
    comment: string;
    date: string;
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
    getAllPermissions
};
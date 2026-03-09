import axios from "axios";

const getAll = async (url: string, headers: any = {}) => {
    return await axios.get(url, headers).then((res: any) => {
        return res.data
    });
};

const postAll = async (url: string, data: any, headers: any = {}) => {
    return await axios.post(url, data, { headers });
};

const getId = async (url: string) => {
    return await axios.get(url).then((res: any) => {
        return res.data;
    });
};

const updateAll = async (url: string, id: number | string, data: any, headers: any = {}) => {
    return await axios.put(`${url}/${id}`, data, { headers });
};

const putNotParams = async (url: string, data: any, headers: any = {}) => {
    return await axios.put(`${url}`, data, { headers });
};

const deleteOne = async (url: string, id: number | string) => {
    return await axios.delete(`${url}/${id}`);
};

/** Fisher-Yates shuffle - retorna una copia aleatoria del arreglo */
const shuffleArray = <T>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export { getAll, postAll, getId, updateAll, putNotParams, deleteOne, shuffleArray };

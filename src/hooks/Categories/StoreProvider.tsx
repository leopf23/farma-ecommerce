import { createContext, useContext, useReducer } from 'react';
const StoreContextCategories = createContext<any | null>(null);
import { TypesCategories } from './CategoriesTypes';

function StoreReducerCategories(state: any, action: any){
    const { type, payload } = action;
    switch (type) {
        case TypesCategories.GET_CATEGORIES:
            return {
                ...state,
                categories: payload.categories
            };
        default:
            return state;
    }
}

const inicialState : any = {
    categories: [],
}


export default function StoreProviderCategories({ children } : any) {

    const [ store, dispatch ] = useReducer(StoreReducerCategories, inicialState);

    return (
        <StoreContextCategories.Provider value={[store, dispatch]}>
            {
                children
            }
        </StoreContextCategories.Provider>
    )
}

const useStoreCategories = () => useContext(StoreContextCategories)[0];
const useDispatchCategories = () => useContext(StoreContextCategories)[1];

export { StoreContextCategories, useDispatchCategories, useStoreCategories, TypesCategories };



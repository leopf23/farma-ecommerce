import { useDispatchCategories } from "./StoreProvider";
import { TypesCategories } from './CategoriesTypes';
import { getAll, postAll } from "@/src/utils/methods";

export function useCategories() {
    const dispatch = useDispatchCategories();
    return {
        async getAllCategories() {
            const categories: any = await getAll(`${process.env.NEXT_PUBLIC_API_URL}/list-categories-public`);
            dispatch({
                type: TypesCategories.GET_CATEGORIES,
                payload: {
                    categories,
                },
            });
        },
    }
}

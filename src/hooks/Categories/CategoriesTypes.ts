const TypesCategories = {
    GET_CATEGORIES: 'GET_CATEGORIES',
}

function CategoriesTypes(state: any, action: any){
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
export { TypesCategories };
export default CategoriesTypes;

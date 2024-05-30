const initialData = {
    availableFunctions: {
        'tolowercase': { id: 'tolowercase', content: 'To Lower Case', visibility: 'public', jsCode: 'function transform(input, parameters){return input.toLowerCase()}', jsParameters: {}},
        'touppercase': { id: 'touppercase', content: 'To Upper Case', visibility: 'public', jsCode: 'function transform(input, parameters){return input.toUpperCase()}', jsParameters: {}},
        'add3params': { id: 'add3params', content: 'Añade 3 Parámetros', visibility: 'public', jsCode: "function transform(input, parameters){\n\n\t// tu código va aquí\n\treturn input + \" \" + parameters[\"ParamStr\"] + \" \" + parameters[\"ParamInt\"] + \" \" + parameters[\"ParamBool\"];\n\n}", jsParameters: {"ParamStr":{"fieldtype":"str","value":"lala"},"ParamInt":{"fieldtype":"int","value":13},"ParamBool":{"fieldtype":"bool","value":true}} },
        'b64encode': { id: 'b64encode', content: 'Base64 Encode', visibility: 'public', jsCode: 'function transform(input, parameters){return btoa(input)}', jsParameters: {}},
        'b64decode': { id: 'b64decode', content: 'Base64 Decode', visibility: 'public', jsCode: 'function transform(input, parameters){return atob(input)}', jsParameters: {}},
    },
    activeFunctions: {
    },
    columns: {
        'public_functions_column': {
            id: 'public_functions_column',
            title: 'Funciones públicas',
            functionIds: ['tolowercase', 'touppercase', 'add3params', 'b64encode', 'b64decode'],
        },
        'private_functions_column': {
            id: 'private_functions_column',
            title: 'Funciones privadas',
            functionIds: [],
        },
        'active_functions_column': {
            id: 'active_functions_column',
            title: 'Funciones activas',
            functionIds: [],
        },

    },

};

export default initialData;
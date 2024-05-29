const initialData = {
    availableFunctions: {
        'task-1': { id: 'task-1', content: 'To Lower Case', visibility: 'public', jsCode: 'function transform(input, parameters){return input.toLowerCase()}', jsParameters: {}},
        'task-2': { id: 'task-2', content: 'To Upper Case', visibility: 'public', jsCode: 'function transform(input, parameters){return input.toUpperCase()}', jsParameters: {}},
        'task-3': { id: 'task-3', content: 'Devuelve parámetro', visibility: 'public', jsCode: 'function transform(input, parameters){return parameters.testfield}', jsParameters: {"testfield":{"fieldtype":"str", "value":"TEST111"}, "testfield2":{"fieldtype":"str", "value":"TEST222"}}},
        'task-4': { id: 'task-4', content: '3Parametros', visibility: 'public', jsCode: "function transform(input, parameters){\n\n\t// tu código va aquí\n\treturn parameters[\"ParamStr\"] + \" \" + parameters[\"ParamInt\"] + \" \" + parameters[\"ParamBool\"];\n\n}", jsParameters: {"ParamStr":{"fieldtype":"str","value":"lala"},"ParamInt":{"fieldtype":"int","value":13},"ParamBool":{"fieldtype":"bool","value":true}} },
    },
    activeFunctions: {
    },
    columns: {
        'public_functions_column': {
            id: 'public_functions_column',
            title: 'Funciones públicas',
            functionIds: ['task-1', 'task-2', 'task-3', 'task-4'],
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
const initialData = {
    availableFunctions: {
        'task-1': { id: 'task-1', content: 'To Lower Case', visibility: 'public', jsCode: 'function transform(input, parameters){return input.toLowerCase()}', jsParameters: {}},
        'task-2': { id: 'task-2', content: 'To Upper Case', visibility: 'public', jsCode: 'function transform(input, parameters){return input.toUpperCase()}', jsParameters: {}},
        'task-3': { id: 'task-3', content: 'Devuelve parámetro', visibility: 'public', jsCode: 'function transform(input, parameters){return parameters.testfield}', jsParameters: {"testfield":{"fieldtype":"str", "value":"TEST111"}}},
        'task-4': { id: 'task-4', content: 'DDDDDDDD', visibility: 'public', jsCode: '', jsParameters: '' },
        'task-5': { id: 'task-5', content: 'EEEEE', visibility: 'private', jsCode: '', jsParameters: '' },
        'task-6': { id: 'task-6', content: 'FFFFFF', visibility: 'private', jsCode: '', jsParameters: '' },
        'task-7': { id: 'task-7', content: 'GGGGG', visibility: 'private', jsCode: '', jsParameters: '' },
        'task-8': { id: 'task-8', content: 'HHHHHH', visibility: 'private', jsCode: '', jsParameters: '' },
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
            functionIds: ['task-5', 'task-6', 'task-7', 'task-8'],
        },
        'active_functions_column': {
            id: 'active_functions_column',
            title: 'Funciones activas',
            functionIds: [],
        },

    },

};

export default initialData;
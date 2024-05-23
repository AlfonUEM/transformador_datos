import React from 'react';
import FunctionCreatorStepsLayout from "../components/FunctionCreatorStepsLayout";
import FunctionCreatorSteps from "../components/FunctionCreatorSteps";


function CreateFunctionPage({items, setItems}) {
    return (
        <>
            <FunctionCreatorStepsLayout

                sectionTitle="Creador de funciones"
                sectionDescription="Crea una nueva función para ser utilizada en el transformador de datos"
                sectionContent={<FunctionCreatorSteps />}
                items={items}
                setItems={setItems}
            />
        </>
    );
}

export default CreateFunctionPage;
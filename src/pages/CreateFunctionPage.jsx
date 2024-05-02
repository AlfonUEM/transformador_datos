import React from 'react';
import FunctionCreatorStepsLayout from "../components/FunctionCreatorStepsLayout";
import FunctionCreatorSteps from "../components/FunctionCreatorSteps";
import MainLayout from "../components/MainLayout";
function MainPage(){
    return (
        <>
            <FunctionCreatorStepsLayout

                sectionTitle="Creador de funciones"
                sectionDescription="Crea una nueva función para ser utilizada en el transformador de datos"
                sectionContent={<FunctionCreatorSteps/>}
            />
        </>
    );
}

export default MainPage;
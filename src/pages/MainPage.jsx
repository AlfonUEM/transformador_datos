import React from 'react';
import MainLayout from "../components/MainLayout";
import Transformer from "../components/Transformer";
function MainPage(){
    return (
        <>
            <MainLayout
                sectionTitle="Transformador de datos"
                sectionDescription="Aplica todas las transformaciones que quieras a tu entrada para obtener una salida"
                sectionContent={<Transformer/>}
            />
        </>
    );
}

export default MainPage;
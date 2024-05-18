import React from "react";
import Button from "@cloudscape-design/components/button";
import {Modal} from "@cloudscape-design/components";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import FunctionParametersForm from "./FunctionParametersForm";



function FunctionSettingsModal(props){

    const [modalVisible, setModalVisible] = React.useState(false);

    return(
        <>
            <Button iconName="settings" variant="inline-icon" onClick={() => setModalVisible(true)}/>
            <Modal
                onDismiss={() => setModalVisible(false)}
                visible={modalVisible}
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="primary">Cerrar</Button>
                        </SpaceBetween>
                    </Box>
                }
                header={"Parámetros de la función \"" + props.functionName + "\""}
            >
                <FunctionParametersForm dndState={props.dndState} functionId={props.functionId}  updateFunctionParameters={props.updateFunctionParameters}/>
            </Modal>
        </>
    );

}
export default FunctionSettingsModal
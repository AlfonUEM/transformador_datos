import React from 'react';
import {
    Container,
    ContentLayout, CopyToClipboard,
    Flashbar, FormField,
    Grid,
    Header, Input, Modal, Select,
    Textarea,
    TextContent
} from "@cloudscape-design/components";
import Box from "@cloudscape-design/components/box";
import runTransformerFunction from "../utils/TransformerFunctionsUtils"

import DNDColumn from "./DNDColumn";
import initialData from "./DNDInitialData"
import { DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import SpaceBetween from "@cloudscape-design/components/space-between";
import { CodeView } from "@cloudscape-design/code-view";
import Button from "@cloudscape-design/components/button";

function Transformer(){
    const [transformationOutput, setTransformationOutput] = React.useState("aqui va la salida");
    const [inputValue, setInputValue] = React.useState("");
    const [modalSaveActiveFunctionsVisible, setModalSaveActiveFunctionsVisible] = React.useState(false);
    const [modalLoadActiveFunctionsVisible, setModalLoadActiveFunctionsVisible] = React.useState(false);
    const [dndState, setDndState] = React.useState(initialData);
    const [saveCombinationName, setSaveCombinationName] = React.useState("");
    const [loadCombinationName, setLoadCombinationName] = React.useState({});
    const onDragEnd = result => {
        const { destination, source, draggableId } = result;

        const srcColumn = dndState.columns[source.droppableId];

        if (!destination && srcColumn.id !== "active_functions_column") {
            console.log(`Entro en !destination 1 : ${srcColumn.id}`);
            return;
        }


        // we want to remove the function from the active column in this case
        if (srcColumn.id === "active_functions_column" && (!destination || destination.droppableId !== source.droppableId)){
            console.log("Entro en !destination 2");
            const functionIds = Array.from(srcColumn.functionIds);
            functionIds.splice(source.index, 1);

            const updatedColumn = {
                ...srcColumn,
                functionIds: functionIds,
            };

            const updatedActiveFunctions = {...dndState.activeFunctions};
            delete updatedActiveFunctions[draggableId];

            const updatedState = {
                ...dndState,
                activeFunctions: updatedActiveFunctions,
                columns: {
                    ...dndState.columns,
                    [updatedColumn.id]: updatedColumn,
                },
            };
            updateDNDFunctions(updatedState);
            return;
        }

        // If the origin and destination is the same do nothing
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const dstColumn = dndState.columns[destination.droppableId];

        // reorder in the same column (only in the active functions column, since the others are disabled)
        if (srcColumn === dstColumn) {
            const functionIds = Array.from(srcColumn.functionIds);
            functionIds.splice(source.index, 1);
            functionIds.splice(destination.index, 0, draggableId);

            const updatedColumn = {
                ...srcColumn,
                functionIds: functionIds,
            };

            const updatedState = {
                ...dndState,
                columns: {
                    ...dndState.columns,
                    [updatedColumn.id]: updatedColumn,
                },
            };
            updateDNDFunctions(updatedState);
            return;
        }

        // clone from available functions to active functions column
        if (srcColumn !== dstColumn && dstColumn.id === "active_functions_column"){
            const clonedFunction = structuredClone(dndState.availableFunctions[draggableId]);
            clonedFunction.id = uuidv4();

            const updatedActiveFunctions = {...dndState.activeFunctions};
            updatedActiveFunctions[clonedFunction.id] = clonedFunction;

            const functionIds = Array.from(dstColumn.functionIds);
            functionIds.splice(destination.index, 0, clonedFunction.id);

            const updatedColumn = {
                ...dstColumn,
                functionIds: functionIds,
            };

            const updatedState = {
                ...dndState,
                activeFunctions: updatedActiveFunctions,
                columns: {
                    ...dndState.columns,
                    [updatedColumn.id]: updatedColumn,
                },
            };
            updateDNDFunctions(updatedState);
            return;
        }

    };

    function updateDNDFunctions(updatedState){
        setDndState(updatedState);
    }

    React.useEffect(() => {
        transformData();
    }, [dndState, inputValue]);

    function updateFunctionParameters(functionId, jsParameters){
        let updatedDNDState = {...dndState}
        updatedDNDState.activeFunctions[functionId].jsParameters = {...jsParameters};
        updateDNDFunctions(updatedDNDState);
        console.log(dndState);
    }

    function openSaveActiveFunctionsModal(){
        setModalSaveActiveFunctionsVisible(true);
    }

    function saveActiveFunctions(){
        console.log("TODO: save the current active functions as " + saveCombinationName);
        console.log(JSON.stringify(dndState.activeFunctions));
        setSaveCombinationName("")
        setModalSaveActiveFunctionsVisible(false);

    }

    function openLoadActiveFunctionsModal(){
        setModalLoadActiveFunctionsVisible(true);
    }

    function loadActiveFunctions(){
        console.log("TODO: load the active function " + loadCombinationName);

        setModalLoadActiveFunctionsVisible(false);

    }

    function transformData(){
        let output = null;
        let input = inputValue;
        let errorReturned = false;
        dndState.columns["active_functions_column"].functionIds.forEach((functionId) =>{
            if(!errorReturned){
                [errorReturned, output] = runTransformerFunction(input, dndState.activeFunctions[functionId].jsParameters, dndState.activeFunctions[functionId].jsCode);
                input = output;
            }
        });
        if(errorReturned){
            return "ERROR";
        }else{
            setTransformationOutput(output);
        }

    }

    return (
        <>

        <Grid
            gridDefinition={[{colspan: 5}, {colspan: 7}]}
        >
            <div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Grid
                        gridDefinition={[{colspan: 5}, {colspan: 7}]}
                    >
                    <div>
                        <SpaceBetween direction="vertical" size="m">
                        <DNDColumn
                                    key={dndState.columns["public_functions_column"].id}
                                    column={dndState.columns["public_functions_column"]}
                                    dndFunctions={dndState.columns["public_functions_column"].functionIds.map(functionId => dndState.availableFunctions[functionId])}
                                    isDropDisabled={true}
                                    dndState={dndState}
                                    updateFunctionParameters={updateFunctionParameters}
                                    openSaveActiveFunctionsModal={openSaveActiveFunctionsModal}
                                    openLoadActiveFunctionsModal={openLoadActiveFunctionsModal}
                        />
                        <DNDColumn
                            key={dndState.columns["private_functions_column"].id}
                            column={dndState.columns["private_functions_column"]}
                            dndFunctions={dndState.columns["private_functions_column"].functionIds.map(functionId => dndState.availableFunctions[functionId])}
                            isDropDisabled={true}
                            dndState={dndState}
                            updateFunctionParameters={updateFunctionParameters}
                            openSaveActiveFunctionsModal={openSaveActiveFunctionsModal}
                            openLoadActiveFunctionsModal={openLoadActiveFunctionsModal}
                        />
                        </SpaceBetween>
                    </div>
                    <div>
                        <DNDColumn
                            key={dndState.columns["active_functions_column"].id}
                            column={dndState.columns["active_functions_column"]}
                            dndFunctions={dndState.columns["active_functions_column"].functionIds.map(functionId => dndState.activeFunctions[functionId])}
                            isDropDisabled={false}
                            dndState={dndState}
                            updateFunctionParameters={updateFunctionParameters}
                            openSaveActiveFunctionsModal={openSaveActiveFunctionsModal}
                            openLoadActiveFunctionsModal={openLoadActiveFunctionsModal}
                        />
                    </div>
                    </Grid>
                </DragDropContext>
            </div>

            <div>
                    <Container variant={"stacked"} fitHeight={true}>
                        <SpaceBetween direction="vertical" size="l">
                            <Header variant="h4">Entrada</Header>

                            <Textarea
                                onChange={({detail}) => setInputValue(detail.value)}
                                value={inputValue}
                                placeholder="This is a placeholder"
                            />

                            <Header variant="h4">Salida</Header>
                            <CodeView
                                content={transformationOutput}
                                actions={
                                    <CopyToClipboard
                                        copyButtonAriaLabel="Copiar"
                                        copyErrorText="Fallo al copiar"
                                        copySuccessText="Copiado"
                                        textToCopy={transformationOutput}
                                    />}
                            />
                        </SpaceBetween>
                    </Container>

            </div>
        </Grid>
        <Modal
            visible={modalSaveActiveFunctionsVisible}
            onDismiss={() => setModalSaveActiveFunctionsVisible(false)}
            header="Guardar combinación de funciones"
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="secondary" onClick={() => setModalSaveActiveFunctionsVisible(false)}>Cancelar</Button>
                        <Button variant="primary" onClick={()=> saveActiveFunctions()}>Guardar</Button>
                    </SpaceBetween>
                </Box>
            }
        >
            <FormField
                label="Nombre de la combinación"
                description="Nombre con el que posteriormente podrás cargar la combinación de funciones actual"
            >
                <Input
                    value={saveCombinationName}
                    onChange={event => setSaveCombinationName(event.detail.value)}/>
            </FormField>

        </Modal>
        <Modal
            visible={modalLoadActiveFunctionsVisible}
            onDismiss={() => setModalLoadActiveFunctionsVisible(false)}
            header="Cargar combinación de funciones"
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="secondary" onClick={() => setModalLoadActiveFunctionsVisible(false)}>Cancelar</Button>
                        <Button variant="primary" onClick={()=> loadActiveFunctions()}>Cargar</Button>
                    </SpaceBetween>
                </Box>
            }
        >
            <FormField
                label="Nombre de la combinación"
                description="Selecciona la combinación de funciones que deseas cargar"
            >
                <Select
                    selectedOption={loadCombinationName}
                    onChange={({ detail }) =>
                        setLoadCombinationName(detail.selectedOption)
                    }
                    options={[
                        { label: "Option 1", value: "1" },
                        { label: "Option 2", value: "2" },
                        { label: "Option 3", value: "3" },
                        { label: "Option 4", value: "4" },
                        { label: "Option 5", value: "5" }
                    ]}
                />

            </FormField>

        </Modal>


        </>
    );
}

export default Transformer;
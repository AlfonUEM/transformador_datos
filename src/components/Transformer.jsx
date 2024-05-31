import React from 'react';
import {
    Container,
    CopyToClipboard,
    FormField,
    Grid,
    Header,
    Input,
    Modal,
    Select,
    Textarea,
    Toggle
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
import Spinner from "@cloudscape-design/components/spinner";
import {apiCreateCombination, apiCreateFunction, apiGetCombinations, apiGetFunctions} from "../utils/API";

function Transformer({addNotificationItem, setIsUserLoggedIn, isUserLoggedIn}){
    const [transformationOutput, setTransformationOutput] = React.useState("");
    const [transformationError, setTransformationError] = React.useState("");
    const [inputValue, setInputValue] = React.useState("");
    const [modalSaveActiveFunctionsVisible, setModalSaveActiveFunctionsVisible] = React.useState(false);
    const [modalLoadActiveFunctionsVisible, setModalLoadActiveFunctionsVisible] = React.useState(false);
    const [dndState, setDndState] = React.useState(initialData);
    const [saveCombinationName, setSaveCombinationName] = React.useState("");
    const [loadCombinationName, setLoadCombinationName] = React.useState({});
    const [debugEnabled, setDebugEnabled] = React.useState(false)
    const [privateFunctionsColumnInstructions, setPrivateFunctionsColumnInstructions] = React.useState(<p>Inicie sesión para cargar sus funciones privadas</p>);
    const [saveCombinationLoadingButtons, setSaveCombinationLoadingButtons] = React.useState(false);
    const [loadCombinationNameList, setLoadCombinationNameList] = React.useState([]);
    const [loadCombinationNameListLoading, setLoadCombinationNameListLoading] = React.useState(false);
    const [loadCombinationList, setLoadCombinationList] = React.useState([]);
    const [loadCombinationButtonDisabled, setLoadCombinationButtonDisabled] = React.useState(false);

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

        setSaveCombinationLoadingButtons(true);

        apiCreateCombination(saveCombinationName,
                            JSON.stringify({"activeFunctions": dndState.activeFunctions,
                                "activeColumnFunctionIds":dndState.columns["active_functions_column"].functionIds})
            ).then(response => {

                if (response.status === 200) {
                    setSaveCombinationName("")
                    setModalSaveActiveFunctionsVisible(false);
                    setSaveCombinationLoadingButtons(false);
                    addNotificationItem({
                        type: "success",
                        content: "Combinación de funciones guardada correctamente.",
                    });

                } else if (response.status === 403) {
                    setSaveCombinationLoadingButtons(false);
                    setIsUserLoggedIn(false);
                } else {
                    setSaveCombinationLoadingButtons(false);
                    addNotificationItem({
                        type: "error",
                        content: "Error al guardar la combinación de funciones.",
                    });
                }
            }
        )
    }

    React.useEffect(() => {
        refreshUserFunctions();
    }, [isUserLoggedIn]);

    function refreshUserFunctions(){
        if(isUserLoggedIn) {
            setPrivateFunctionsColumnInstructions(<Spinner/>);
            setTimeout(function() {
                apiGetFunctions().then(response => {
                    console.log(response)
                    if (response.status === 200) {
                        let returnedFunctions = [];
                        response.body.content.forEach(entry => {
                            returnedFunctions.push(JSON.parse(entry[3]));
                        });
                        updatePrivateFunctions(returnedFunctions);

                    } else if (response.status === 403) {
                        setIsUserLoggedIn(false);
                    } else {
                        addNotificationItem({
                            type: "error",
                            content: "Error al obtener las funciones privadas del usuario",
                        });
                    }
                    setPrivateFunctionsColumnInstructions(<div></div>)
                });
            }, 2000); // we need some time to write the JWT in window.session, read it, etc, or it leads to a 403
        }else{
            updatePrivateFunctions([]);
            setPrivateFunctionsColumnInstructions(<p>Inicie sesión para cargar sus funciones privadas</p>);
        }
    }

    function updatePrivateFunctions(newFunctions){
        let updatedPrivateColumnFunctionIds = [];
        let publicFunctionIds = [];
        let updatedAvailableFunctions= {};
        let updatedDNDstate = {}

        for (let fId in dndState.availableFunctions){
            if(dndState.availableFunctions[fId].visibility === "public"){
                updatedAvailableFunctions[fId] = {...dndState.availableFunctions[fId]}
                publicFunctionIds.push(fId);
            }
        }

        newFunctions.forEach(newFunction => {
            let newUUID = uuidv4();
            updatedAvailableFunctions[newUUID] = {
                id: newUUID,
                content: newFunction.name,
                visibility: "private",
                jsCode: newFunction.jsCode,
                jsParameters: newFunction.jsParameters
            }
            updatedPrivateColumnFunctionIds.push(newUUID);
        })

        updatedDNDstate = {availableFunctions: updatedAvailableFunctions,
                            activeFunctions: structuredClone(dndState.activeFunctions),
                            columns: structuredClone(dndState.columns)}

        updatedDNDstate.columns["private_functions_column"].functionIds = updatedPrivateColumnFunctionIds;

        if(newFunctions.length === 0){
            updatedDNDstate.activeFunctions = {};
            updatedDNDstate.columns["active_functions_column"].functionIds = [];
        }
        setDndState(updatedDNDstate);
    }

    function updateActiveFunctions(newActiveFunction ){
        console.log(newActiveFunction)
        let updatedDNDstate = {availableFunctions: structuredClone(dndState.availableFunctions),
            activeFunctions: structuredClone(newActiveFunction.activeFunctions),
            columns: structuredClone(dndState.columns)}
        updatedDNDstate.columns["active_functions_column"].functionIds = structuredClone(newActiveFunction.activeColumnFunctionIds);
        setDndState(updatedDNDstate);
    }

    function openLoadActiveFunctionsModal(){
        setLoadCombinationNameList([]);
        setLoadCombinationName({});
        setLoadCombinationNameListLoading(true);
        setModalLoadActiveFunctionsVisible(true);
        setLoadCombinationButtonDisabled(true);
        apiGetCombinations().then(response => {
            if (response.status === 200) {
                let returnedCombinations = {};
                let combinationNameList = [];
                response.body.content.forEach(entry => {
                    returnedCombinations[entry[1]] = JSON.parse(entry[2]);
                    combinationNameList.push({ label: entry[1], value: entry[1] });
                });
                setLoadCombinationList(returnedCombinations);
                setLoadCombinationNameList(combinationNameList);
                setLoadCombinationNameListLoading(false);



            } else if (response.status === 403) {
                setIsUserLoggedIn(false);
            } else {
                setModalLoadActiveFunctionsVisible(false);
                addNotificationItem({
                    type: "error",
                    content: "Error al obtener las combinaciones del usuario",
                });
            }
        });

    }

    function loadActiveFunctions(){
        updateActiveFunctions(loadCombinationList[loadCombinationName.label]);
        setModalLoadActiveFunctionsVisible(false);
    }

    function transformData(){
        let output = null;
        let input = inputValue;
        let errorReturned = null;
        dndState.columns["active_functions_column"].functionIds.forEach((functionId) =>{
            if(!errorReturned){
                [errorReturned, output] = runTransformerFunction(input, dndState.activeFunctions[functionId].jsParameters, dndState.activeFunctions[functionId].jsCode);
                input = output;
            }
        });
        if(errorReturned){
            setTransformationOutput("ERROR");
            setTransformationError(errorReturned)
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
                                    privateFunctionsColumnInstructions={privateFunctionsColumnInstructions}
                                    isUserLoggedIn={isUserLoggedIn}
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
                            privateFunctionsColumnInstructions={privateFunctionsColumnInstructions}
                            isUserLoggedIn={isUserLoggedIn}
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
                            privateFunctionsColumnInstructions={privateFunctionsColumnInstructions}
                            isUserLoggedIn={isUserLoggedIn}
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
                            <Toggle
                                onChange={({ detail }) =>
                                    setDebugEnabled(detail.checked)
                                }
                                checked={debugEnabled}
                            >
                                Modo Debug
                            </Toggle>

                            {debugEnabled &&
                                <>
                                    <Header variant="h4">Excepciones</Header>
                                    <CodeView
                                        content={transformationError}
                                        actions={
                                            <CopyToClipboard
                                                copyButtonAriaLabel="Copiar"
                                                copyErrorText="Fallo al copiar"
                                                copySuccessText="Copiado"
                                                textToCopy={transformationError}
                                            />}
                                    />
                                </>
                            }
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
                        <Button variant="secondary" onClick={() => setModalSaveActiveFunctionsVisible(false)} loading={saveCombinationLoadingButtons}>Cancelar</Button>
                        <Button variant="primary" onClick={()=> saveActiveFunctions()} loading={saveCombinationLoadingButtons}>Guardar</Button>
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
                        <Button variant="primary" onClick={()=> loadActiveFunctions()} disabled={loadCombinationButtonDisabled}>Cargar</Button>
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
                    onChange={({ detail }) => {
                        setLoadCombinationName(detail.selectedOption)
                        setLoadCombinationButtonDisabled(false);
                    }
                    }
                    options={loadCombinationNameList}
                    statusType={loadCombinationNameListLoading ? "loading" : "finished"}
                />

            </FormField>

        </Modal>


        </>
    );
}

export default Transformer;
import React from 'react';
import {
    Container,
    ContentLayout, CopyToClipboard,
    Flashbar,
    Grid,
    Header,
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

function Transformer(){
    const [transformationOutput, setTransformationOutput] = React.useState("aqui va la salida");
    const [inputValue, setInputValue] = React.useState("");


    const [dndState, setDndState] = React.useState(initialData);
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
            const clonedFunction = {...dndState.availableFunctions[draggableId], id:uuidv4()};

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
                        />
                        <DNDColumn
                            key={dndState.columns["private_functions_column"].id}
                            column={dndState.columns["private_functions_column"]}
                            dndFunctions={dndState.columns["private_functions_column"].functionIds.map(functionId => dndState.availableFunctions[functionId])}
                            isDropDisabled={true}
                        />
                        </SpaceBetween>
                    </div>
                    <div>
                        <DNDColumn
                            key={dndState.columns["active_functions_column"].id}
                            column={dndState.columns["active_functions_column"]}
                            dndFunctions={dndState.columns["active_functions_column"].functionIds.map(functionId => dndState.activeFunctions[functionId])}
                            isDropDisabled={false}
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
    );
}

export default Transformer;
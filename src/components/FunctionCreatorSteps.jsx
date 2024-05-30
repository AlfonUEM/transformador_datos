import React from 'react';
import {
    CodeEditor,
    ColumnLayout,
    Container, FormField,
    Header, Input, Link, Select, Table,
} from "@cloudscape-design/components";
import Box from "@cloudscape-design/components/box";
import Wizard from "@cloudscape-design/components/wizard";
import AttributeEditor from "@cloudscape-design/components/attribute-editor";
import { getTestInput } from "../utils/TransformerFunctionsUtils"

import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/cloud_editor.css';
import 'ace-builds/css/theme/cloud_editor_dark.css';


import SpaceBetween from "@cloudscape-design/components/space-between";
import runTransformerFunction from "../utils/TransformerFunctionsUtils";
import {CodeView} from "@cloudscape-design/code-view";
import javascriptHighlight from "@cloudscape-design/code-view/highlight/javascript";
import {apiCreateFunction} from "../utils/API";


const FUNCTION_INITIAL_STR = "function transform(input, parameters){"

function FunctionCreatorSteps({addNotificationItem}){
    const [activeStepIndex, setActiveStepIndex] = React.useState(0)
    const [temporarySummary, setTemporarySummary] = React.useState("TODO")
    const [testOutput, setTestOutput] = React.useState("")
    const [testError, setTestError] = React.useState("")
    const [functionName, setFunctionName] = React.useState("")
    const [functionDescription, setFunctionDescription] = React.useState("")
    const [functionNameFormFieldError, setFunctionNameFormFieldError] = React.useState("")
    const [functionDescriptionFormFieldError, setFunctionDescriptionFormFieldError] = React.useState("")
    const [functionParameters, setFunctionParameters] = React.useState([]);
    const [changeParameterType, setChangeParameterType] = React.useState(false)
    const [codeEditorValue, setCodeEditorValue] = React.useState("function transform(input, parameters){\n\n\t// tu código va aquí\n\n}");
    const [inputEditorValue, setInputEditorValue] = React.useState("//establece el valor de entrada de tu función a continuaciónn\n\nlet input = \"\";");
    const [codeEditorPreferences, setCodeEditorPreferences] = React.useState({});
    const [codeEditorReturnsErrors, setCodeEditorReturnsErrors] = React.useState(false);
    const [inputEditorPreferences, setInputEditorPreferences] = React.useState({});
    const [codeEditorLoading, setCodeEditorLoading] = React.useState(true);
    const [inputEditorLoading, setInputEditorLoading] = React.useState(true);
    const [ace, setAce] = React.useState();
    const [aceInput, setAceInput] = React.useState();
    const [submitLoading, setSubmitLoading] = React.useState(false);

    const InputForParameters = React.memo(({ value, index, placeholder, setFunctionParameters, prop }) => {
        return (
            <Input
                value={value}
                placeholder={placeholder}
                onChange={({ detail }) => {
                    setFunctionParameters(functionParameters => {
                        const updatedFunctionParameters = [...functionParameters];
                        updatedFunctionParameters[index] = {
                            ...updatedFunctionParameters[index],
                            [prop]: detail.value,
                        };
                        return updatedFunctionParameters;
                    });
                }}
            />
        );
    });

    const SelectForParameterType = React.memo(({ value, index, options, setFunctionParameters, prop, refreshFieldTypes=false }) => {
        return (
            <Select
                selectedOption={value}
                options={options}
                onChange={({ detail }) => {
                    if(functionParameters[index] && functionParameters[index].type.value === "bool" && detail.selectedOption.value !== "bool"){
                        setFunctionParameters(functionParameters => {
                            const updatedFunctionParameters = [...functionParameters];
                            updatedFunctionParameters[index] = {
                                ...updatedFunctionParameters[index],
                                [prop]: detail.selectedOption,
                                value: "",
                            };
                            return updatedFunctionParameters;
                        });
                    }else {
                        setFunctionParameters(functionParameters => {
                            const updatedFunctionParameters = [...functionParameters];
                            updatedFunctionParameters[index] = {
                                ...updatedFunctionParameters[index],
                                [prop]: detail.selectedOption,
                            };
                            return updatedFunctionParameters;
                        });
                    }
                    if(refreshFieldTypes) {
                        setChangeParameterType(!changeParameterType);
                    }
                }}
            />
        );
    });

    const SelectForBoolParameter = React.memo(({ value, index, options, setFunctionParameters, prop}) => {
        return (
            <Select
                selectedOption={value}
                options={options}
                onChange={({ detail }) => {
                    setFunctionParameters(functionParameters => {
                        const updatedFunctionParameters = [...functionParameters];
                        updatedFunctionParameters[index] = {
                            ...updatedFunctionParameters[index],
                            [prop]: detail.selectedOption,
                        };
                        return updatedFunctionParameters;
                    });
                }}
            />
        );
    });

    function verifyAllParameters(){
        let functionParameterKeys = getFunctionParameterKeys();
        if(new Set(functionParameterKeys).size !== functionParameterKeys.length) { // si hay duplicados
            return false
        }
        functionParameters.forEach((parameter) =>{
            if(checkParameterValue(parameter) !== null){
                return false
            }
        });
        return true;
    }

    function getFunctionParameterKeys(){
        let paramKeys= functionParameters.map(param => param.key);
        return paramKeys;
    }

    function isDuplicatedParameter(parameterKey){
        let occurrences = 0;
        console.log("LLLL")
        console.log(functionParameters)
        functionParameters.forEach((parameter) =>{
            console.log("parameter.key: " + parameter.key);
            console.log("parameterKey: " + parameterKey);
            if(parameter.key === parameterKey){
                occurrences++;
            }
            console.log("occurrence: " + occurrences);

        });
        if(occurrences>1){
            return true
        }else{
            return false
        }
    }
    function checkParameterKey(item){
        if(item.key && !item.key.match(/^[a-z][a-z0-9-_]*$/i)){
            return "Solo se admiten caracteres alfanuméricos, _ y -"
        }else{
            if(item.key && isDuplicatedParameter(item.key)){
                return "Parámetro duplicado"
            }else {
                return null;
            }
        }
    }

    function checkParameterValue(item){
        if(item.value){
            if(item.type.value === "str"){
                return null;
            }else if (item.type.value === "int"){
                if(!item.value.match(/^[0-9]+$/)){
                    return "Solo valores numéricos";
                }
            }else if (item.type.value === "bool"){
                return null;
            }
        }else{
            if(item.type.value === "str"){
                return null;
            }else if (item.type.value === "int"){
                if(!item.value.match(/^[0-9]+$/)){
                    return "Valor requerido";
                }
            }else if (item.type.value === "bool"){
                return "Valor requerido";
            }
        }
    }



    const functionParametersDefinition = React.useMemo(
        () => [
            {
                label: "Nombre del parámetro",
                control: ({ key = '' }, itemIndex) => (
                    <InputForParameters prop="key" value={key} index={itemIndex} placeholder="Introduzca el nombre" setFunctionParameters={setFunctionParameters} />
                ),
                errorText: item =>  checkParameterKey(item),
            },
            {
                label: "Tipo",
                control: ({ type = {label: "", value: ""} }, itemIndex) => (
                    <SelectForParameterType
                        prop="type"
                        value={type}
                        index={itemIndex}
                        options={[
                            { label: "Entero", value: "int" },
                            { label: "String", value: "str" },
                            { label: "Booleano", value: "bool" }
                        ]}
                        setFunctionParameters={setFunctionParameters}
                        refreshFieldTypes={true}
                    />
                ),
            },
            {
                label: "Valor por defecto",
                control: ({ value = '' }, itemIndex) => (
                    functionParameters[itemIndex] !== undefined && functionParameters[itemIndex].type.value === "bool" ?
                        <SelectForBoolParameter
                            prop="value"
                            value={value}
                            index={itemIndex}
                            options={[
                                { label: "Verdadero", value: true },
                                { label: "Falso", value: false },
                            ]}
                            setFunctionParameters={setFunctionParameters}
                        />
                        :

                    <InputForParameters prop="value" value={value} index={itemIndex} placeholder="Introduzca valor" setFunctionParameters={setFunctionParameters} />
                ),
                errorText: item =>
                    checkParameterValue(item)
            },

        ],
        [changeParameterType]
    );

    React.useEffect(() => {
        async function loadAce() {
            const ace = await import('ace-builds');
            await import('ace-builds/webpack-resolver');
            ace.config.set('useStrictCSP', true);
            return ace;
        }

        loadAce()
            .then(ace => {setAce(ace); setAceInput(ace)})
            .finally(() => {setCodeEditorLoading(false); setInputEditorLoading(false)});
    }, []);

    const codeEditorI18nStrings = {
        loadingState: 'Cargando editor de código',
        errorState: 'Hubo un problema cargando el editor de código.',
        errorStateRecovery: 'Reintentar',
        editorGroupAriaLabel: 'Editor de código',
        statusBarGroupAriaLabel: 'Barra de estado',
        cursorPosition: (row, column) => `Línea ${row}, Columna ${column}`,
        errorsTab: 'Errores',
        warningsTab: 'Warnings',
        preferencesButtonAriaLabel: 'preferencias',
        paneCloseButtonAriaLabel: 'Cerrar',
        preferencesModalHeader: 'Preferencias',
        preferencesModalCancel: 'Cancelar',
        preferencesModalConfirm: 'Confirmar',
        preferencesModalWrapLines: 'Evitar scrolling lateral',
        preferencesModalTheme: 'Tema',
        preferencesModalLightThemes: 'Tema claro',
        preferencesModalDarkThemes: 'Tema oscuro',
    };


    function exportFunctionToJson(){
        let exportedFunctionParameters = {}
        functionParameters.forEach((parameter) =>{
           if(parameter.type.value === "str"){
               exportedFunctionParameters[parameter.key] = {"fieldtype": parameter.type.value, "value": parameter.value}
           }else if(parameter.type.value === "int") {
               exportedFunctionParameters[parameter.key] = {"fieldtype": parameter.type.value, "value": Number(parameter.value)}
           }else if(parameter.type.value === "bool"){
               exportedFunctionParameters[parameter.key] = {"fieldtype": parameter.type.value, "value": parameter.value.value}
           }
        })

        const functionObject = {
            name: functionName,
            description: functionDescription,
            jsCode: codeEditorValue,
            jsParameters: exportedFunctionParameters
        }
        return JSON.stringify(functionObject);
    }

    function clickSubmit() {
        setSubmitLoading(true);
        setTemporarySummary(exportFunctionToJson());
        console.log(exportFunctionToJson());
        console.log(functionParameters);
        apiCreateFunction(functionName, functionDescription, exportFunctionToJson()).then(response =>{
            console.log(response)
            if(response.status === 200){
                addNotificationItem({
                    type: "success",
                    content: "Función creada correctamente",
                });
                setSubmitLoading(false);
                window.location.href = '#';
            }else{
                addNotificationItem({
                    type: "error",
                    content: "Error al crear función",
                });
                setSubmitLoading(false);
            }
        });

    }


    function translate_boolean(true_or_false){
        if(true_or_false === true){
            return "Verdadero";
        }else{
            return "Falso";
        }
    }

    function modifyCode(new_value){
        if(new_value.startsWith(FUNCTION_INITIAL_STR)){
            setCodeEditorValue(new_value);
        }else{
            setCodeEditorValue(FUNCTION_INITIAL_STR + new_value.substring(FUNCTION_INITIAL_STR.length));
        }
    }

    function modifyTestInput(new_value){
        setInputEditorValue(new_value);
    }

    React.useEffect(() => {
        transformDataTest();
    }, [inputEditorValue]);


    function transformDataTest(){
        const [errorProcessingInput, outputProcessingInput] = getTestInput(inputEditorValue);
        let functionInput;
        if(errorProcessingInput){
            setTestError("Excepción al procesar su código de generación de input (no se ha llegado a ejecutar su función):\n\n" + errorProcessingInput);
            setTestOutput("");
        }else{
            setTestError("");
            functionInput = outputProcessingInput;
            let functionAndParams = JSON.parse(exportFunctionToJson());
            const [errorInFunction, outputFromFunction] = runTransformerFunction(functionInput, functionAndParams.jsParameters, functionAndParams.jsCode)
            if(errorInFunction){
                setTestError("Excepción al ejecutar su función con los valores por defecto de los parámetros y la entrada definida arriba:\n\n" + errorInFunction);
                setTestOutput("");
            }else{
                setTestError("");
                setTestOutput(outputFromFunction);
            }
        }
    }

    const validateNextStep = (event) => {
        const requestedStepIndex = event.detail.requestedStepIndex;
        switch (activeStepIndex) {
            case 0:
                if (functionName !== "" && functionDescription !== "") {
                    setActiveStepIndex(requestedStepIndex)
                } else {
                    if(functionName === ""){
                        setFunctionNameFormFieldError("El nombre no puede estar vacío")
                    }
                    if(functionDescription === ""){
                        setFunctionDescriptionFormFieldError("La descripción no puede estar vacía")
                    }
                }
                break
            case 1:
                setChangeParameterType(!changeParameterType);
                if(verifyAllParameters()) {
                    transformDataTest();
                    setActiveStepIndex(requestedStepIndex)
                }
                break
            case 2:
                if(!codeEditorReturnsErrors) {
                    transformDataTest();
                    setActiveStepIndex(requestedStepIndex)
                }else{
                    addNotificationItem({
                        type: "error",
                        content: "El código es inválido. Corríjalo antes de continuar.",
                    });
                }
                break
            case 3:
                setActiveStepIndex(requestedStepIndex)
                if(testError !== "") {
                    addNotificationItem({
                        type: "warning",
                        content: "Tenga en cuenta que su función resultó en una excepción en la última prueba que usted realizó",
                    });
                }
                break
            case 4:
                setActiveStepIndex(requestedStepIndex)
                break
            default:
                console.log("Error: Paso no válido")
                break
        }
    }

    function validatedSetFunctionName(value){
        if(value !== ""){
            setFunctionNameFormFieldError("");
        }
        setFunctionName(value);
    }

    function validatedSetFunctionDescription(value){
        if(value !== ""){
            setFunctionDescriptionFormFieldError("");
        }
        setFunctionDescription(value);
    }

    return (
        <Wizard
            i18nStrings={{
                stepNumberLabel: stepNumber =>
                    `Paso ${stepNumber}`,
                collapsedStepsLabel: (stepNumber, stepsCount) =>
                    `Paso ${stepNumber} de ${stepsCount}`,
                skipToButtonLabel: (step, stepNumber) =>
                    `Saltar a ${step.title}`,
                navigationAriaLabel: "pasos",
                cancelButton: "Cancelar",
                previousButton: "Anterior",
                nextButton: "Siguiente",
                submitButton: "Crear función",
                optional: "opcional",
                submitButtonLoadingAnnouncement:"Creando función"
            }}
            onNavigate={(event) => validateNextStep(event)}
            activeStepIndex={activeStepIndex}
            allowSkipTo
            onSubmit={clickSubmit}
            isLoadingNextStep={submitLoading}
            steps={[
                {
                    title: "Datos básicos",
                    info: <Link variant="info">Info</Link>,
                    description:
                        "Cada función necesita un nombre con el que se visualizará en el transformador de datos y una descripción.",
                    content: (
                        <Container
                            header={
                                <Header variant="h2">
                                    Datos básicos
                                </Header>
                            }
                        >
                            <SpaceBetween direction="vertical" size="l">
                                <FormField label="Nombre de la función" errorText={functionNameFormFieldError}>
                                    <Input value={functionName} onChange={({ detail }) => validatedSetFunctionName(detail.value)}/>
                                </FormField>
                                <FormField label="Descripción" errorText={functionDescriptionFormFieldError}>
                                    <Input value={functionDescription} onChange={({ detail }) => validatedSetFunctionDescription(detail.value)}/>
                                </FormField>
                            </SpaceBetween>
                        </Container>
                    )
                },
                {
                    title: "Parámetros de la función",
                    description:
                        "Parámetros que serán accessibles desde la función.",
                    content: (
                        <Container header={<Header variant="h2">Parámetros</Header>}>
                            <AttributeEditor
                                onAddButtonClick={() => setFunctionParameters([...functionParameters,
                                    {key: "",
                                    value: "",
                                    type: { label: "String", value: "str" }}])}
                                onRemoveButtonClick={({detail: { itemIndex }}) => {
                                    const tmpFunctionParameters = [...functionParameters];
                                    tmpFunctionParameters.splice(itemIndex, 1);
                                    setFunctionParameters(tmpFunctionParameters);
                                }}
                                items={functionParameters}
                                addButtonText="Añadir parámetro"
                                removeButtonText={"Eliminar"}
                                definition={functionParametersDefinition}
                            />
                        </Container>
                    ),
                    isOptional: true
                },
                {
                    title: "Código de la función",
                    description: "El código de su función transformadora",
                    content: (
                        <SpaceBetween size="m">

                            <Table
                                columnDefinitions={[
                                    {
                                        id: "paramName",
                                        header: "Nombre",
                                        cell: item => item.key,
                                    },
                                    {
                                        id: "paramType",
                                        header: "Tipo de dato",
                                        cell: item => item.type.label,

                                    },
                                    {
                                        id: "paramDefaultValue",
                                        header: "Valor por defecto",
                                        cell: item => item.type.value === "bool" ? translate_boolean(item.value.value) : item.value,
                                    },
                                    {
                                        id: "paramAccessCode",
                                        header: "Acceso desde código",
                                        cell: item => 'parameters["' + item.key + '"]',
                                    },

                                ]}
                                enableKeyboardNavigation
                                items={functionParameters}
                                loadingText="Cargando"
                                sortingDisabled
                                empty={
                                    <Box
                                        margin={{ vertical: "xs" }}
                                        textAlign="center"
                                        color="inherit"
                                    >
                                        <b>La función no tiene parametros definidos</b>
                                    </Box>
                                }
                                header={<Header variant="h2">Parámetros</Header>}
                            />

                            <Container header={<Header variant="h2">Código de la función</Header>}>
                                <CodeEditor
                                    ace={ace}
                                    value={codeEditorValue}
                                    language="javascript"
                                    onChange={event => modifyCode(event.detail.value)}
                                    preferences={codeEditorPreferences}
                                    onPreferencesChange={event => setCodeEditorPreferences(event.detail)}
                                    loading={codeEditorLoading}
                                    i18nStrings={codeEditorI18nStrings}
                                    themes={{ light: ['cloud_editor'], dark: ['cloud_editor_dark'] }}
                                    editorContentHeight={250}
                                    onValidate={event => {
                                                    if(event.detail.annotations.length > 0){
                                                        setCodeEditorReturnsErrors(true)
                                                    }else{
                                                        setCodeEditorReturnsErrors(false)} }
                                                    }
                                />
                            </Container>
                        </SpaceBetween>
                    ),
                    isOptional: false
                },
                {
                    title: "Laboratorio",
                    description: "En esta página usted debe probar su función de modo que retorne sin errores con los valores por defecto de los parámetros",
                    content: (
                        <SpaceBetween size="m">
                            <Table
                                columnDefinitions={[
                                    {
                                        id: "paramName",
                                        header: "Nombre",
                                        cell: item => item.key,
                                    },
                                    {
                                        id: "paramType",
                                        header: "Tipo de dato",
                                        cell: item => item.type.label,

                                    },
                                    {
                                        id: "paramDefaultValue",
                                        header: "Valor por defecto",
                                        cell: item => item.type.value === "bool" ? translate_boolean(item.value.value) : item.value,
                                    },
                                    {
                                        id: "paramAccessCode",
                                        header: "Acceso desde código",
                                        cell: item => 'parameters["' + item.key + '"]',
                                    },

                                ]}
                                enableKeyboardNavigation
                                items={functionParameters}
                                loadingText="Cargando"
                                sortingDisabled
                                empty={
                                    <Box
                                        margin={{ vertical: "xs" }}
                                        textAlign="center"
                                        color="inherit"
                                    >
                                        <b>La función no tiene parametros definidos</b>
                                    </Box>
                                }
                                header={<Header variant="h2">Parámetros</Header>}
                            />

                            <Container header={<Header variant="h2">Código</Header>}>
                                <CodeView
                                    content={codeEditorValue}
                                    highlight={javascriptHighlight}
                                />
                            </Container>
                            <Container header={<Header variant="h2">Entrada</Header>}>
                                <CodeEditor
                                    ace={aceInput}
                                    value={inputEditorValue}
                                    language="javascript"
                                    onDelayedChange={event => modifyTestInput(event.detail.value)}
                                    preferences={inputEditorPreferences}
                                    onPreferencesChange={event => setInputEditorPreferences(event.detail)}
                                    loading={inputEditorLoading}
                                    i18nStrings={codeEditorI18nStrings}
                                    themes={{ light: ['cloud_editor'], dark: ['cloud_editor_dark'] }}
                                    editorContentHeight={100}
                                />
                            </Container>

                            <Container header={<Header variant="h2">Salida</Header>}>
                                <CodeView
                                    content={testOutput}
                                />
                            </Container>

                            <Container header={<Header variant="h2">Excepciones</Header>}>
                                <CodeView
                                    content={testError}
                                />
                            </Container>

                        </SpaceBetween>
                    ),
                    isOptional: false
                },
                {
                    title: "Revisión y creación",
                    content: (
                        <SpaceBetween size="m">
                            <Container header={<Header variant="h2">Datos básicos</Header>}>
                                <ColumnLayout columns={2} variant="text-grid">
                                    <SpaceBetween size="l">
                                        <div>
                                            <Box variant="awsui-key-label">Nombre</Box>
                                            <div>{functionName}</div>
                                        </div>
                                    </SpaceBetween>
                                    <SpaceBetween size="l">
                                        <div>
                                            <Box variant="awsui-key-label">Descripción</Box>
                                            <div>{functionDescription}</div>
                                        </div>
                                    </SpaceBetween>
                                </ColumnLayout>
                            </Container>

                                <Table
                                    columnDefinitions={[
                                        {
                                            id: "paramName",
                                            header: "Nombre",
                                            cell: item => item.key,
                                        },
                                        {
                                            id: "paramType",
                                            header: "Tipo de dato",
                                            cell: item => item.type.label,

                                        },
                                        {
                                            id: "paramDefaultValue",
                                            header: "Valor por defecto",
                                            cell: item => item.type.value === "bool" ? translate_boolean(item.value.value) : item.value,
                                        },
                                        {
                                            id: "paramAccessCode",
                                            header: "Acceso desde código",
                                            cell: item => 'parameters["' + item.key + '"]',
                                        },

                                    ]}
                                    enableKeyboardNavigation
                                    items={functionParameters}
                                    loadingText="Cargando"
                                    sortingDisabled
                                    empty={
                                        <Box
                                            margin={{ vertical: "xs" }}
                                            textAlign="center"
                                            color="inherit"
                                        >
                                                <b>La función no tiene parametros definidos</b>
                                        </Box>
                                    }
                                    header={<Header variant="h2">Parámetros</Header>}
                                />

                            <Container header={<Header variant="h2">Código</Header>}>

                                    <CodeView
                                        content={codeEditorValue}
                                        highlight={javascriptHighlight}
                                    />
                            </Container>
                        </SpaceBetween>
                    )
                }
            ]}
        />
    );
}

export default FunctionCreatorSteps;
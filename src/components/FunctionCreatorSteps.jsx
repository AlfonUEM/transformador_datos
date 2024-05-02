import React from 'react';
import {
    CodeEditor,
    ColumnLayout,
    Container, FormField,
    Header, Input, Link, Select,
} from "@cloudscape-design/components";
import Box from "@cloudscape-design/components/box";
import Wizard from "@cloudscape-design/components/wizard";
import AttributeEditor from "@cloudscape-design/components/attribute-editor";

import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/cloud_editor.css';
import 'ace-builds/css/theme/cloud_editor_dark.css';


import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import runTransformerFunction from "../utils/TransformerFunctionsUtils";






function FunctionCreatorSteps(){
    const [activeStepIndex, setActiveStepIndex] = React.useState(0)

    const [functionName, setFunctionName] = React.useState("")
    const [functionDescription, setFunctionDescription] = React.useState("")

    // ejemplo para attibute-editor
    const [functionParameters, setFunctionParameters] = React.useState([
        /*{
            key: "some-key-1",
            value: "some-value-1",
            type: { label: "String", value: "str" }
        },
        {
            key: "some-key-2",
            value: "some-value-2",
            type: { label: "Entero", value: "int" }
        }*/
    ]);


    const [changeParameterType, setChangeParameterType] = React.useState(false)

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


    const functionParametersDefinition = React.useMemo(
        () => [
            {
                label: "Nombre del parámetro",
                control: ({ key = '' }, itemIndex) => (
                    <InputForParameters prop="key" value={key} index={itemIndex} placeholder="Introduzca el nombre" setFunctionParameters={setFunctionParameters} />
                ),
                //errorText: item => (item.key && item.key.match(/^AWS/i) ? 'Key cannot start with "AWS"' : null),
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
                //errorText: item => (item.key && item.key.match(/^AWS/i) ? 'Key cannot start with "AWS"' : null),
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
                /*errorText: item =>
                    item.value && item.value.length > 10 ? (
                        <span>
              Value {item.value} is longer than 10 characters, <Link variant="info">Info</Link>
            </span>
                    ) : null,*/
            },

        ],
        [changeParameterType]
    );



    const [codeEditorValue, setCodeEditorValue] = React.useState("function transform(input, parameters){\n\n\t// tu código va aquí\n\n}");
    const [codeEditorPreferences, setCodeEditorPreferences] = React.useState({});
    const [codeEditorLoading, setCodeEditorLoading] = React.useState(true);
    const [ace, setAce] = React.useState();

    React.useEffect(() => {
        async function loadAce() {
            const ace = await import('ace-builds');
            await import('ace-builds/webpack-resolver');
            ace.config.set('useStrictCSP', true);
            return ace;
        }

        loadAce()
            .then(ace => setAce(ace))
            .finally(() => setCodeEditorLoading(false));
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
                optional: "opcional"
            }}
            onNavigate={({ detail }) =>
                setActiveStepIndex(detail.requestedStepIndex)
            }
            activeStepIndex={activeStepIndex}
            allowSkipTo
            onSubmit={() => console.log(exportFunctionToJson())}
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
                                <FormField label="Nombre de la función">
                                    <Input value={functionName} onChange={({ detail }) => setFunctionName(detail.value)}/>
                                </FormField>
                                <FormField label="Descripción">
                                    <Input value={functionDescription} onChange={({ detail }) => setFunctionDescription(detail.value)}/>
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
                        <Container header={<Header variant="h2">Código de la función</Header>}>
                            <CodeEditor
                                ace={ace}
                                value={codeEditorValue}
                                language="javascript"
                                onDelayedChange={event => setCodeEditorValue(event.detail.value)}
                                preferences={codeEditorPreferences}
                                onPreferencesChange={event => setCodeEditorPreferences(event.detail)}
                                loading={codeEditorLoading}
                                i18nStrings={codeEditorI18nStrings}
                                themes={{ light: ['cloud_editor'], dark: ['cloud_editor_dark'] }}
                            />
                        </Container>
                    ),
                    isOptional: false
                },
                {
                    title: "Review and launch",
                    content: (
                        <SpaceBetween size="xs">
                            <Header
                                variant="h3"
                                actions={
                                    <Button
                                        onClick={() => setActiveStepIndex(0)}
                                    >
                                        Edit
                                    </Button>
                                }
                            >
                                Step 1: Instance type
                            </Header>
                            <Container
                                header={
                                    <Header variant="h2">
                                        Container title
                                    </Header>
                                }
                            >
                                <ColumnLayout
                                    columns={2}
                                    variant="text-grid"
                                >
                                    <div>
                                        <Box variant="awsui-key-label">
                                            First field
                                        </Box>
                                        <div>Value</div>
                                    </div>
                                    <div>
                                        <Box variant="awsui-key-label">
                                            Second Field
                                        </Box>
                                        <div>Value</div>
                                    </div>
                                </ColumnLayout>
                            </Container>
                        </SpaceBetween>
                    )
                }
            ]}
        />
    );
}

export default FunctionCreatorSteps;
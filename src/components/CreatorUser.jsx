import React from 'react';
import {
    Container, FormField,
    Header, Input, Link,
    Checkbox,
    DatePicker,
    ProgressBar,
} from "@cloudscape-design/components";
import Wizard from "@cloudscape-design/components/wizard";
import SpaceBetween from "@cloudscape-design/components/space-between";


function CreatorUser({setItems}) {
    const [activeStepIndex, setActiveStepIndex] = React.useState(0)

    const [name, setName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [date, setDate] = React.useState("");
    const [telefono, setTelefono] = React.useState("");
    const [pais, setPais] = React.useState("");
    const [provincia, setProvincia] = React.useState("");
    const [user, setUser] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [checked, setChecked] = React.useState(false);

    const validateSubmit = () => {
        if (user !== "" && password !== "" && checked) {
            console.log(exportFunctionToJson())
        } else {
            // item para flashbar en página layout
                setItems([{
                type: "info",
                dismissible: true,
                dismissLabel: "Dismiss message",
                onDismiss: () => setItems([]),
                content: "Complete todos los campos y acepte los términos y condiciones antes de continuar.",
                id: "message_2"
            }]);
            console.log("Complete todos los campos antes de continuar.")
        }
    }

    const validateNext = (event) => {
        const requestedStepIndex = event.detail.requestedStepIndex;
        switch (activeStepIndex) {
            case 0:
                if (name !== "" && lastName !== "" && email !== "" && date !== "") {
                    setItems([])
                    setActiveStepIndex(requestedStepIndex)
                    break
                } else {
                    // item para flashbar en página layout
                        setItems([{
                        type: "info",
                        dismissible: true,
                        dismissLabel: "Dismiss message",
                        onDismiss: () => setItems([]),
                        content: "Complete todos los campos antes de continuar.",
                        id: "message_1"
                    }]);
                    console.log("Complete todos los campos antes de continuar.")
                    break
                }
            case 1:
                setActiveStepIndex(requestedStepIndex)
                break
            case 2:
                setActiveStepIndex(requestedStepIndex)
                break
            default:
                console.log("Error: Paso no válido")
                break
        }
    }


    // ejemplo para attibute-editor
    const [functionParameters, setFunctionParameters] = React.useState([]);


    function exportFunctionToJson() {

        let exportedFunctionParameters = {}
        functionParameters.forEach((parameter) => {
            if (parameter.type.value === "str") {
                exportedFunctionParameters[parameter.key] = {
                    "fieldtype": parameter.type.value,
                    "value": parameter.value
                }
            } else if (parameter.type.value === "int") {
                exportedFunctionParameters[parameter.key] = {
                    "fieldtype": parameter.type.value,
                    "value": Number(parameter.value)
                }
            } else if (parameter.type.value === "bool") {
                exportedFunctionParameters[parameter.key] = {
                    "fieldtype": parameter.type.value,
                    "value": parameter.value.value
                }
            }
        })

        const functionObject = {
            name: name,
            lastName: lastName,
            email: email,
            date: date,
            telefono: telefono,
            pais: pais,
            provincia: provincia,
            user: user,
            password: password, // faltaría hashear
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
                submitButton: "Crear usuario",
                optional: "opcional"
            }}
            onNavigate={validateNext}
            activeStepIndex={activeStepIndex}
            allowSkipTo
            onSubmit={validateSubmit}
            steps={[
                {
                    title: "Datos básicos",
                    description: "Introduzca sus datos para registrarse como usuario.",
                    content: (
                        <Container
                            header={
                                <Header variant="h2">
                                    Datos básicos
                                    <ProgressBar
                                        value={0}
                                        /* additionalInfo="Additional information"
                                        description="Progress bar description"
                                        label="Progress bar label" */
                                    />
                                </Header>
                            }
                        >
                            <SpaceBetween direction="vertical" size="s">
                                <FormField label="Nombre">
                                    <Input type="text"
                                           value={name}
                                           onChange={({detail}) => setName(detail.value)}/>
                                </FormField>
                                <FormField label="Apellidos">
                                    <Input type="text"
                                           value={lastName}
                                           onChange={({detail}) => setLastName(detail.value)}/>
                                </FormField>
                                <FormField label="Email">
                                    <Input type="email"
                                           value={email}
                                           onChange={({detail}) => setEmail(detail.value)}/>
                                </FormField>
                                <FormField label="Fecha de nacimiento">
                                    <DatePicker
                                        onChange={({detail}) => setDate(detail.value)}
                                        value={date}
                                        openCalendarAriaLabel={selectedDate =>
                                            "Choose certificate expiry date" +
                                            (selectedDate
                                                ? `, selected date is ${selectedDate}`
                                                : "")
                                        }
                                        locale="es-ES"
                                        startOfWeek={1}
                                        placeholder="AAAA/MM/DD"
                                    />
                                </FormField>
                            </SpaceBetween>
                        </Container>
                    ),
                    isOptional: false
                },
                {
                    title: "Datos opcionales",
                    description:
                        "Datos opcionales para registrarse como usuario.",
                    content: (
                        <Container
                            header={
                                <Header variant="h2">
                                    Datos opcionales
                                    <ProgressBar
                                        value={33}
                                        /* additionalInfo="Additional information"
                                        description="Progress bar description"
                                        label="Progress bar label" */
                                    />
                                </Header>
                            }
                        >
                            <SpaceBetween direction="vertical" size="s">
                                <FormField label="Número de teléfono">
                                    <Input type="number"
                                           value={telefono}
                                           onChange={({detail}) => setTelefono(detail.value)}/>
                                </FormField>
                                <FormField label="Pais de residencia">
                                    <Input type="text"
                                           value={pais}
                                           onChange={({detail}) => setPais(detail.value)}/>
                                </FormField>
                                <FormField label="Provincia">
                                    <Input type="text"
                                           value={provincia}
                                           onChange={({detail}) => setProvincia(detail.value)}/>
                                </FormField>
                            </SpaceBetween>
                        </Container>
                    ),
                    isOptional: true
                },
                {
                    title: "Usuario y contraseña",
                    description: "Usuario y contraseña con los que se iniciará sesión",
                    content: (
                        <Container
                            header={
                                <Header variant="h2">
                                    Usuario y contraseña
                                    <ProgressBar
                                        value={67}
                                        /* additionalInfo="Additional information"
                                        description="Progress bar description"
                                        label="Progress bar label" */
                                    />
                                </Header>
                            }
                        >
                            <SpaceBetween direction="vertical" size="s">
                                <FormField label="Nombre de usuario">
                                    <Input type="text"
                                           value={user}
                                           onChange={({detail}) => setUser(detail.value)}/>
                                </FormField>
                                <FormField label="Contraseña">
                                    <Input type="password"
                                           value={password}
                                           onChange={({detail}) => setPassword(detail.value)}/>
                                </FormField>
                                <FormField
                                    description={
                                        <>
                                            Por favor, lea nuestros{" "}
                                            <Link
                                                href="#"
                                                external="true"
                                                variant="primary"
                                                fontSize="body-s"
                                            >
                                                términos y condiciones
                                            </Link>{" "}
                                            y acepte.
                                        </>
                                    }
                                    label="Términos y condiciones"
                                >
                                    <Checkbox
                                        onChange={({detail}) =>
                                            setChecked(detail.checked)
                                        }
                                        checked={checked}
                                    >
                                        Estoy de acuerdo con los términos y condiciones
                                    </Checkbox>
                                </FormField>
                                {/*                                <Checkbox
                                    onChange={({detail}) =>
                                        setChecked(detail.checked)
                                    }
                                    checked={checked}
                                >
                                    Estoy de acuerdo con los términos y condiciones
                                </Checkbox>*/}
                            </SpaceBetween>
                        </Container>
                    ),
                    isOptional: false
                },
            ]}
        />
    );
}

export default CreatorUser;
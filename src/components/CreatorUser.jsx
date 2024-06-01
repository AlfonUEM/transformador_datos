import React, {useState} from 'react';
import {
    Container, FormField,
    Header, Input, Link,
    Checkbox,
    DatePicker,
    ProgressBar,
    Modal, Box, Button,
} from "@cloudscape-design/components";
import Wizard from "@cloudscape-design/components/wizard";
import SpaceBetween from "@cloudscape-design/components/space-between";
import {apiRegisterUser} from "../utils/API";


function CreatorUser({addNotificationItem}) {
    const [activeStepIndex, setActiveStepIndex] = React.useState(0)
    const [loading, setLoading] = useState(false);

    const [name, setName] = React.useState("")
    const [surname, setSurname] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [birthdate, setBirthdate] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [country, setCountry] = React.useState("");
    const [province, setProvince] = React.useState("");
    const [user, setUser] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [repassword, setRePassword] = React.useState("");
    const [checked, setChecked] = React.useState(false);

    const [nameFormFieldError, setNameFormFieldError] = React.useState("")
    const [surnameFormFieldError, setSurnameFormFieldError] = React.useState("")
    const [emailFormFieldError, setEmailFormFieldError] = React.useState("")
    const [birthdateFormFieldError, setBirthdateFormFieldError] = React.useState("")
    const [userFormFieldError, setUserFormFieldError] = React.useState("");
    const [passwordFormFieldError, setPasswordFormFieldError] = React.useState("");
    const [repasswordFormFieldError, setRePasswordFormFieldError] = React.useState("");
    const [checkedFormFieldError, setCheckedFormFieldError] = React.useState("");

    // Verifica que la contraseña tenga una longitud mínima de 8, una minúscula, una mayuscula, un número y un símbolo
    function ValidatePassword(password) {
        if (password.length < 8) {
            return false;
        }
        if (!/[a-z]/.test(password)) {
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            return false;
        }
        if (!/\d/.test(password)) {
            return false;
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            return false;
        }
        return true;
    }

    function validateEmail (email)  {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const validateSubmit = () => {
        if (user !== "" && password !== "" && repassword !== "" && checked) {
            if (!ValidatePassword(password)) {
                setPasswordFormFieldError("La contraseña debe tener mínimo 8 carácteres," +
                    " una minúscula, una mayuscula, un número y un símbolo.")
            } else {
                if (password === repassword) {
                    setLoading(true)
                    apiRegisterUser(user,password,name,surname,email,birthdate,phone,country,province).then(response =>{
                        if(response.status === 200){
                            addNotificationItem({
                                type: "success",
                                content: "Usuario creada correctamente",
                            });
                            setLoading(false)
                            window.location.href = '#';
                        }else if(response.status === 409) {
                            setUserFormFieldError("Usuario existente, elija otra nombre de usuario")
                        }else {
                            addNotificationItem({
                                type: "error",
                                content: "Error al crear usuario",
                            });
                        }
                        setLoading(false)
                    });
                } else {
                    setRePasswordFormFieldError("Las contraseñas introducidas deben ser iguales")
                    setLoading(false)
                }
            }
        } else {
            if (user === "") {
                setUserFormFieldError("El usuario no puede estar vacío")
            }
            if (password === "") {
                setPasswordFormFieldError("La contraseña no puede estar vacía")
            }
            if (repassword === "") {
                setRePasswordFormFieldError("Repetir contraseña no puede estar vacío")
            }
            if (checked === false) {
                setCheckedFormFieldError("Debe aceptar los terminos y condiciones")
            }
        }
    }

    const validateNext = (event) => {
        const requestedStepIndex = event.detail.requestedStepIndex;
        switch (activeStepIndex) {
            case 0:
                if (name !== "" && surname !== "" && email !== "" && birthdate !== "") {
                    if (!validateEmail(email)) {
                        setEmailFormFieldError("Debe introducir una dirección de email correcta")

                    } else {
                        setActiveStepIndex(requestedStepIndex)
                    }
                    break
                } else {
                    if (name === "") {
                        setNameFormFieldError("El nombre no puede estar vacío")
                    }
                    if (surname === "") {
                        setSurnameFormFieldError("Los apellidos no pueden estar vacíos")
                    }
                    if (email === "") {
                        setEmailFormFieldError("El email no puede estar vacío")
                    }
                    if (birthdate === "") {
                        setBirthdateFormFieldError("La fecha no puede estar vacía")
                    }
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

    // reseteo error campos al escribir
    function validatedSetName(value) {
        if (value !== "") {
            setNameFormFieldError("");
        }
        setName(value);
    }

    function validatedSetSurname(value) {
        if (value !== "") {
            setSurnameFormFieldError("");
        }
        setSurname(value);
    }

    function validatedSetEmail(value) {
        if (value !== "") {
            setEmailFormFieldError("");
        }
        setEmail(value);
    }

    function validatedSetBirthdate(value) {
        if (value !== "") {
            setBirthdateFormFieldError("");
        }
        setBirthdate(value);
    }

    function validatedSetUser(value) {
        if (value !== "") {
            setUserFormFieldError("");
        }
        setUser(value);
    }

    function validatedSetPassword(value) {
        if (value !== "") {
            setPasswordFormFieldError("");
        }
        setPassword(value);
    }

    function validatedSetRePassword(value) {
        if (value !== "") {
            setRePasswordFormFieldError("");
        }
        setRePassword(value);
    }

    function validatedSetchecked(value) {
        if (value !== "") {
            setCheckedFormFieldError("");
        }
        setChecked(value);
    }


    const [visible, setVisible] = React.useState(false);

    const cancelModal = () => {
        setVisible(false);
    }
    const confirmModal = () => {
        window.location.href = '#';
    }
    const cancelHandler = () => {
        setVisible(true);
    };

    return (
        <>
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
                    optional: "opcional",
                    submitButtonLoadingAnnouncement:"Creando usuario"
                }}
                isLoadingNextStep={loading}
                onNavigate={validateNext}
                activeStepIndex={activeStepIndex}
                allowSkipTo
                onCancel={cancelHandler}
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
                                    <FormField label="Nombre" errorText={nameFormFieldError}>
                                        <Input type="text"
                                               value={name}
                                               onChange={({detail}) => validatedSetName(detail.value)}/>
                                    </FormField>
                                    <FormField label="Apellidos" errorText={surnameFormFieldError}>
                                        <Input type="text"
                                               value={surname}
                                               onChange={({detail}) => validatedSetSurname(detail.value)}/>
                                    </FormField>
                                    <FormField label="Email" errorText={emailFormFieldError}>
                                        <Input type="email"
                                               value={email}
                                               onChange={({detail}) => validatedSetEmail(detail.value)}/>
                                    </FormField>
                                    <FormField label="Fecha de nacimiento" errorText={birthdateFormFieldError}>
                                        <DatePicker
                                            onChange={({detail}) => validatedSetBirthdate(detail.value)}
                                            value={birthdate}
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
                                               value={phone}
                                               onChange={({detail}) => setPhone(detail.value)}/>
                                    </FormField>
                                    <FormField label="Pais de residencia">
                                        <Input type="text"
                                               value={country}
                                               onChange={({detail}) => setCountry(detail.value)}/>
                                    </FormField>
                                    <FormField label="Provincia">
                                        <Input type="text"
                                               value={province}
                                               onChange={({detail}) => setProvince(detail.value)}/>
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
                                    <FormField label="Nombre de usuario" errorText={userFormFieldError}>
                                        <Input type="text"
                                               value={user}
                                               onChange={({detail}) => validatedSetUser(detail.value)}/>
                                    </FormField>
                                    <FormField label="Contraseña" errorText={passwordFormFieldError}>
                                        <Input type="password"
                                               value={password}
                                               onChange={({detail}) => validatedSetPassword(detail.value)}/>
                                    </FormField>
                                    <FormField label="Repita la contraseña" errorText={repasswordFormFieldError}>
                                        <Input type="password"
                                               value={repassword}
                                               onChange={({detail}) => validatedSetRePassword(detail.value)}/>
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
                                        errorText={checkedFormFieldError}
                                    >
                                        <Checkbox
                                            onChange={({detail}) =>
                                                validatedSetchecked(detail.checked)
                                            }
                                            checked={checked}
                                        >
                                            Estoy de acuerdo con los términos y condiciones
                                        </Checkbox>
                                    </FormField>
                                </SpaceBetween>
                            </Container>
                        ),
                        isOptional: false
                    },
                ]}
            />
            <Modal
                onDismiss={() => setVisible(false)}
                visible={visible}
                header="Cancelar registro usuario"
                closeAriaLabel="Cerrar ventana"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={cancelModal}>Cancel</Button>
                            <Button variant="primary" onClick={confirmModal}>Ok</Button>
                        </SpaceBetween>
                    </Box>
                }

            >
                ¿Está seguro de que desea cancelar el registro y volver a la página principal?
            </Modal>
        </>
    )
        ;
}

export default CreatorUser;
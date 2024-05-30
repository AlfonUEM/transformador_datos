import TopNavigation from "@cloudscape-design/components/top-navigation";
import React, {useState} from "react";
import {Box, Button, Modal, FormField, Input, Spinner} from "@cloudscape-design/components";
import SpaceBetween from "@cloudscape-design/components/space-between";
import {apiLogin, removeJWTfromLocalStorage, saveJWTinLocalStorage} from "../utils/API";

function MainNavBar({
                        isUserLoggedIn,
                        setIsUserLoggedIn,
                        userLoggedIn,
                        setUserLoggedIn
                    }) {

    const [visible, setVisible] = React.useState(false);
    const [user, setUser] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [userFormFieldError, setUserFormFieldError] = useState("")
    const [loading, setLoading] = useState(false);


    const cancelModal = () => {
        setVisible(false);
    }
    const confirmModal = () => {
        setLoading(true)
        apiLogin(user, password).then(response => {
            if (response.status === 200) {
                setUserLoggedIn(user)
                setIsUserLoggedIn(true)
                saveJWTinLocalStorage(response.body.jwt_token)
                setUser("")
                setPassword("")
                setVisible(false);
                setLoading(false)
                window.location.href = '#';
            } else {
                setUserFormFieldError("Usuario y/o contraseña incorrectos")
                setLoading(false)
            }
        });
    }

    const loginClick = (detail) => {
        if (detail.detail.id === 'login') {
            setVisible(true);
        }
    };

    function singOffClick() {
        console.log("Cerrar sesión")
        removeJWTfromLocalStorage()
        setUserLoggedIn("Sin conectar")
        setIsUserLoggedIn(false)
    }

    function validatedSetUser(value) {
        if (value !== "") {
            setUserFormFieldError("");
        }
        setUser(value);
    }

    function validatedSetPassword(value) {
        if (value !== "") {
            setUserFormFieldError("");
        }
        setPassword(value);
    }

    return (
        <>
            <TopNavigation
                identity={{
                    href: "#",
                    title: "Maestro Codificador",
                    logo: {
                        src: "/maestro_codificador_logo_grande.png",
                        alt: "logo"
                    }
                }}
                utilities={[
                    {
                        type: "menu-dropdown",
                        text: userLoggedIn,
                        description: isUserLoggedIn ? "Finalizar sesión" : "Registrese o inicie sesión",
                        iconName: "user-profile",
                        items: isUserLoggedIn ?
                            [{id: "signOff", text: "Cerrar sesión", onItemClick: singOffClick}]
                            :
                            [
                                {id: "newaccount", text: "Registrarse", href: "/#createUser"},
                                {id: "login", text: "Iniciar sesión", onItemClick: loginClick},
                            ],
                        onItemClick: isUserLoggedIn ? singOffClick : loginClick,
                    }
                ]}
            />
            <Modal
                onDismiss={() => setVisible(false)}
                visible={visible}
                header="Inicio sesión"
                closeAriaLabel="Cerrar ventana"
                size="small"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={cancelModal} disabled={loading}>Cancel</Button>
                            <Button variant="primary" onClick={confirmModal} disabled={loading}>{loading ?
                                <Spinner/> : 'Ok'}</Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <FormField label="Usuario" errorText={userFormFieldError}>
                    <Input type="text"
                           value={user}
                           onChange={({detail}) => validatedSetUser(detail.value)}/>
                </FormField>
                <FormField label="Contraseña" errorText={userFormFieldError}>
                    <Input type="password"
                           value={password}
                           onChange={({detail}) => validatedSetPassword(detail.value)}/>
                </FormField>
            </Modal>
        </>
    );
}


export default MainNavBar;
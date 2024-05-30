import React from "react";
import {FormField, Input, Select} from "@cloudscape-design/components";
import SpaceBetween from "@cloudscape-design/components/space-between";


function FunctionParametersForm(props){

    function generateFormFromParameters(){
        const paramsState = props.dndState.activeFunctions[props.functionId]["jsParameters"];
        let paramsFormList = [];
        for (let parameter in paramsState) {
            if(paramsState[parameter]["fieldtype"] === "str") {
                paramsFormList.push(
                    <FormField label={parameter}>
                        <Input
                            value={paramsState[parameter]["value"]}
                            onChange={event => {
                                    let paramsStateUpdated = {...paramsState};
                                    paramsStateUpdated[parameter]["value"] = event.detail.value;
                                props.updateFunctionParameters(props.functionId, paramsStateUpdated);
                                }
                            }
                        />
                    </FormField>
                )
            }else if(paramsState[parameter]["fieldtype"] === "int"){
                paramsFormList.push(
                    <FormField label={parameter}>
                        <Input
                            value={paramsState[parameter]["value"]}
                            //value={props.functionId}
                            onChange={event => {
                                console.log("JODER");
                                console.log(props.dndState);
                                console.log(props.functionId);
                                let paramsStateUpdated = {...paramsState};
                                paramsStateUpdated[parameter]["value"] = event.detail.value;
                                props.updateFunctionParameters(props.functionId, paramsStateUpdated);
                            }
                            }
                        />
                    </FormField>
                )
            }else if(paramsState[parameter]["fieldtype"] === "bool"){

                let selectedOption = {};
                if(paramsState[parameter]["value"]===true) {
                    selectedOption = {label: "Verdadero", value: true}
                }else{
                    selectedOption = {label: "Falso", value: false}
                }
                paramsFormList.push(
                    <FormField label={parameter}>
                        <Select
                            selectedOption={selectedOption}
                            onChange={({ detail }) => {
                                    let paramsStateUpdated = {...paramsState};
                                    paramsStateUpdated[parameter]["value"] = detail.selectedOption.value;
                                    props.updateFunctionParameters(props.functionId, paramsStateUpdated);
                                }
                            }
                            options={[
                                { label: "Verdadero", value: true },
                                { label: "Falso", value: false },
                            ]}
                        />
                    </FormField>
                )
            }
        }
        return <SpaceBetween size="l">{paramsFormList}</SpaceBetween>;
    }

    return(
        generateFormFromParameters()
    );

}
export default FunctionParametersForm
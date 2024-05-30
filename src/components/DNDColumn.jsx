import React from 'react';
import DNDFunction from "./DNDFunction";
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {Container, Header, TextContent} from "@cloudscape-design/components";
import Button from "@cloudscape-design/components/button";


const FunctionsList = styled.div`
  padding: 0px;
`;

const Title = styled.h3`
  padding: 1px;
`;
export default class DNDColumn extends React.Component {
    render() {
        return (
            <Container>
                <Header variant="h4" actions={
                    this.props.column.id === "active_functions_column" && this.props.isUserLoggedIn &&
                        <>
                        <Button
                            iconSvg={<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                                          fill="currentColor" className="bi bi-save" viewBox="0 0 16 16">
                                <path
                                    d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1z"/>
                            </svg>
                            }
                            variant="inline-icon"
                            onClick={() => this.props.openSaveActiveFunctionsModal()}/>
                            <Button iconName="folder-open" variant="inline-icon"
                                    onClick={() => this.props.openLoadActiveFunctionsModal()}/>
                        </>
                }>{this.props.column.title}</Header>
                {this.props.column.id === "active_functions_column" &&
                    <TextContent><small>Arrastre aquí las funciones que desee aplicar</small></TextContent>}
                {this.props.column.id === "private_functions_column" && this.props.privateFunctionsColumnInstructions}
                <br/>
                <Droppable droppableId={this.props.column.id} isDropDisabled={this.props.isDropDisabled}>
                    {provided => (
                        <FunctionsList ref={provided.innerRef} {...provided.droppableProps}>
                            {this.props.dndFunctions.map((dndFunction, index) => <DNDFunction index={index}
                                                                                              key={dndFunction.id}
                                                                                              dndState={this.props.dndState}
                                                                                              dndFunction={dndFunction}
                                                                                              currentColumn={this.props.column.id}
                                                                                              updateFunctionParameters={this.props.updateFunctionParameters}/>)}
                            {provided.placeholder}
                        </FunctionsList>
                    )}
                </Droppable>
            </Container>

        );
    }
}

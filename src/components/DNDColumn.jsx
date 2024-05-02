import React from 'react';
import DNDFunction from "./DNDFunction";
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {Container, Box, Header} from "@cloudscape-design/components";


const FunctionsList = styled.div`
  padding: 0px;
`;

/*const DNDColumnContainer = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;*/

const Title = styled.h3`
  padding: 1px;
`;
export default class DNDColumn extends React.Component {
    render() {
        return (
                <Container>

                    <Header variant="h4">{this.props.column.title}</Header><br/>
                    <Droppable droppableId={this.props.column.id} isDropDisabled={this.props.isDropDisabled}>
                        {provided => (
                            <FunctionsList ref={provided.innerRef} {...provided.droppableProps}>
                                {this.props.dndFunctions.map((dndFunction, index) => <DNDFunction index={index} key={dndFunction.id} dndFunction={dndFunction} />)}
                                {provided.placeholder}
                            </FunctionsList>
                        )}
                    </Droppable>
                </Container>

        );
    }
}

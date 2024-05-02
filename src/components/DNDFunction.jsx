import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const FunctionContainer = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

export default class DNDFunction extends React.Component {

    render() {
        return (
            <Draggable draggableId={this.props.dndFunction.id} index={this.props.index}>
                {provided => (
                    <FunctionContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        {this.props.dndFunction.content}
                    </FunctionContainer>
                )}
            </Draggable>
        );
    }
}

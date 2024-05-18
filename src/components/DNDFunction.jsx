import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {Grid} from "@cloudscape-design/components";
import Button from "@cloudscape-design/components/button";
import FunctionSettingsModal from "./FunctionSettingsModal";

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
            <Draggable draggableId={this.props.dndFunction.id} index={this.props.index} key={this.props.dndFunction.id}>
                {provided => (
                    <FunctionContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        {this.props.currentColumn === "active_functions_column" ?
                            <Grid gridDefinition={[{colspan: 10}, {colspan: 2}]}>
                                <div>
                                {this.props.dndFunction.content}
                                </div>
                                <div>
                                    <FunctionSettingsModal dndState={this.props.dndState} functionId={this.props.dndFunction.id} functionName={this.props.dndFunction.content} functionParameters={this.props.dndFunction.jsParameters} updateFunctionParameters={this.props.updateFunctionParameters}/>
                                </div>
                            </Grid>
                            :
                            this.props.dndFunction.content

                        }
                    </FunctionContainer>
                )}
            </Draggable>
        );
    }
}

import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ListItem from '../../../../../Interfaces/ListItem'

import './ListItemEl.scss'

interface ListItemElProps {
  listItem: ListItem
  clickCheckBoxHandler: (listItemName: string) => void
  key: any
}

interface ListItemElState {}

export default class ListItemEl extends React.Component<ListItemElProps, ListItemElState> {
  componentDidMount() {
  }

  clickEmit = (htmlForName: string):void => {
    const element: HTMLElement = document.querySelector('[for="'+htmlForName+'"]') as HTMLElement        
    if (element !== null) {
      element.click()
    }
  }

  render() {
    let classes: string = this.props.listItem.clicked ? 'ListItemEl active' : 'ListItemEl'

    return (
      <Container className={classes}>
        <Row className="form-group listItemBlock">
          <Col xs={9} className="d-flex justify-content-start">
            <label htmlFor={this.props.listItem.title}>
              {this.props.listItem.title}
            </label>
          </Col>
          <Col xs={3} className="d-flex justify-content-end align-items-center">
            <input
              type="radio"
              className="form-check-input"
              name="addressCafeList"
              id={this.props.listItem.title}
              defaultChecked={this.props.listItem.clicked}
              onChange={() => this.props.clickCheckBoxHandler(this.props.listItem.title)}
            />
            <div 
              className="fake__checkbox" 
              onClick={():void => {this.clickEmit(this.props.listItem.title)}}
            > 
            </div>       
          </Col>
        </Row>
      </Container>
    )
  }
}

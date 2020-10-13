import React from 'react'
import { Container } from 'react-bootstrap'

import './Menu.scss'

interface MenuProps {}

interface MenuState {}

export default class Menu extends React.Component<MenuProps, MenuState> {
  constructor(props:MenuProps){
    super(props)
    // console.log(props)
  }

  render() {
    return (
      <Container fluid className="Menu p-0 m-0">
        <h1>Menu</h1>
      </Container>
    )
  }
}

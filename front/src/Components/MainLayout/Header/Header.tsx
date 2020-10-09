import React from 'react'
import { Container } from 'react-bootstrap'
import './Header.scss'
import HeaderDown from './HeaderDown/HeaderDown'
import HeaderUp from './HeaderUp/HeaderUp'

interface HeaderProps {}

interface HeaderState {}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  render() {
    return (
      <Container fluid className="Header p-0 m-0">
        <HeaderUp></HeaderUp>
        <HeaderDown/>
      </Container>
    )
  }
}
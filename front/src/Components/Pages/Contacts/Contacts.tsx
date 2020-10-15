import React from 'react'
import { Container } from 'react-bootstrap'

import './Contacts.scss'

interface ContactsProps {}

interface ContactsState {}

export default class Contacts extends React.Component<ContactsProps, ContactsState> {
  render() {
    return (
      <Container className="Contacts p-0 m-0 mt-4">
        <h1>Contacts</h1>
      </Container>
    )
  }
}

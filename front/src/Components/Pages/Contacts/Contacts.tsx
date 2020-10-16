import React from 'react'
import { Container } from 'react-bootstrap'

import './Contacts.scss'

interface ContactsProps {}

interface ContactsState {}

export default class Contacts extends React.Component<ContactsProps, ContactsState> {
  render() {
    return (
      <div className="contacts container mt-4">
        <h1>Contacts</h1>
        <div className="row">
          <div className="col-4"></div>
          <div className="col-8"></div>
        </div>
      </div>
    )
  }
}

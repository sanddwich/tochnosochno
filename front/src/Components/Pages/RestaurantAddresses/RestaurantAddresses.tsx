import React from 'react'
import { Container } from 'react-bootstrap'

import './RestaurantAddresses.scss'

interface RestaurantAddressesProps {}

interface RestaurantAddressesState {}

export default class RestaurantAddresses extends React.Component<RestaurantAddressesProps, RestaurantAddressesState> {
  render() {
    return (
      <Container className="RestaurantAddresses p-0 m-0">
        <h1>RestaurantAddresses</h1>
      </Container>
    )
  }
}

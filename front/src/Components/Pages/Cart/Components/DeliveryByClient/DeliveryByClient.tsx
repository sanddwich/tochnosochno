import React from 'react'
import { Container } from 'react-bootstrap'

import './DeliveryByClient.scss'

interface DeliveryByClientProps {}

interface DeliveryByClientState {
  isDelivery: boolean
}

export default class DeliveryByClient extends React.Component<DeliveryByClientProps, DeliveryByClientState> {
  constructor(props: DeliveryByClientProps) {
    super(props)
  }

  render() {
    return (
      <Container className="DeliveryByClient  mt-5">
        <div>DeliveryByClient</div>
      </Container>
    )
  }
}

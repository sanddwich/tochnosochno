import React from 'react'
import { Container } from 'react-bootstrap'

import './Sticker.scss'

interface StickerProps {
  title: string
  backgroundColor: string
}

interface StickerState {}

export default class Sticker extends React.Component<StickerProps, StickerState> {
  render() {
    return (
      <Container className="Sticker p-0 m-0" style={{backgroundColor: this.props.backgroundColor}}>
        {this.props.title}
      </Container>
    )
  }
}

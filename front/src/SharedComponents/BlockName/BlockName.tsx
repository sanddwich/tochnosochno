import React from 'react'
import { Container } from 'react-bootstrap'

import './BlockName.scss'

interface BlockNameProps {
  name: string
}

interface BlockNameState {}

export default class BlockName extends React.Component<BlockNameProps, BlockNameState> {
  render() {
    return (
      <div>
        <div className="NewItems__title">
          <h1>{this.props.name}</h1>
        </div>
        <div className="NewItems__underLineCont">
          <div className="NewItems__underLine"></div>
        </div>
      </div>
    )
  }
}

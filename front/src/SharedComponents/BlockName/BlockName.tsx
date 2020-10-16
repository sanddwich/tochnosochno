import React from 'react'

import './BlockName.scss'

interface BlockNameProps {
  name: string
}

interface BlockNameState {}

export default class BlockName extends React.Component<BlockNameProps, BlockNameState> {
  render() {
    return (
      <div className="BlockName">
        <div className="BlockName__cont">
          <div className="BlockName__title">
            <h1>{this.props.name}</h1>
          </div>
          <div className="BlockName__underLineCont">
            <div className="BlockName__underLine"></div>
          </div>
        </div>
      </div>
    )
  }
}

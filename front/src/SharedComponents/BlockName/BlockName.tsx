import React from 'react'

import './BlockName.scss'

interface BlockNameProps {
  name: string
  fontSize?: string
}

interface BlockNameState {}

export default class BlockName extends React.Component<BlockNameProps, BlockNameState> {
  render() {
    return (
      <div className="BlockName">
        <div className="BlockName__cont">
          <div className="BlockName__underLine"></div>
          <div className="BlockName__title">
            <h1 style={{ fontSize: this.props.fontSize }}>{this.props.name}</h1>
          </div>
          {/* <div className="BlockName__underLineCont"> */}

          {/* </div> */}
        </div>
      </div>
    )
  }
}

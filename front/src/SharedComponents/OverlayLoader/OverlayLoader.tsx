import React from 'react'

import './OverlayLoader.scss'

interface OverlayLoaderProps {
  dark?: boolean
}

interface OverlayLoaderState {}

export default class OverlayLoader extends React.Component<OverlayLoaderProps, OverlayLoaderState> {
  constructor(props: OverlayLoaderProps) {
    super(props)
  }

  render() {
    return (
      <div className="OverlayLoader text-center">
        <div className="OverlayLoader__inner">
          <div className="OverlayLoader__content">
            <span className="OverlayLoader__spinner"></span>
          </div>
        </div>
      </div>
    )
  }
}

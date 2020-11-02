import React from 'react'

import './ScreenLoader.scss'

interface ScreenLoaderProps {}

interface ScreenLoaderState {}

export default class ScreenLoader extends React.Component<ScreenLoaderProps, ScreenLoaderState> {
  constructor(props: ScreenLoaderProps) {
    super(props)
  }

  render() {
    return (
      <div className="ScreenLoader text-center">
        <div className="ScreenLoader__spinner"></div>
      </div>
    )
  }
}

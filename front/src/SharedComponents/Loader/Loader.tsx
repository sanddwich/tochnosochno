import React from 'react'

import './Loader.scss'

interface LoaderProps {}

interface LoaderState {
  isDelivery: boolean
}

export default class Loader extends React.Component<LoaderProps, LoaderState> {
  constructor(props: LoaderProps) {
    super(props)
  }

  render() {
    return (
      <div className="Loader text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
}

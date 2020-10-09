import React from 'react'
import './App.scss'
// import { MainLayout } from './Components/MainLayout/MainLayout'
import { connect } from 'react-redux'
import { getCustomer } from './Redux/actions/auth'
import { clearOrderError } from './Redux/actions/order'
import MainLayout from './Components/MainLayout/MainLayout'
// import { Alert } from 'react-bootstrap'

interface AppState {
  showAlert: boolean
}

interface AppProps {
  clearOrderError: () => {}
  errorOrder: string
  getCustomer: any
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
    this.state = {
      showAlert: !!this.props.errorOrder,
    }
  }
  componentDidMount() {
    this.props.getCustomer()
  }

  setShow = () => {
    this.props.clearOrderError()
  }

  render() {
    return (
      <div className="App">
        <MainLayout />
      </div>
    )
  }
}

const mapDispatchToProps = {
  getCustomer,
  clearOrderError,
}

const mapStateToProps = (state: any) => {
  return {
    errorOrder: state.order.error,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

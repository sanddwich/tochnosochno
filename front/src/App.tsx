import React from 'react'
import './App.scss'
import { MainLayout } from './Components/MainLayout/MainLayout'
import { connect } from 'react-redux'
import { getCustomer } from './Redux/actions/auth'
import { clearOrderError } from './Redux/actions/order'
import { Alert } from 'react-bootstrap'

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
        <Alert
          show={!!this.props.errorOrder}
          style={{ position: 'fixed', top: '10%', right: '20%', zIndex: 100000, lineHeight: '20px' }}
          variant="danger"
          onClose={() => this.setShow()}
          dismissible
        >
          {this.props.errorOrder}
        </Alert>
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

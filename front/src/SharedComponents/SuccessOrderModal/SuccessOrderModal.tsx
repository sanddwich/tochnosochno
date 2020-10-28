import React from 'react'
import { Container } from 'react-bootstrap'
import { RootState } from '../../Redux'
import { hideSuccessModal } from '../.././Redux/actions/app'

import './SuccessOrderModal.scss'
import { connect } from 'react-redux'

interface SuccessOrderModalProps {
  hideSuccessModal: () => void
  isShowSuccessModal: boolean
}

interface SuccessOrderModalState {}

class SuccessOrderModal extends React.Component<SuccessOrderModalProps, SuccessOrderModalState> {
  render() {
    console.log(this.props.isShowSuccessModal)
    return <div className="SuccessOrderModal">23123123</div>
  }
}

const mapDispatchToProps = {
  hideSuccessModal,
}

const mapStateToProps = (state: RootState) => {
  const { isShowSuccessModal } = state.app
  return {
    isShowSuccessModal,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuccessOrderModal)

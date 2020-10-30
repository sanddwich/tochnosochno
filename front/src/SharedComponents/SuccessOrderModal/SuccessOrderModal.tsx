import React from 'react'
import { Container } from 'react-bootstrap'
import { RootState } from '../../Redux'
import { hideSuccessModal, showSuccessModal } from '../.././Redux/actions/app'

import './SuccessOrderModal.scss'
import { connect } from 'react-redux'
import RoundButton from '../RoundButton/RoundButton'
import BlockName from '../BlockName/BlockName'

interface SuccessOrderModalProps {
  hideSuccessModal: () => void
  showSuccessModal: () => void
  isShowSuccessModal: boolean
}

interface SuccessOrderModalState {}

class SuccessOrderModal extends React.Component<SuccessOrderModalProps, SuccessOrderModalState> {
  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        {this.props.isShowSuccessModal ? (
          <div className="SuccessOrderModal">
            <div className="SuccessOrderModal__content">
              <div className="SuccessOrderModal__content__close">
                <RoundButton icon="icon_close.svg" backgroundColor="#F2F2F2" onClick={this.props.hideSuccessModal} />
              </div>
              <div className="SuccessOrderModal__content__body">
                <div className="SuccessOrderModal__content__image">
                  <img src="/images/icons/order_success.svg" alt="" />
                </div>

                <div className="SuccessOrderModal__content__text">
                  <div className="d-flex justify-content-center">
                    <BlockName fontSize="24px" name="Спасибо за заказ!" />
                  </div>
                  Мы уже начали готовить ваш заказ
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  hideSuccessModal,
  showSuccessModal,
}

const mapStateToProps = (state: RootState) => {
  const { isShowSuccessModal } = state.app
  return {
    isShowSuccessModal,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuccessOrderModal)

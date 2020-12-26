import React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../Redux'
import { hideTestModal } from '../../Redux/actions/app'
import BlockName from '../BlockName/BlockName'
import RoundButton from '../RoundButton/RoundButton'

import './TestModal.scss'

interface TestModalProps {
  hideTestModal: () => void

  isShowTestModal: boolean
}

interface TestModalState {
  show: boolean
}

class TestModal extends React.Component<TestModalProps, TestModalState> {
  constructor(props: TestModalProps) {
    super(props)
    this.state = {
      show: false,
    }
  }

  componentDidMount() {}

  hideTestModal = () => {
    this.setState({ show: false })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.show ? (
          <div className="TestModal ">
            <div className="TestModal__content ">
              <div className="TestModal__content__close">
                <RoundButton icon="icon_close.svg" backgroundColor="#F2F2F2" onClick={this.hideTestModal} />
              </div>
              <div className="TestModal__content__body">
                <div className="TestModal__content__image">
                  <img src="/images/icons/warning.svg" alt="" />
                </div>

                <div className="TestModal__content__text">
                  <div className="d-flex justify-content-center">
                    <BlockName fontSize="24px" name="Внимание!" />
                  </div>
                  Сайт работает в тестовом режиме. При возникновнеии проблем звоните по телефону 46-46-02.
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
  hideTestModal,
}

const mapStateToProps = (state: RootState) => {
  const { isShowTestModal } = state.app
  return {
    isShowTestModal,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestModal)

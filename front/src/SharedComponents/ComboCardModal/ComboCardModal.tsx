import React from 'react'
import { connect } from 'react-redux'
import { Col, Container, Row } from 'react-bootstrap'
import { RootState } from '../../Redux'
import { hideComboModal } from '../../Redux/actions/app'
import './ComboCardModal.scss'
import RoundButton from '../RoundButton/RoundButton'
import BlockName from '../BlockName/BlockName'
import ComboElement from './ComboElement/ComboElement'

interface ComboCardModalProps {
  hideComboModal: () => void
  showComboModal: boolean
}

interface ComboCardModalState {}

class ComboCardModal extends React.Component<ComboCardModalProps, ComboCardModalState> {
  render() {
    return (
      <React.Fragment>
        {this.props.showComboModal ? (
          <Container fluid className="ComboCardModal p-0 m-0 d-flex align-items-center">
            <Container className="ComboCardModal__body p-0">
              <Row className="ComboCardModal__closeButtonRow d-flex justify-content-end p-0 m-0">
                <div className="ComboCardModal__closeButtonCont position-relative">
                  <div className="ComboCardModal__closeButton">
                    <RoundButton icon="icon_close.svg" backgroundColor="#F2F2F2" onClick={this.props.hideComboModal} />
                  </div>
                </div>
              </Row>
              <Row className="ComboCardModal__Cont p-0 m-0">
                <Col md={6} className="ComboCardModal__leftColumn">

                  <Row>
                    <Col className="ComboCardModal__title">
                      <BlockName name="Комбо - 3 пиццы 25см" />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="ComboCardModal__descr">
                      ролл Сочный краб, ролл Сочный лосось, ролл Медовый лосось 637 г
                    </Col>
                  </Row>
                  <Row className="ComboCardModal__productsList d-flex flex-column p-3">
                    <ComboElement />
                    <ComboElement />
                    <ComboElement />
                  </Row>
                </Col>

                <Col md={6} className="ComboCardModal__img p-0">
                  <img className="img-fluid" src="/images/combo1.jpg" alt=""/>
                </Col>
              </Row>
            </Container>
          </Container>
        ) : null}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  hideComboModal,
}

const mapStateToProps = (state: RootState) => {
  const { showComboModal } = state.app
  return {
    showComboModal: showComboModal,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComboCardModal)

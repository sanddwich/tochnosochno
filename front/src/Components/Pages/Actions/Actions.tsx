import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Category from '../../../Interfaces/Category'
import { RootState } from '../../../Redux'
import ComboCard from '../../../SharedComponents/ComboCard/ComboCard'
import SliderContainer from '../../../SharedComponents/SliderContainer/SliderContainer'

import './Actions.scss'

interface ActionsProps {
  menu: Category[]
  showComboModal: boolean
}

interface ActionsState {
  combos: Category[]
}

class Actions extends React.Component<ActionsProps, ActionsState> {
  constructor(props: ActionsProps) {
    super(props)
    this.state = {
      combos: this.props.menu.filter((cat) => cat.isCombo === true && cat.isSiteDisplay) || [],
    }
  }

  componentDidMount() {
    console.log(this.state.combos)
  }

  render() {
    return (
      <Container fluid className="Actions p-0 m-0">
        <SliderContainer />
        <Container className="p-0 m-0">
          <Row className="p-0 m-0">
            {this.state.combos.map((comboEl, index) => {
              return (
                <Col key={index} xs={4} className="p-0 m-0">
                  <ComboCard combo={comboEl} />
                </Col>
              )
            })}
          </Row>
        </Container>
      </Container>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: RootState) => {
  const { menu } = state.menu
  const { showComboModal } = state.app
  return {
    menu,
    showComboModal,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Actions)

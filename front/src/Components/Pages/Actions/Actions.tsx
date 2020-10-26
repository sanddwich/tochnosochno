import React from 'react'
import { Container } from 'react-bootstrap'
import { connect } from 'react-redux'
import Category from '../../../Interfaces/Category'
import { RootState } from '../../../Redux'
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

  componentDidMount() {}

  render() {
    return (
      <Container fluid className="Actions p-0 m-0">
        <SliderContainer />
        <h1>Actions</h1>
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

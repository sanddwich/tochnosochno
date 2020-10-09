import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Category from '../../../../Interfaces/Category'
import { RootState } from '../../../../Redux'

import './HeaderDown.scss'

interface HeaderDownProps {
  menu: Category[]
}

interface HeaderDownState {
  activeMenu: number
}

class HeaderDown extends React.Component<HeaderDownProps, HeaderDownState> {
  constructor(props: HeaderDownProps) {
    super(props)
    this.state = {
      activeMenu: parseInt(this.props.menu[0].id) | 0,
    }
  }

  componentDidMount() {
    // console.log(this.props.menu)
  }

  activateLink = (id: number):void => {
    this.setState({
      activeMenu: id
    })
  }

  render() {
    return (
      <Container fluid className="HeaderDown p-0 m-0">
        <Container className="p-0 h-100">
          <Row className="p-0 m-0 h-100 d-flex justify-content-between">
            {this.props.menu.map((menuItem, index) => {
              return (
                <div
                  key={menuItem.id + index}
                  className="HeaderDown__menuEl h-100 d-flex align-items-center"
                  style={{borderBottom: parseInt(menuItem.id) === this.state.activeMenu ? '5px solid #FFCF25' : ''}}
                  onClick={() => {
                    this.activateLink(parseInt(menuItem.id))
                  }}
                >
                  {menuItem.name}
                </div>
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
  return {
    menu: menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderDown)

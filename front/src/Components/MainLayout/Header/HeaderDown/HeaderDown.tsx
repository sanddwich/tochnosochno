import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Category from '../../../../Interfaces/Category'
import { RootState } from '../../../../Redux'

import './HeaderDown.scss'

// Import Swiper React components
import SwiperCore, { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/swiper.scss'

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
      activeMenu: 0,
    }
  }

  componentDidMount() {}

  activateLink = (id: number): void => {
    this.setState({
      activeMenu: id,
    })
  }

  render() {
    return (
      <React.Fragment>
        <Container fluid className="HeaderDown p-0 m-0 d-none d-lg-flex">
          <Container className="p-0 h-100">
            <Row className="p-0 m-0 h-100 d-flex justify-content-between">
              {this.props.menu.map((menuItem, index) => {
                return (
                  <NavLink key={menuItem.id + index} to={`/menu/${menuItem.id}`} activeClassName="activatedLink">
                    <div
                      className="HeaderDown__menuEl h-100 d-flex align-items-center"
                      style={{
                        borderBottom: parseInt(menuItem.id) === this.state.activeMenu ? '5px solid #FFCF25' : '',
                      }}
                      // onClick={() => {
                      //   this.activateLink(parseInt(menuItem.id))
                      // }}
                    >
                      {menuItem.name}
                    </div>
                  </NavLink>
                )
              })}
            </Row>
          </Container>
        </Container>

        <Container fluid className="HeaderDownMobile p-0 m-0 d-flex d-lg-none">
          <Swiper slidesPerView={'auto'} spaceBetween={20} loop={true}>
            {this.props.menu.map((menuItem, index) => {
              return (
                <SwiperSlide key={menuItem.id + index}>
                  <NavLink to={`/menu/${menuItem.id}`} activeClassName="activatedLink">
                    <div className="HeaderDown__menuEl h-100 d-flex align-items-center">{menuItem.name}</div>
                  </NavLink>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </Container>
      </React.Fragment>
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

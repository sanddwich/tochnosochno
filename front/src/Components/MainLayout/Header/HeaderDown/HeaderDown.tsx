import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Category from '../../../../Interfaces/Category'
import { RootState } from '../../../../Redux'
import Select from 'react-select'
import OptionType from 'react-select'
import { setOrganization } from '../../../../Redux/actions/app'
import { getMenu } from '../../../../Redux/actions/menu'
import { clearDeliveryProduct } from '../../../../Redux/actions/order'
import './HeaderDown.scss'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import Organization from '../../../../Interfaces/Organization'

interface HeaderDownProps {
  organizations: Organization[]
  menu: Category[]
  organizationId: string
  setOrganization: (organizationId: string) => void
  getMenu: any
  clearDeliveryProduct: any
}

interface HeaderDownState {}

class HeaderDown extends React.Component<HeaderDownProps, HeaderDownState> {
  componentDidMount() {}

  handleCityChange = (inputValue: any, actionMeta: any) => {
    this.props.setOrganization(inputValue.value)
    this.props.getMenu()
    this.props.clearDeliveryProduct()
  }

  getCityIndex(options: any[], value: string) {
    let ind = -1
    options.forEach((option, index) => {
      if (option.value === value) {
        ind = index
      }
    })
    return ind
  }

  getCityOptions() {
    return this.props.organizations.map((organization) => {
      return {
        value: organization.id,
        label: organization.city,
      }
    })
  }

  render() {
    const options = this.getCityOptions()
    return (
      <React.Fragment>
        <Container fluid className="HeaderDown p-0 m-0 d-none d-lg-flex">
          <Container className="p-0 h-100">
            <Row className="p-0 m-0 h-100 d-flex justify-content-between">
              {this.props.menu.map((menuItem, index) => {
                if (menuItem.isSiteDisplay && !menuItem.isCombo) {
                  return (
                    <NavLink
                      className="hvr-float"
                      key={menuItem.id + index}
                      to={`/menu/${menuItem.id}`}
                      activeClassName="activatedLink"
                    >
                      <div className="HeaderDown__menuEl h-100 d-flex align-items-center">{menuItem.name}</div>
                    </NavLink>
                  )
                }
              })}
            </Row>
          </Container>
        </Container>

        <Container fluid className="HeaderDownMobile p-0 m-0 d-flex d-lg-none">
          {this.props.menu.length > 0 ? (
            <Swiper slidesPerView={'auto'} spaceBetween={5} loop={true}>
              {this.props.menu.map((menuItem, index) => {
                if (menuItem.isSiteDisplay && !menuItem.isCombo) {
                  return (
                    <SwiperSlide key={menuItem.id + index}>
                      <NavLink to={`/menu/${menuItem.id}`} activeClassName="activatedLink">
                        <div className="HeaderDown__menuEl h-100 d-flex justify-content-center align-items-center">
                          {menuItem.name}
                        </div>
                      </NavLink>
                    </SwiperSlide>
                  )
                }
              })}
            </Swiper>
          ) : null}
        </Container>
        <div className="d-flex justify-content-center">
          <div className="HeaderDown__selectCity">
            <Select
              onChange={this.handleCityChange}
              value={options[this.getCityIndex(options, this.props.organizationId)]}
              options={options}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}
const mapDispatchToProps = {
  setOrganization,
  getMenu,
  clearDeliveryProduct,
}

const mapStateToProps = (state: RootState) => {
  const { menu, organizations } = state.menu
  const { organizationId } = state.app
  return {
    menu: menu,
    organizationId,
    organizations,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderDown)

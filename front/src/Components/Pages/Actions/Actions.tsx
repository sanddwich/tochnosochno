import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Category from '../../../Interfaces/Category'
import { RootState } from '../../../Redux'
import ComboCard from '../../../SharedComponents/ComboCard/ComboCard'
import SliderContainer from '../../../SharedComponents/SliderContainer/SliderContainer'

import './Actions.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import BlockName from '../../../SharedComponents/BlockName/BlockName'
import CustomAlert from '../../../SharedComponents/CustomAlert/CustomAlert'

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

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
    // console.log(this.state.combos)
  }

  getSlidesNumber = (): number => {
    const clientDeviceWidth = document.documentElement.clientWidth

    if (clientDeviceWidth > 992) {
      return 3
    } else if (clientDeviceWidth > 576) {
      return 2
    } else {
      return 1
    }
  }

  getSlidesNumber2 = (): number => {
    if (this.state.combos.length == 2) {
      return 2
    } else {
      return 1
    }
  }

  renderArrowsNav = (): any => {
    if (this.state.combos.length > this.getSlidesNumber()) {
      return (
        <React.Fragment>
          <div className="Actions__arrows d-none d-md-flex justify-content-start">
            <div id="prewArrowCombo" className="Actions__arrow" style={{ paddingRight: 3 }}>
              <img src="/images/icons/arrowLeftFor45.svg" alt="" />
            </div>
            <div id="nextArrowCombo" className="Actions__arrow" style={{ paddingLeft: 3 }}>
              <img src="/images/icons/arrowRightFor45.svg" alt="" />
            </div>
          </div>

          <div className="Actions__arrows d-flex d-md-none justify-content-start">
            <div id="prewArrowCombo" className="Actions__arrow" style={{ paddingRight: 3 }}>
              <img src="/images/icons/arrowLeftMobileFor35.svg" alt="" />
            </div>
            <div id="nextArrowCombo" className="Actions__arrow" style={{ paddingLeft: 3 }}>
              <img src="/images/icons/arrowRightMobileFor35.svg" alt="" />
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

  render() {
    if (this.state.combos.length > 0) {
      return (
        <Container fluid className="Actions p-0 m-0">
          <SliderContainer />
          <Container className="p-0">
            <Row className="p-0 m-0 d-flex justify-content-between">
              <BlockName name="Акции" />

              {this.renderArrowsNav()}
            </Row>

            <Row className="p-0 m-0">
              <Swiper
                slidesPerView={
                  this.state.combos.length < this.getSlidesNumber() ? this.getSlidesNumber2() : this.getSlidesNumber()
                }
                loop={this.state.combos.length < this.getSlidesNumber() ? false : true}
                // spaceBetween={10}
                navigation={{
                  nextEl: '#nextArrowCombo',
                  prevEl: '#prewArrowCombo',
                }}
                pagination={{ clickable: true, el: '#paginationCombo' }}
              >
                {this.state.combos.map((comboEl, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <ComboCard combo={comboEl} />
                    </SwiperSlide>
                  )
                })}
              </Swiper>
              {this.state.combos.length > this.getSlidesNumber() ? (
                <Container fluid className="p-0 m-0 d-flex justify-content-center d-none">
                  <Row className="p-0 m-0 d-flex">
                    <div id="paginationCombo"></div>
                  </Row>
                </Container>
              ) : (
                ''
              )}
            </Row>
          </Container>
        </Container>
      )
    } else {
      return (
        <Container className="mt-5">
          <CustomAlert message="В разделе пока еще не присутствует активных акций!" show={true} variant="danger" />
        </Container>
      )
    }
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

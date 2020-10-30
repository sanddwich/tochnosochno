import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { showComboModal as showComboModalFunc } from '../../../../Redux/actions/app'

import './Banners.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import { connect } from 'react-redux'
import { RootState } from '../../../../Redux'
import Category from '../../../../Interfaces/Category'

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

interface BannersProps {
  menu: Category[]
  showComboModal: boolean
  showComboModalFunc: (combo: Category) => void
}

interface BannersState {}

class Banners extends React.Component<BannersProps, BannersState> {
  render() {
    return (
      <Container fluid className="Banners m-0 p-0">
        <Container className="d-none d-sm-block">
          <Row className="m-0 p-0">
            {this.props.menu.map((cat, index) => {
              if (cat.isCombo) {
                // console.log(cat) //Для просмотра ID категории для переименования слайдов
                return (
                  <Col
                    key={index}
                    xs={6}
                    className="Banners__img m-0 p-0"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.props.showComboModalFunc(cat)}
                  >
                    <img
                      className="img-fluid"
                      src={`/images/banners/${cat.id}.png`}
                      onError={(event) => {
                        const el = event.target as HTMLElement
                        el.setAttribute('src', '/images/banners/no-banner.jpg')
                      }}
                    />
                    <img src="/images/banners/banner1.jpg" className="img-fluid" alt="" />
                  </Col>
                )
              }
            })}
          </Row>
        </Container>

        <Container className="d-block d-sm-none">
          <Swiper
            // slidesPerView={'auto'}
            slidesPerView={1}
            loop={true}
            spaceBetween={10}
            pagination={{ clickable: true, el: '#paginationBanners' }}
          >
            {this.props.menu.map((cat, index) => {
              if (cat.isCombo) {
                // console.log(cat) //Для просмотра ID категории для переименования слайдов
                return (
                  <SwiperSlide
                    key={index}
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.props.showComboModalFunc(cat)}
                  >
                    <Container className="m-0 p-0 ">
                      <img
                        className="img-fluid"
                        src={`/images/banners/${cat.id}.png`}
                        onError={(event) => {
                          const el = event.target as HTMLElement
                          el.setAttribute('src', '/images/banners/no-banner.jpg')
                        }}
                      />
                    </Container>
                  </SwiperSlide>
                )
              }
            })}
          </Swiper>

          <Row className="p-0 m-0 d-flex justify-content-center">
            <div id="paginationBanners"></div>
          </Row>
        </Container>
      </Container>
    )
  }
}

const mapDispatchToProps = {
  showComboModalFunc,
}

const mapStateToProps = (state: RootState) => {
  const { menu } = state.menu
  const { showComboModal } = state.app
  return {
    menu,
    showComboModal,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Banners)

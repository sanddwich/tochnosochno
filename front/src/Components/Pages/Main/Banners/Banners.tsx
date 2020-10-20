import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import './Banners.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

interface BannersProps {}

interface BannersState {}

export default class Banners extends React.Component<BannersProps, BannersState> {
  render() {
    return (
      <Container fluid className="Banners m-0 p-0">
        <Container className="d-none d-sm-block">
          <Row className="m-0 p-0">
            <Col xs={6} className="Banners__img m-0 p-0">
              <img src="/images/banners/banner1.jpg" className="img-fluid" alt="" />
            </Col>
            <Col xs={6} className="Banners__img m-0 p-0">
              <img src="/images/banners/banner1.jpg" className="img-fluid" alt="" />
            </Col>
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
            {[1, 2].map((slide, index) => {
              return (
                <SwiperSlide key={index}>
                  <Container className="m-0 p-0 ">
                    <img src="/images/banners/banner1.jpg" className="img-fluid" alt="" />
                  </Container>
                </SwiperSlide>
              )
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

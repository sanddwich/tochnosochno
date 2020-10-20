import React from 'react'
import { Container, Row } from 'react-bootstrap'
import './MobSlider.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'

// install Swiper components
SwiperCore.use([Pagination, Autoplay])

interface MobSliderProps {}

interface MobSliderState {}

export default class MobSlider extends React.Component<MobSliderProps, MobSliderState> {
  render() {
    return (
      <React.Fragment>
        <Container fluid className="MobSlider p-0 m-0 mb-2">
          <Swiper
            loop={true}
            spaceBetween={10}
            // autoplay={{ delay: 5000 }}
            pagination={{ clickable: true, el: '#slidePaginationMob' }}
          >
            {[1, 2, 3, 4].map((slide, index) => {
              return (
                <SwiperSlide key={index}>
                  <Container fluid className="m-0 p-0 d-flex justify-content-center">
                    <img src="/images/slides/mob/slide1.jpg" className="img-fluid" alt="" />
                  </Container>
                </SwiperSlide>
              )
            })}
          </Swiper>
          <Row className="p-0 m-0 d-flex justify-content-center">
            <div id="slidePaginationMob"></div>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

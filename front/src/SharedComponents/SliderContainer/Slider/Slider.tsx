import React from 'react'
import { Container, Row } from 'react-bootstrap'
import './Slider.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

interface SliderProps {}

interface SliderState {}

export default class Slider extends React.Component<SliderProps, SliderState> {
  render() {
    return (
      <Container fluid className="Slider p-0 m-0">
        <Swiper
          loop={true}
          navigation={{
            nextEl: '#nextArrow',
            prevEl: '#prewArrow',
          }}
          spaceBetween={20}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true, el: '#pagination' }}
        >
          <SwiperSlide>
            <div className="Slider__slide">
              <img className="img-fluid" src="images/slides/slide1.jpg" alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="Slider__slide">
              <img className="img-fluid" src="images/slides/slide1.jpg" alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="Slider__slide">
              <img className="img-fluid" src="images/slides/slide1.jpg" alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="Slider__slide">
              <img className="img-fluid" src="images/slides/slide1.jpg" alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="Slider__slide">
              <img className="img-fluid" src="images/slides/slide1.jpg" alt="" />
            </div>
          </SwiperSlide>
        </Swiper>

        <Row className="Slider__actions m-0 p-0 d-flex justify-content-between">
          <div className="Slider__arrows">
            <div id="prewArrow" className="Slider__arrow" style={{ paddingRight: 3 }}>
              <img src="images/icons/arrow_left.svg" alt="" />
            </div>
            <div id="nextArrow" className="Slider__arrow" style={{ paddingLeft: 3 }}>
              <img src="images/icons/arrow_right.svg" alt="" />
            </div>
          </div>

          <div id="pagination" className="Slider__pagination"></div>
        </Row>
      </Container>
    )
  }
}

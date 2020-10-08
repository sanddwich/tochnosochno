import React from 'react'
import { Container } from 'react-bootstrap'
import './ComboSlider.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

// Import Swiper React components
import SwiperCore, { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'

// install Swiper components
SwiperCore.use([Navigation])

type ComboSliderState = {}

export default class ComboSlider extends React.Component<{}, ComboSliderState> {
  render() {
    return (
      <Container fluid className="ComboSlider">
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={20}
          loop={true}
          navigation={{
            nextEl: '#nextArrowCombo',
            prevEl: '#prewArrowCombo',
          }}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide>
            <div>
              <img src="images/combo1.png" alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img src="images/combo2.png" alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img src="images/combo3.png" alt="" />
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="position-relative">
          <div className="position-absolute d-flex justify-content-between" style={{ width: '90%', marginTop: '-145px',marginLeft:'-8px' }}>
            <div id="prewArrowCombo" className="sliderAngles d-inline-flex" style={{ paddingLeft: '8px' }}>
              <FontAwesomeIcon icon={faAngleLeft} color="#5EAD03" />
            </div>
            <div id="nextArrowCombo" className="sliderAngles d-inline-flex" style={{ paddingLeft: '11px' }}>
              <FontAwesomeIcon icon={faAngleRight} color="#5EAD03" />
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

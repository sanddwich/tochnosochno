import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { showComboModal as showComboModalFunc } from '../../../Redux/actions/app'
import './Slider.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import { RootState } from '../../../Redux'
import { connect } from 'react-redux'
import Category from '../../../Interfaces/Category'

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

interface SliderProps {
  menu: Category[]
  showComboModal: boolean
  showComboModalFunc: (combo: Category) => void
}

interface SliderState {}

class Slider extends React.Component<SliderProps, SliderState> {
  componentDidMount() {}

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
          pagination={{ clickable: true, el: '#sliderPagination' }}
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
                  <div id={cat.id} className="Slider__slide">
                    <img
                      className="img-fluid  hvr-shrink"
                      src={`/images/slides/${cat.id}.png`}
                      onError={(event) => {
                        const el = event.target as HTMLElement
                        el.setAttribute('src', '/images/slides/no-slide.png')
                      }}
                    />
                  </div>
                </SwiperSlide>
              )
            }
          })}
        </Swiper>

        <Row className="Slider__actions m-0 p-0 d-flex justify-content-between">
          <div className="Slider__arrows">
            <div id="prewArrow" className="Slider__arrow" style={{ paddingRight: 3 }}>
              <img src="/images/icons/arrow_left.svg" alt="" />
            </div>
            <div id="nextArrow" className="Slider__arrow" style={{ paddingLeft: 3 }}>
              <img src="/images/icons/arrow_right.svg" alt="" />
            </div>
          </div>

          <div id="sliderPagination" className="Slider__pagination"></div>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Slider)

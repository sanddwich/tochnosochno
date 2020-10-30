import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { showComboModal as showComboModalFunc } from '../../../Redux/actions/app'
import './MobSlider.scss'

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
SwiperCore.use([Pagination, Autoplay])

interface MobSliderProps {
  menu: Category[]
  showComboModal: boolean
  showComboModalFunc: (combo: Category) => void
}

interface MobSliderState {}

class MobSlider extends React.Component<MobSliderProps, MobSliderState> {
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
            {this.props.menu.map((cat, index) => {
              if (cat.isCombo) {
                // console.log(cat) //Для просмотра ID категории для переименования слайдов
                return (
                  <SwiperSlide
                    key={index}
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.props.showComboModalFunc(cat)}
                  >
                    <Container fluid className="m-0 p-0 d-flex justify-content-center">
                      <img
                        className="img-fluid"
                        src={`/images/slides/mob/${cat.id}.png`}
                        onError={(event) => {
                          const el = event.target as HTMLElement
                          el.setAttribute('src', '/images/slides/mob/slide1.jpg')
                        }}
                      />
                    </Container>
                  </SwiperSlide>
                )
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(MobSlider)

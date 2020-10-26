import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './CategorySlider.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import Category from '../../../../../Interfaces/Category'
import LongMenuItemMob from './LongMenuItemMob/LongMenuItemMob'
import _ from 'lodash'
import ShortMenuItemMob from './ShortMenuItemMob/ShortMenuItemMob'

// install Swiper components
SwiperCore.use([Pagination, Autoplay])

interface CategorySliderProps {
  longMenu: Category[]
  shortMenu: Category[]
}

interface CategorySliderState {
  longMenu: Category[]
  shortMenu: Category[]
}

const longBreakpoint: number = 2
const shortBreakpoint: number = 3

export default class CategorySlider extends React.Component<CategorySliderProps, CategorySliderState> {
  constructor(props: CategorySliderProps) {
    super(props)
    this.state = {
      longMenu: this.props.longMenu.filter(cat => !cat.isCombo && cat.isSiteDisplay) || [],
      shortMenu: this.props.shortMenu.filter(cat => !cat.isCombo && cat.isSiteDisplay) || [],
    }
  }

  componentDidMount() {}

  slideGenerator = (categories: Category[], separator: number): any => {
    const resultCategories = _.chunk(categories, separator)
    // console.log(resultCategories)
    return resultCategories.map((pool, index) => {
      return (
        <SwiperSlide key={index}>
          <Container fluid className="m-0 p-0">
            {pool.map((category, index) => {
              if (separator === longBreakpoint) {
                return <LongMenuItemMob key={category.id + index} category={category} />
              }
              if (separator === shortBreakpoint) {
                return <ShortMenuItemMob key={category.id + index} category={category} />
              }
              return <div key={category.id + index}></div>
            })}
          </Container>
        </SwiperSlide>
      )
    })
  }

  render() {
    return (
      <Container fluid className="CategorySlider m-0 p-0 mb-4">
        <Swiper loop={true} spaceBetween={20} pagination={{ clickable: true, el: '#paginationCategories' }}>
          {this.slideGenerator(this.state.longMenu, longBreakpoint)}
          {this.slideGenerator(this.state.shortMenu, shortBreakpoint)}
        </Swiper>
        <Row className="d-flex justify-content-center">
          <div id="paginationCategories" className="Slider__pagination"></div>
        </Row>
      </Container>
    )
  }
}

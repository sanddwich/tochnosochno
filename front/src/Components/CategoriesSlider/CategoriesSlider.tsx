import React from 'react'
import './CategoriesSlider.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

// Import Swiper React components
import SwiperCore, { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import { Container } from 'react-bootstrap'
import Category from '../../Interfaces/Category'
import ErrorMessage from '../../SharedComponents/ErrorMessage/ErrorMessage'

// install Swiper components
SwiperCore.use([Navigation])

interface CategoriesSliderState {
  categories: Category[]
}

interface CategoriesSliderProps {
  categories: Category[]
  categoryClickHandler: (catId: number) => void
}

export default class CategoriesSlider extends React.Component<CategoriesSliderProps, CategoriesSliderState> {
  constructor(props: CategoriesSliderProps) {
    super(props)
    this.state = {
      categories: [],
    }
  }

  componentDidMount() {
    const categories = this.props.categories.map((category) => {
      category.active = false
      return category
    })
    categories[0] && (categories[0].active = true)
    this.setState({ categories })
    // console.log(this.state)
  }

  catForSlider = (): number => {
    let counter = 0
    this.props.categories.map((category) => {
      category.isIcludedInMenu && counter++
    })
    return counter
  }

  changeCategory = (catId: number): void => {
    const categories = this.state.categories.map((category) => {
      if (category.id === catId) {
        category.active = true
      } else {
        category.active = false
      }
      return category
    })

    this.props.categoryClickHandler(catId)
    this.setState({ categories })
  }

  render() {
    return (
      <Container fluid className="CategoriesSlider m-0" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {this.state.categories.length > 0 && this.catForSlider() > 0 ? (
          <div>
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={20}
              loop={true}
              navigation={{
                nextEl: '#nextArrowCategories',
                prevEl: '#prewArrowCategories',
              }}
              // onSlideChange={() => console.log('slide change')}
              // onSwiper={(swiper) => console.log(swiper)}
            >
              {this.state.categories.map((category) => {
                if (category.isIcludedInMenu) {
                  return (
                    <SwiperSlide key={category.id}>
                      <div
                        className={category.active ? 'menuEl active' : 'menuEl'}
                        id={category.id.toString()}
                        // onClick={(event: React.MouseEvent) => this.changeCategory(event)}
                        onClick={() => this.changeCategory(category.id)}
                      >
                        <div>
                          {category.name}
                          <div className="menuEl__bottomLine"></div>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                }
              })}
            </Swiper>

            <div className="position-relative">
              <div
                className="position-absolute d-flex justify-content-between"
                style={{ width: '90%', marginTop: '-36px', marginLeft: '-8px' }}
              >
                <div id="prewArrowCategories" className="sliderAngles d-inline-flex" style={{ paddingLeft: '8px' }}>
                  <FontAwesomeIcon icon={faAngleLeft} color="#5EAD03" />
                </div>
                <div id="nextArrowCategories" className="sliderAngles d-inline-flex" style={{ paddingLeft: '11px' }}>
                  <FontAwesomeIcon icon={faAngleRight} color="#5EAD03" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ErrorMessage errorMessage="Не удалось получить список активных категорий товаров" />
        )}
      </Container>
    )
  }
}

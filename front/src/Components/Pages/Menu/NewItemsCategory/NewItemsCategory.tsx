import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../../../../Redux'
import ProductCard from '../../../../SharedComponents/ProductCard/ProductCard'
import ProductCardMobile from '../../../../SharedComponents/ProductCardMobile/ProductCardMobile'
import _ from 'lodash'
import './NewItemsCategory.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import BlockName from '../../../../SharedComponents/BlockName/BlockName'
import Category from '../../../../Interfaces/Category'
import Product from '../../../../Interfaces/Product'

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

interface NewItemsCategoryProps {
  categoryId: string
  menu: Category[]
}

interface NewItemsCategoryState {
  lastProducts: Product[]
}

const mobileSlidesSeparator: number = 2
const slidesNumber: number = 3
const newItemNumber: number = 4

class NewItemsCategory extends React.Component<NewItemsCategoryProps, NewItemsCategoryState> {
  constructor(props: NewItemsCategoryProps) {
    super(props)
    this.state = {
      lastProducts: [],
    }
  }

  componentDidMount() {
    const category = this.props.menu.find((cat) => cat.id === this.props.categoryId) as Category
    let lastProducts: Product[] = []
    for (let i = 1; i <= newItemNumber; i++) {
      lastProducts.push(category.products[category.products.length - i])
    }
    this.setState({ lastProducts })
  }

  generateMobileSlides = (separator: number): any => {
    const lastProducts = this.state.lastProducts
    const resultProducts = _.chunk(lastProducts, separator)
    // console.log(resultCategories)
    return resultProducts.map((pool, index) => {
      return (
        <SwiperSlide key={index}>
          <Container fluid className="m-0 p-0">
            {pool.map((product, index) => {
              if (typeof product !== 'undefined') {
                return <ProductCardMobile key={product.id + index} product={product} />
              }
            })}
          </Container>
        </SwiperSlide>
      )
    })
  }

  render() {
    return (
      <Container key={this.props.categoryId} className="NewItemsCategory p-0">
        <Row className="p-0 m-0 d-flex justify-content-between">
          <BlockName name="Новинки" />

          <div className="NewItemsCategory__arrows d-none d-md-flex justify-content-start">
            <div id="prewArrowNewItemsCategory" className="NewItemsCategory__arrow" style={{ paddingRight: 3 }}>
              <img src="/images/icons/arrowLeftFor45.svg" alt="" />
            </div>
            <div id="nextArrowNewItemsCategory" className="NewItemsCategory__arrow" style={{ paddingLeft: 3 }}>
              <img src="/images/icons/arrowRightFor45.svg" alt="" />
            </div>
          </div>

          <div className="NewItemsCategory__arrows d-flex d-md-none justify-content-start">
            <div id="prewArrowNewItemsCategory" className="NewItemsCategory__arrow" style={{ paddingRight: 3 }}>
              <img src="/images/icons/arrowLeftMobileFor35.svg" alt="" />
            </div>
            <div id="nextArrowNewItemsCategory" className="NewItemsCategory__arrow" style={{ paddingLeft: 3 }}>
              <img src="/images/icons/arrowRightMobileFor35.svg" alt="" />
            </div>
          </div>
        </Row>

        <Row className="NewItemsCategory__Slider p-0 m-0 d-none d-md-block">
          <Swiper
            // slidesPerView={'auto'}
            slidesPerView={slidesNumber}
            loop={this.state.lastProducts.length < slidesNumber ? false : true}
            // spaceBetween={10}
            navigation={{
              nextEl: '#nextArrowNewItemsCategory',
              prevEl: '#prewArrowNewItemsCategory',
            }}
            pagination={{ clickable: true, el: '#paginationProductsFull' }}
          >
            {this.state.lastProducts.map((product, index) => {
              if (typeof product !== 'undefined') {
                return (
                  <SwiperSlide key={product.id + index}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                )
              }
            })}
          </Swiper>

          {this.state.lastProducts.length > slidesNumber ? (
            <Container fluid className="p-0 m-0 d-flex justify-content-center d-none">
              <Row className="p-0 m-0 d-flex">
                <div id="paginationProductsFull"></div>
              </Row>
            </Container>
          ) : (
            ''
          )}
        </Row>

        <Row className="NewItemsCategory__Slider p-0 m-0 d-block d-md-none">
          <Swiper
            slidesPerView={1}
            loop={true}
            navigation={{
              nextEl: '#nextArrowNewItemsCategory',
              prevEl: '#prewArrowNewItemsCategory',
            }}
            pagination={{ clickable: true, el: '#paginationProducts' }}
          >
            {this.generateMobileSlides(mobileSlidesSeparator)}
          </Swiper>
        </Row>
        <Row className="p-0 m-0 d-flex justify-content-center d-block d-md-none">
          <div id="paginationProducts"></div>
        </Row>
      </Container>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: RootState) => {
  const { menu } = state.menu
  return {
    menu: menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItemsCategory)

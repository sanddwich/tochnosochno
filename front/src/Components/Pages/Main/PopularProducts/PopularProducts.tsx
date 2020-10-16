import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Category from '../../../../Interfaces/Category'
import Product from '../../../../Interfaces/Product'
import { RootState } from '../../../../Redux'
import ProductCard from '../../../../SharedComponents/ProductCard/ProductCard'
import ProductCardMobile from '../../../../SharedComponents/ProductCardMobile/ProductCardMobile'
import _ from 'lodash'
import './PopularProducts.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import BlockName from '../../../../SharedComponents/BlockName/BlockName'

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

interface PopularProductsProps {
  menu: Category[]
}

interface PopularProductsState {
  lastProducts: Product[]
}

const mobileSlidesSeparator: number = 2

class PopularProducts extends React.Component<PopularProductsProps, PopularProductsState> {
  constructor(props: PopularProductsProps) {
    super(props)
    this.state = {
      lastProducts: [],
    }
  }

  componentDidMount() {
    let lastProducts: Product[] = []
    this.props.menu.map((category) => {
      lastProducts.push(category.products[category.products.length - 1])
    })
    this.setState({ lastProducts })
    // console.log(lastProducts)
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
              return <ProductCardMobile key={product.id + index} product={product} />
            })}
          </Container>
        </SwiperSlide>
      )
    })
  }

  render() {
    return (
      <Container key={this.state.lastProducts.length} className="PopularProducts p-0">
        <Row className="p-0 m-0 d-flex justify-content-between">
          <BlockName name="Популярные" />

          <div className="PopularProducts__arrows d-none d-md-flex justify-content-start">
            <div id="prewArrowPopularProducts" className="PopularProducts__arrow" style={{ paddingRight: 3 }}>
              <img src="images/icons/arrowLeftFor45.svg" alt="" />
            </div>
            <div id="nextArrowPopularProducts" className="PopularProducts__arrow" style={{ paddingLeft: 3 }}>
              <img src="images/icons/arrowRightFor45.svg" alt="" />
            </div>
          </div>

          <div className="PopularProducts__arrows d-flex d-md-none justify-content-start">
            <div id="prewArrowPopularProducts" className="PopularProducts__arrow" style={{ paddingRight: 3 }}>
              <img src="images/icons/arrowLeftMobileFor35.svg" alt="" />
            </div>
            <div id="nextArrowPopularProducts" className="PopularProducts__arrow" style={{ paddingLeft: 3 }}>
              <img src="images/icons/arrowRightMobileFor35.svg" alt="" />
            </div>
          </div>
        </Row>

        <Row className="PopularProducts__Slider p-0 m-0 d-none d-md-block">
          <Swiper
            // slidesPerView={'auto'}
            slidesPerView={3}
            loop={true}
            // spaceBetween={10}
            navigation={{
              nextEl: '#nextArrowPopularProducts',
              prevEl: '#prewArrowPopularProducts',
            }}
            pagination={{ clickable: true, el: '#paginationProductsFull' }}
          >
            {this.state.lastProducts.map((product, index) => {
              return (
                <SwiperSlide key={product.id + index}>
                  <ProductCard product={product} />
                </SwiperSlide>
              )
            })}
          </Swiper>

          <Container fluid className="p-0 m-0 d-flex d-none">
            <Row className="p-0 m-0 d-flex justify-content-center">
              <div id="paginationProductsFull"></div>
            </Row>
          </Container>
        </Row>

        <Row className="PopularProducts__Slider p-0 m-0 d-block d-md-none">
          <Swiper
            slidesPerView={1}
            loop={true}
            navigation={{
              nextEl: '#nextArrowPopularProducts',
              prevEl: '#prewArrowPopularProducts',
            }}
            pagination={{ clickable: true, el: '#paginationPopularProducts' }}
          >
            {this.generateMobileSlides(mobileSlidesSeparator)}
          </Swiper>
        </Row>
        <Row className="p-0 m-0 d-flex justify-content-center d-block d-md-none">
          <div id="paginationPopularProducts"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopularProducts)

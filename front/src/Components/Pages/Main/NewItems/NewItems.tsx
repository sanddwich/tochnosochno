import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Category from '../../../../Interfaces/Category'
import Product from '../../../../Interfaces/Product'
import { RootState } from '../../../../Redux'
import './NewItems.scss'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import ProductCard from '../../../../SharedComponents/ProductCard/ProductCard'
import ProductCardMobile from '../../../../SharedComponents/ProductCardMobile/ProductCardMobile'

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

interface NewItemsProps {
  menu: Category[]
}

interface NewItemsState {
  lastProducts: Product[]
}

class NewItems extends React.Component<NewItemsProps, NewItemsState> {
  constructor(props: NewItemsProps) {
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

  render() {
    return (
      <Container key={this.state.lastProducts.length} className="NewItems p-0">
        <Row className="p-0 m-0 d-flex justify-content-between">
          <div>
            <div className="NewItems__title">
              <h1>Новинки</h1>
            </div>
            <div className="NewItems__underLineCont">
              <div className="NewItems__underLine"></div>
            </div>
          </div>

          <div className="NewItems__arrows d-none d-md-flex justify-content-start">
            <div id="prewArrowNewItems" className="NewItems__arrow" style={{ paddingRight: 3 }}>
              <img src="images/icons/arrowLeftFor45.svg" alt="" />
            </div>
            <div id="nextArrowNewItems" className="NewItems__arrow" style={{ paddingLeft: 3 }}>
              <img src="images/icons/arrowRightFor45.svg" alt="" />
            </div>
          </div>

          <div className="NewItems__arrows d-flex d-md-none justify-content-start">
            <div id="prewArrowNewItems" className="NewItems__arrow" style={{ paddingRight: 3 }}>
              <img src="images/icons/arrowLeftMobileFor35.svg" alt="" />
            </div>
            <div id="nextArrowNewItems" className="NewItems__arrow" style={{ paddingLeft: 3 }}>
              <img src="images/icons/arrowRightMobileFor35.svg" alt="" />
            </div>
          </div>
        </Row>

        <Row className="NewItems__Slider p-0 m-0 d-none d-md-block">
          <Swiper
            // slidesPerView={'auto'}
            slidesPerView={3}
            loop={true}
            // spaceBetween={10}
            navigation={{
              nextEl: '#nextArrowNewItems',
              prevEl: '#prewArrowNewItems',
            }}
          >
            {this.state.lastProducts.map((product, index) => {
              return (
                <SwiperSlide key={product.id + index}>
                  <ProductCard product={product} />
                </SwiperSlide>
              )
            })}
          </Swiper>
        </Row>

        <Row className="NewItems__Slider p-0 m-0 d-block d-md-none">
          <Swiper

          slidesPerColumn={2}
          slidesPerView={1}
          >
            {this.state.lastProducts.map((product, index) => {
              return (
                <SwiperSlide key={product.id + index}>
                  <ProductCardMobile product={product} />
                </SwiperSlide>
              )
            })}
          </Swiper>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewItems)

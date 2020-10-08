import React from 'react'
import './ProductSlider.scss'
import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

// Import Swiper React components
import SwiperCore, { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import Product from '../../Interfaces/Product'
import ErrorMessage from '../../SharedComponents/ErrorMessage/ErrorMessage'
import ProductSliderItem from './ProductSliderItem/ProductSliderItem'
import OrderItem from '../../Interfaces/OrderItem'
import Category from '../../Interfaces/Category'

// install Swiper components
SwiperCore.use([Navigation])

interface ProductSliderProps {
  menu: Category[]
  catId: string
}

interface ProductSliderState {
  products: Product[]
}

export default class ProductSlider extends React.Component<ProductSliderProps, ProductSliderState> {
  constructor(props: ProductSliderProps) {
    super(props)

    this.state = {
      products: [],
    }
  }

  getProducts = () => {
    let products: Product[] = []
    if (this.props.catId) {
      this.props.menu.map((category) => {
        category.id === this.props.catId && (products = category.products)
      })
    } else {
      products = this.props.menu[0].products
    }
    this.setState({ products })
  }

  componentDidMount() {
    this.getProducts()
  }
  render() {
    return (
      <Container fluid className="ProductSlider">
        {this.state.products.length > 0 ? (
          <div>
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={20}
              // loop={true}
              navigation={{
                nextEl: '#nextArrowProduct',
                prevEl: '#prewArrowProduct',
              }}
              // onSlideChange={() => console.log('slide change')}
              // onSwiper={(swiper) => console.log(swiper)}
              style={{ paddingTop: 22, marginTop: -20, paddingLeft: 5, paddingBottom: 30 }}
            >
              {this.state.products.map((product) => {
                return (
                  <SwiperSlide key={product.id}>
                    <div className="menuEl">
                      <ProductSliderItem product={product} />
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>

            <div className="position-relative">
              <div
                className="position-absolute d-flex justify-content-between"
                style={{ width: '90%', marginTop: '-200px', marginLeft: '-8px' }}
              >
                <div id="prewArrowProduct" className="sliderAngles d-inline-flex" style={{ paddingLeft: '8px' }}>
                  <FontAwesomeIcon icon={faAngleLeft} color="#5EAD03" />
                </div>
                <div id="nextArrowProduct" className="sliderAngles d-inline-flex" style={{ paddingLeft: '11px' }}>
                  <FontAwesomeIcon icon={faAngleRight} color="#5EAD03" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ErrorMessage errorMessage="В данной категории меню нет продуктов" />
        )}
      </Container>
    )
  }
}

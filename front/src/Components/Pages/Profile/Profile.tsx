import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import Category from '../../../Interfaces/Category'
import Product from '../../../Interfaces/Product'
import { RootState } from '../../../Redux'
import ActionButton from '../../../SharedComponents/ActionButton/ActionButton'
import BlockName from '../../../SharedComponents/BlockName/BlockName'
import ProductCard from '../../../SharedComponents/ProductCard/ProductCard'
import ProductCardMobile from '../../../SharedComponents/ProductCardMobile/ProductCardMobile'
import _ from 'lodash'
import './Profile.scss'

interface ProfileProps {
  menu: Category[]
}

interface ProfileState {
  favouriteProducts: Product[]
}

const mobileSlidesSeparator: number = 2

class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props)
    this.state = {
      favouriteProducts: [],
    }
  }

  componentDidMount() {
    let favouriteProducts: Product[] = []
    this.props.menu.map((category) => {
      favouriteProducts.push(category.products[category.products.length - 1])
    })
    this.setState({ favouriteProducts })
    // console.log(lastProducts)
  }

  generateMobileSlides = (separator: number): any => {
    const lastProducts = this.state.favouriteProducts
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
      <div className="profile container mt-5">
        <BlockName name="Личный кабинет" />
        <div className="row m-0">Имя День рождения</div>

        <div className="row m-0 mt-5">
          <ActionButton
            onClick={() => console.log('edit profile')}
            textColor="white"
            width="280px"
            text="Редактировать профиль"
            backgroundColor="#303030"
            icon="edit-icon.svg"
          />
        </div>
        <div className="row m-0 mt-5">
          <ActionButton
            onClick={() => console.log('exit profile')}
            textColor="white"
            width="280px"
            text="Выйти из личного кабинета"
            backgroundColor="#303030"
            icon="exit-icon.svg"
          />
        </div>

        <div className="row m-0 mt-5">
          <BlockName name="Последние заказы" />
        </div>
        <div className="row m-0 mt-4 profile__text">Сейчас тут ничего нет :( И мы ждем вашего заказа :)</div>
        <div className="row m-0 mt-5">
          <BlockName name="Избранное" />
        </div>
        <div className="row m-0 mt-4 mb-5 profile__text">
          Сейчас тут ничего нет :( Нужно просто нажать на сердчеко на товаре
        </div>

        <div>
          <div className="favouriteProducts__arrows d-none d-md-flex justify-content-start">
            <div id="prewArrowFavouriteProducts" className="favouriteProducts__arrow" style={{ paddingRight: 3 }}>
              <img src="images/icons/arrowLeftFor45.svg" alt="" />
            </div>
            <div id="nextArrowFavouriteProducts" className="favouriteProducts__arrow" style={{ paddingLeft: 3 }}>
              <img src="images/icons/arrowRightFor45.svg" alt="" />
            </div>
          </div>

          <div className="favouriteProducts__arrows d-flex d-md-none justify-content-start">
            <div id="prewArrowFavouriteProducts" className="favouriteProducts__arrow" style={{ paddingRight: 3 }}>
              <img src="images/icons/arrowLeftMobileFor35.svg" alt="" />
            </div>
            <div id="nextArrowFavouriteProducts" className="favouriteProducts__arrow" style={{ paddingLeft: 3 }}>
              <img src="images/icons/arrowRightMobileFor35.svg" alt="" />
            </div>
          </div>

          <Row className="favouriteProducts__Slider p-0 m-0 d-none d-md-block">
            <Swiper
              // slidesPerView={'auto'}
              slidesPerView={3}
              loop={true}
              // spaceBetween={10}
              navigation={{
                nextEl: '#nextArrowFavouriteProducts',
                prevEl: '#prewArrowFavouriteProducts',
              }}
              pagination={{ clickable: true, el: '#paginationProductsFull' }}
            >
              {this.state.favouriteProducts.map((product, index) => {
                return (
                  <SwiperSlide key={product.id + index}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                )
              })}
            </Swiper>

            {/* <Container fluid className="p-0 m-0 d-flex d-none">
              <Row className="p-0 m-0 d-flex justify-content-center">
                <div id="paginationProductsFull"></div>
              </Row>
            </Container> */}
          </Row>

          <Row className="favouriteProducts__Slider p-0 m-0 d-block d-md-none">
            <Swiper
              slidesPerView={1}
              loop={true}
              navigation={{
                nextEl: '#nextArrowFavouriteProducts',
                prevEl: '#prewArrowFavouriteProducts',
              }}
              pagination={{ clickable: true, el: '#paginationPopularProducts' }}
            >
              {this.generateMobileSlides(mobileSlidesSeparator)}
            </Swiper>
          </Row>
          {/* <Row className="p-0 m-0 d-flex justify-content-center d-block d-md-none">
            <div id="paginationPopularProducts"></div>
          </Row> */}
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

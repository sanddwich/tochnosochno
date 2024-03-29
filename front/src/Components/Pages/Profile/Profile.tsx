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

import { logout, changeProfile, setCustomerName, setCustomerBirthday } from '../../../Redux/actions/auth'
import _, { String } from 'lodash'
import './Profile.scss'
import Customer from '../../../Interfaces/Customer'
import FavoriteProduct from '../../../Interfaces/FavoriteProduct'
import OrderHistory from '../../../SharedComponents/OrderHistory/OrderHistory'

interface ProfileProps {
  menu: Category[]
  logout: any
  customer: Customer
  setCustomerName: (name: string) => void
  setCustomerBirthday: (birthday: string) => void
  changeProfile: any
  loading: boolean
}

interface ProfileState {
  favouriteProducts: Product[]
  isEditProfile: boolean
}

const mobileSlidesSeparator: number = 2

class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props)
    this.state = {
      favouriteProducts: [],
      isEditProfile: false,
    }
  }

  generateMobileSlides = (separator: number): any => {
    const favoriteProducts = this.props.customer.favoriteProducts
    const resultProducts = _.chunk(favoriteProducts, separator)
    // console.log(resultCategories)
    return resultProducts.map((pool, index) => {
      return (
        <SwiperSlide key={index}>
          <Container fluid className="m-0 p-0">
            {pool.map((product, index) => {
              return <ProductCardMobile key={product.id + index} product={product.product} />
            })}
          </Container>
        </SwiperSlide>
      )
    })
  }

  nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setCustomerName(event.target.value)
  }

  birthdayChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setCustomerBirthday(event.target.value)
  }

  render() {
    let birthday = new Date()
    if (this.props.customer.birthday) {
      birthday = new Date(this.props.customer.birthday)
    }

    return (
      <div className="profile container mt-5">
        <BlockName name="Личный кабинет" />
        <div className="row m-0 mt-4">
          <div style={{ float: 'left' }}>
            <label htmlFor="profile-name">Имя</label>
            <input
              name="name"
              disabled={!this.state.isEditProfile}
              id="profile-name"
              style={{ width: '280px', marginRight: '20px' }}
              type="text"
              value={this.props.customer.name}
              onChange={(event) => this.nameChangeHandler(event)}
              placeholder="Отредактируйте профиль"
            />
          </div>
          <div className="mt-4 mt-sm-0 mt-md-0" style={{ float: 'left' }}>
            <label htmlFor="profile-birthday">День рождения</label>
            <input
              disabled={!this.state.isEditProfile}
              name="birthday"
              id="profile-birthday"
              style={{ width: '150px' }}
              type="date"
              onChange={(event) => this.birthdayChangeHandler(event)}
              value={new Date(birthday).toISOString().slice(0, 10)}
              placeholder="мм.мм.гггг"
            />
          </div>
        </div>

        <div className="row m-0 mt-5">
          {!this.state.isEditProfile ? (
            <ActionButton
              onClick={() => {
                this.setState({ isEditProfile: true })
              }}
              textColor="white"
              width="280px"
              text="Редактировать профиль"
              backgroundColor="#303030"
              icon="edit-icon.svg"
            />
          ) : (
            <div className="row m-0 mt-5 col-8 p-0">
              <div className="col-md-6 p-0">
                <ActionButton
                  loading={this.props.loading}
                  onClick={async () => {
                    await this.props.changeProfile(this.props.customer.name, this.props.customer.birthday)
                    this.setState({ isEditProfile: false })
                  }}
                  textColor="white"
                  width="280px"
                  text="Сохранить изменения"
                  backgroundColor="#303030"
                  icon="check.svg"
                />
              </div>
              <div className="col-md-6 mt-5 mt-md-0 p-0">
                <ActionButton
                  onClick={() => {
                    this.setState({ isEditProfile: false })
                  }}
                  textColor="white"
                  width="280px"
                  text="Отменить редактирование"
                  backgroundColor="#303030"
                  icon="cancel.svg"
                />
              </div>
            </div>
          )}
        </div>
        <div className="row m-0 mt-5">
          <ActionButton
            loading={this.props.loading}
            onClick={() => this.props.logout()}
            textColor="white"
            width="280px"
            text="Выйти из личного кабинета"
            backgroundColor="#303030"
            icon="exit-icon.svg"
          />
        </div>

        <OrderHistory />

        <div>{/* <LineProductWithCart product={this.props.menu[0].products[0]} /> */}</div>

        <div>{/* <LineProductWithNumberInput product={this.props.menu[0].products[0]} /> */}</div>

        <React.Fragment>
          {this.props.customer.favoriteProducts && this.props.customer.favoriteProducts.length > 0 ? (
            <div>
              <Row className="m-0 p-0 d-flex justify-content-between">
                <div className="row m-0">
                  <BlockName name="Избранное" />
                </div>

                <div className="favouriteProducts__arrows d-none d-md-flex justify-content-end align-items-center">
                  <div id="prewArrowFavouriteProducts" className="favouriteProducts__arrow" style={{ paddingRight: 3 }}>
                    <img src="images/icons/arrowLeftFor45.svg" alt="" />
                  </div>
                  <div id="nextArrowFavouriteProducts" className="favouriteProducts__arrow" style={{ paddingLeft: 3 }}>
                    <img src="images/icons/arrowRightFor45.svg" alt="" />
                  </div>
                </div>

                <div className="favouriteProducts__arrows d-flex d-md-none justify-content-end align-items-center">
                  <div id="prewArrowFavouriteProducts" className="favouriteProducts__arrow" style={{ paddingRight: 3 }}>
                    <img src="images/icons/arrowLeftMobileFor35.svg" alt="" />
                  </div>
                  <div id="nextArrowFavouriteProducts" className="favouriteProducts__arrow" style={{ paddingLeft: 3 }}>
                    <img src="images/icons/arrowRightMobileFor35.svg" alt="" />
                  </div>
                </div>
              </Row>

              <Row className="favouriteProducts__Slider p-0 m-0 d-none d-md-block">
                <Swiper
                  slidesPerView={3}
                  navigation={{
                    nextEl: '#nextArrowFavouriteProducts',
                    prevEl: '#prewArrowFavouriteProducts',
                  }}
                  pagination={{ clickable: true, el: '#paginationFavouriteProducts' }}
                >
                  {this.props.customer.favoriteProducts.map((favProduct: FavoriteProduct, index) => {
                    return (
                      <SwiperSlide key={favProduct.product.id + index}>
                        <ProductCard product={favProduct.product} />
                      </SwiperSlide>
                    )
                  })}
                </Swiper>

                <Container fluid className="p-0 m-0 d-flex justify-content-center mb-4">
                  <Row className="p-0 m-0 d-flex justify-content-center">
                    <div id="paginationFavouriteProducts"></div>
                  </Row>
                </Container>
              </Row>

              <Row className="favouriteProducts__Slider p-0 m-0 d-block d-md-none">
                <Swiper
                  slidesPerView={1}
                  loop={true}
                  navigation={{
                    nextEl: '#nextArrowFavouriteProducts',
                    prevEl: '#prewArrowFavouriteProducts',
                  }}
                  pagination={{ clickable: true, el: '#paginationFavouriteProductsMob' }}
                >
                  {this.generateMobileSlides(mobileSlidesSeparator)}
                </Swiper>

                <Container fluid className="p-0 m-0 d-flex justify-content-center mb-4">
                  <Row className="p-0 m-0 d-flex justify-content-center">
                    <div id="paginationFavouriteProductsMob"></div>
                  </Row>
                </Container>
              </Row>
            </div>
          ) : (
            <React.Fragment>
              <BlockName name="Избранное" />
              <div className="row m-0 mt-4 mb-5 profile__text">
                Сейчас тут ничего нет :( Нужно просто нажать на сердчеко на товаре
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      </div>
    )
  }
}

const mapDispatchToProps = {
  logout,
  changeProfile,
  setCustomerName,
  setCustomerBirthday,
}

const mapStateToProps = (state: RootState) => {
  const { customer, smsCodeTime, loading } = state.auth
  return {
    customer,
    loading,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

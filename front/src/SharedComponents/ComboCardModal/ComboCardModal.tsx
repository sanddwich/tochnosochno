import React from 'react'
import { connect } from 'react-redux'
import { Col, Container, Row } from 'react-bootstrap'
import { RootState } from '../../Redux'
import { hideComboModal } from '../../Redux/actions/app'
import './ComboCardModal.scss'
import RoundButton from '../RoundButton/RoundButton'
import BlockName from '../BlockName/BlockName'
import ComboElement from './ComboElement/ComboElement'
import ActionButton from '../ActionButton/ActionButton'
import Product from '../../Interfaces/Product'
import Category from '../../Interfaces/Category'
import ComboElementChangeList from './ComboElementChangeList/ComboElementChangeList'

// Import Swiper React components
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import AddComboButton from '../AddComboButton/AddComboButton'
import ComboItemOrder from '../../Interfaces/ComboItemOrder'
import UpdateComboButton from '../UpdateComboButton/UpdateComboButton'
import LazyLoad from 'react-lazyload'

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

interface ComboCardModalProps {
  hideComboModal: () => void
  showComboModal: boolean
  comboModalElement: Category
  comboItemOrder: ComboItemOrder
}

interface ComboCardModalState {
  comboConsist: Product[]
  comboProductVariants: Product[]
  comboConsistArrayElement: number
}

class ComboCardModal extends React.Component<ComboCardModalProps, ComboCardModalState> {
  constructor(props: ComboCardModalProps) {
    super(props)
    this.state = {
      comboConsist:
        typeof this.props.comboItemOrder !== 'undefined'
          ? this.props.comboItemOrder.products
          : typeof this.props.comboModalElement !== 'undefined'
          ? this.props.comboModalElement.products.slice(0, 3)
          : [],
      comboProductVariants:
        typeof this.props.comboModalElement !== 'undefined' ? this.props.comboModalElement.products : [],
      comboConsistArrayElement: -1,
    }
  }

  componentDidMount() {
    // console.log(this.state)
    // console.log(this.props.comboItemOrder)
  }

  changeProductAtCombo = (comboConsistArrayElement: number) => {
    // console.log(comboConsistArrayElement)
    this.setState({ comboConsistArrayElement })
  }

  addNewProductAtCombo = (newProductId: string) => {
    let comboConsistArrayElement = this.state.comboConsistArrayElement
    const comboConsist = this.state.comboConsist
    const insertProduct = this.state.comboProductVariants.find((product) => product.id === newProductId) as Product
    comboConsist[comboConsistArrayElement] = insertProduct

    // console.log(insertProduct)
    // console.log(comboConsist)

    comboConsistArrayElement = -1
    this.setState({ comboConsistArrayElement, comboConsist })
  }

  render() {
    let comboPrice: number = 0
    if (typeof this.props.comboModalElement !== 'undefined') {
      if (this.props.comboModalElement.comboProductsCount && this.props.comboModalElement.comboProductsCount > 2) {
        for (let i = 0; i < this.props.comboModalElement.comboProductsCount; i++) {
          comboPrice = comboPrice + this.state.comboConsist[i].sizePrices[0].price.currentPrice
        }
      }
    }
    // this.props.comboModalElement.products[0].sizePrices[0].price.currentPrice * (this.props.comboModalElement.comboProductsCount || 1)
    return (
      <React.Fragment>
        {this.props.showComboModal ? (
          <Container fluid className="ComboCardModal p-0 m-0 d-flex align-items-center">
            <div className="ComboCardModal__body p-0 d-none d-md-block">
              <Row className="ComboCardModal__closeButtonRow d-flex justify-content-end p-0 m-0">
                <div className="ComboCardModal__closeButtonCont position-relative">
                  <div className="ComboCardModal__closeButton">
                    <RoundButton icon="icon_close.svg" backgroundColor="#F2F2F2" onClick={this.props.hideComboModal} />
                  </div>
                </div>
              </Row>
              <Row className="ComboCardModal__Cont p-0 m-0">
                <Col md={6} className="ComboCardModal__leftColumn p-0 d-flex flex-column align-items-start">
                  <Row className="w-100">
                    <Col className="ComboCardModal__title">
                      <BlockName name={`${this.props.comboModalElement.name}`} />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="ComboCardModal__descr">{this.props.comboModalElement.description}</Col>
                  </Row>
                  <Row className="ComboCardModal__productsList d-flex p-0">
                    <Col className="p-0">
                      {this.state.comboConsist.map((product, index) => {
                        return (
                          <ComboElement
                            key={product.id + index}
                            product={product}
                            comboConsistArrayElement={index}
                            changeProductAtCombo={this.changeProductAtCombo}
                          />
                        )
                      })}
                    </Col>
                  </Row>

                  <Row className="ComboCardModal__result p-0 m-0 mt-auto d-flex justify-content-around align-items-center">
                    <div className="ComboCardModal__resultTitle">Итого:</div>
                    <div className="ComboCardModal__resultPrice">
                      {comboPrice}
                      <span>руб</span>
                    </div>
                    <div className="ComboCardModal__resultActionButton">
                      {typeof this.props.comboItemOrder !== 'undefined' ? (
                        <UpdateComboButton
                          products={this.state.comboConsist}
                          comboId={this.props.comboItemOrder.comboId}
                          pickDate={this.props.comboItemOrder.pickDate}
                        />
                      ) : (
                        <AddComboButton products={this.state.comboConsist} comboId={this.props.comboModalElement.id} />
                      )}

                      {/* <AddComboButton products={this.state.comboConsist} comboId={this.props.comboModalElement.id} /> */}
                    </div>
                  </Row>
                </Col>

                <Col md={6} className="ComboCardModal__img p-0 h-100 d-flex align-items-start">
                  {this.state.comboConsistArrayElement !== -1 ? (
                    <ComboElementChangeList
                      products={this.state.comboProductVariants}
                      addNewProductAtCombo={this.addNewProductAtCombo}
                      comboConsist={this.state.comboConsist}
                    />
                  ) : (
                    <div
                      className="ComboCardModal__imgBack"
                      // style={{
                      //   background: 'url(/images/combo.jpg)',
                      //   backgroundRepeat: 'no-repeat',
                      //   // backgroundAttachment: 'fixed',
                      //   backgroundPosition: 'center',
                      //   backgroundSize: 'cover',
                      // }}
                    >
                      <img src="/images/combo.jpg" alt="" />
                    </div>
                  )}
                </Col>
              </Row>
            </div>

            {/* Mobile Container  ============================================ */}

            <Container fluid className="ComboCardModalMob__body p-0  d-block d-md-none ">
              <Row className="ComboCardModalMob__closeButtonRow d-flex justify-content-end p-0 m-0">
                <div className="ComboCardModalMob__closeButtonCont position-relative">
                  <div className="ComboCardModalMob__closeButton">
                    <RoundButton icon="icon_close.svg" backgroundColor="#F2F2F2" onClick={this.props.hideComboModal} />
                  </div>
                </div>
              </Row>

              <Row className="ComboCardModalMob__img p-0 d-flex align-items-start">
                {this.state.comboConsistArrayElement !== -1 ? (
                  <React.Fragment>
                    <Swiper
                      loop={true}
                      pagination={{ clickable: true, el: '#paginationComboProduct' }}
                      navigation={{
                        nextEl: '#ComboCardModalMobNext',
                        prevEl: '#ComboCardModalMobPrev',
                      }}
                    >
                      {this.state.comboProductVariants.map((product, index) => {
                        // if (!this.state.comboConsist.find((ccproduct) => product.id === ccproduct.id)) {
                        return (
                          <SwiperSlide key={index} onClick={() => this.addNewProductAtCombo(product.id)}>
                            <Container fluid className="p-0 m-0">
                              <Row className="p-0 m-0 d-flex align-items-center justify-content-center">
                                <div>
                                  <div className="p-0 m-0 d-flex justify-content-center align-items-center">
                                    <img
                                      className="img-fluid"
                                      src={
                                        product.imageLinks[0]
                                          ? `${product.imageLinks[0]}`
                                          : '/images/products/no-photo.png'
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div className="p-0 m-0 d-flex justify-content-center align-items-center">
                                    {product.name}
                                  </div>
                                </div>
                              </Row>
                            </Container>
                          </SwiperSlide>
                        )
                        // }
                      })}
                    </Swiper>

                    <Row className="Slider__actions m-0 p-0 d-flex">
                      <div className="Slider__arrows w-100 d-flex justify-content-between">
                        <div id="ComboCardModalMobPrev" className="Slider__arrow">
                          <img src="/images/icons/arrow_left.svg" alt="" />
                        </div>
                        <div id="ComboCardModalMobNext" className="Slider__arrow">
                          <img src="/images/icons/arrow_right.svg" alt="" />
                        </div>
                      </div>
                    </Row>

                    <Col className="d-flex justify-content-center">
                      <div id="paginationComboProduct" className="Slider__pagination"></div>
                    </Col>
                  </React.Fragment>
                ) : (
                  <div
                    className="ComboCardModalMob__imgBack h-100"
                    style={{
                      background: 'url(/images/combo_mobile.jpg)',
                      backgroundRepeat: 'no-repeat',
                      // backgroundAttachment: 'fixed',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  ></div>
                )}
              </Row>

              <Row className="ComboCardModalMob__Cont p-0 m-0">
                <Col className="ComboCardModalMob__leftColumn p-0">
                  <Row className="w-100">
                    <Col className="ComboCardModalMob__title">
                      <BlockName name={`${this.props.comboModalElement.name}`} />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="ComboCardModalMob__descr">{this.props.comboModalElement.description}</Col>
                  </Row>
                  <Row className="ComboCardModalMob__productsList d-flex p-0 m-0">
                    <Col className="p-0">
                      {this.state.comboConsist.map((product, index) => {
                        return (
                          <ComboElement
                            key={product.id + index}
                            product={product}
                            comboConsistArrayElement={index}
                            changeProductAtCombo={this.changeProductAtCombo}
                          />
                        )
                      })}
                    </Col>
                  </Row>

                  <Row className="ComboCardModalMob__result p-0 m-0 mt-auto d-flex justify-content-around align-items-center">
                    <div className="ComboCardModalMob__resultTitle">Итого:</div>
                    <div className="ComboCardModalMob__resultPrice">
                      {comboPrice}
                      <span>руб</span>
                    </div>
                    <div className="ComboCardModalMob__resultActionButton">
                      {typeof this.props.comboItemOrder !== 'undefined' ? (
                        <UpdateComboButton
                          products={this.state.comboConsist}
                          comboId={this.props.comboItemOrder.comboId}
                          pickDate={this.props.comboItemOrder.pickDate}
                        />
                      ) : (
                        <AddComboButton products={this.state.comboConsist} comboId={this.props.comboModalElement.id} />
                      )}
                    </div>
                  </Row>
                </Col>
              </Row>
            </Container>
          </Container>
        ) : null}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  hideComboModal,
}

const mapStateToProps = (state: RootState) => {
  const { showComboModal, comboModalElement, comboItemOrder } = state.app
  return {
    showComboModal,
    comboModalElement,
    comboItemOrder,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComboCardModal)

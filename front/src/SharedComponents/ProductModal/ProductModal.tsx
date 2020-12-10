import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import BlockName from '../BlockName/BlockName'
import LineProductWithSizeInput from '../LineProductWithSizeInput/LineProductWithSizeInput'
import RecomendedProducts from '../RecomendedProducts/RecomendedProducts'
import RoundButton from '../RoundButton/RoundButton'
import Sticker from '../Sticker/Sticker'
import { hideProductModal } from '../../Redux/actions/app'
import './ProductModal.scss'
import FavouriteRoundButton from '../FavouriteRoundButton/FavouriteRoundButton'
import Category from '../../Interfaces/Category'
import AddProductButton from '../AddProductButton/AddProductButton'

interface ProductModalProps {
  menu: Category[]
  productModalProduct: Product
  showProductModal: boolean
  hideProductModal: () => void
}

interface ProductModalState {
  newItemsConsist: boolean
}

class ProductModal extends React.Component<ProductModalProps, ProductModalState> {
  constructor(props: ProductModalProps) {
    super(props)
    this.state = {
      newItemsConsist: false,
    }
  }

  componentDidMount() {}

  newItemDefine = (): boolean => {
    let newItemsConsist: boolean = false
    if (typeof this.props.productModalProduct !== 'undefined') {
      this.props.menu.map((cat) => {
        if (cat.products.find((product) => product.id === this.props.productModalProduct.id)) {
          cat.products[cat.products.length - 1].id === this.props.productModalProduct.id
            ? (newItemsConsist = true)
            : (newItemsConsist = false)
        }
      })
    }

    return newItemsConsist
  }

  render() {
    return (
      <React.Fragment>
        {this.props.showProductModal ? (
          <Container fluid className="ProductModal p-0 m-0 d-flex align-items-center ">
            <Container className="ProductModal__body p-0">
              <Row className="ProductModal__closeButtonRow d-flex justify-content-end">
                <div className="ProductModal__closeButtonCont position-relative">
                  <div className="ProductModal__closeButton">
                    <RoundButton
                      icon="icon_close.svg"
                      backgroundColor="#F2F2F2"
                      onClick={this.props.hideProductModal}
                    />
                  </div>
                </div>
              </Row>

              <Row className="ProductModal__bodyCont p-0 m-0 h-100">
                <Row className="ProductModal__firstLine pr-5 m-0 d-flex justify-content-between">
                  <div className="ProductModal__favoriteButton">
                    <FavouriteRoundButton product={this.props.productModalProduct} />
                  </div>
                  <div className="ProductModal__stickerCont">
                    {this.newItemDefine() ? <Sticker title="Новинка" backgroundColor="#FFD74B" /> : null}
                  </div>
                </Row>
                <Col className="p-0 m-0 d-flex align-items-center justify-content-center" md={5}>
                  <div className="ProductModal__img d-flex justify-content-center">
                    <img
                      // className="img-fluid"
                      src={
                        typeof this.props.productModalProduct.imageLinks[0] !== 'undefined'
                          ? `${this.props.productModalProduct.imageLinks[0]}`
                          : '/images/products/burger.png'
                      }
                      alt={this.props.productModalProduct.name}
                    />
                  </div>
                </Col>

                <Col className="ProductModal__info p-0 m-0 d-flex flex-column" md={7}>
                  <Row>
                    <Col className="ProductModal__title mt-md-5 ml-4 ml-md-0">
                      <BlockName name={this.props.productModalProduct.name} />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="ProductModal__descr">{this.props.productModalProduct.description}</Col>
                  </Row>

                  <Row className="ProductModal__priceBlock">
                    <Col className="ProductModal__Content d-flex align-items-center">
                      <LineProductWithSizeInput product={this.props.productModalProduct} />
                      {/* <AddProductButton product={this.props.productModalProduct} hideTextMobile={false} /> */}
                    </Col>
                  </Row>

                  <div className="ProductModal__recomendContAll ">
                    <div className="ml-4 ">
                      <BlockName name="Рекомендуем" />
                    </div>
                    <Col className="ProductModal__recomendCont m-0 p-0">
                      <div className="ProductModal__recomend">
                        <RecomendedProducts title="" product={this.props.productModalProduct} />
                      </div>
                    </Col>
                  </div>
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
  hideProductModal,
}

const mapStateToProps = (state: RootState) => {
  const { showProductModal, productModalProduct } = state.app
  const { menu } = state.menu
  return {
    showProductModal,
    productModalProduct,
    menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductModal)

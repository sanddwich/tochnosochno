import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import BlockName from '../BlockName/BlockName'
import RecomendedProducts from '../RecomendedProducts/RecomendedProducts'
import RoundButton from '../RoundButton/RoundButton'
import Sticker from '../Sticker/Sticker'
import './ProductModal.scss'

interface ProductModalProps {
  product: Product
  toggleModal: () => void
}

interface ProductModalState {
  product: Product
}

class ProductModal extends React.Component<ProductModalProps, ProductModalState> {
  modal: HTMLElement = document.createElement('div')

  constructor(props: ProductModalProps) {
    super(props)
    this.state = {
      product: this.props.product,
    }
    // console.log(this.props)
    console.log(this.state)
  }

  componentDidMount() {
    document.body.appendChild(this.modal)
  }

  componentWillUnmount() {
    document.body.removeChild(this.modal)
  }

  favoriteClick = (): void => {
    console.log('favoriteClick')
  }

  render() {
    return ReactDOM.createPortal(
      <Container fluid className="ProductModal p-0 m-0 d-flex align-items-center">
        <Container className="ProductModal__body pt-2 pb-2">
          <Row className="ProductModal__closeButtonRow d-flex justify-content-end">
            <div className="ProductModal__closeButtonCont position-relative">
              <div className="ProductModal__closeButton">
                <RoundButton icon="icon_close.svg" backgroundColor="#F2F2F2" onClick={() => this.props.toggleModal()} />
              </div>
            </div>
          </Row>

          <Row className="p-0 m-0 h-100">
            <Col className="p-0 m-0" xs={5}>
              <Row className="ProductModal__firstLine p-0 m-0 d-flex justify-content-between">
                <div className="ProductModal__favoriteButton">
                  <RoundButton icon="favorite.svg" backgroundColor="##F2F2F2" onClick={() => this.favoriteClick()} />
                </div>
                <div className="ProductModal__stickerCont">
                  <Sticker title="Новинка" backgroundColor="#FFD74B" />
                  <Sticker title="Акция" backgroundColor="#FF371C" />
                </div>
              </Row>

              <Row className="ProductModal__img h-100 d-flex justify-content-center align-items-center">
                <div>
                  <img
                    className="img-fluid"
                    src={
                      typeof this.props.product.imageLinks[0] !== 'undefined'
                        ? `${this.props.product.imageLinks[0]}`
                        : '/images/products/no-photo.png'
                    }
                    alt={this.props.product.name}
                  />
                </div>
              </Row>
            </Col>

            <Col className="p-0 m-0" xs={7}>
              <Row>
                <Col className="ProductModal__title">
                  <BlockName name={this.state.product.name} />
                </Col>
              </Row>
              <Row>
                <Col className="ProductModal__descr">
                  {this.state.product.description + '. ' + (this.state.product.weight * 1000).toString() + 'гр.'}
                </Col>
              </Row>

              <Row>
                <Col className="ProductModal__recomend">
                  <RecomendedProducts />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Container>,
      this.modal
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductModal)

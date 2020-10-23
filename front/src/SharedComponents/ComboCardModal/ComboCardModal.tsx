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

interface ComboCardModalProps {
  hideComboModal: () => void
  showComboModal: boolean
  menu: Category[]
}

interface ComboCardModalState {
  comboConsist: Product[]
  comboProductVariants: Product[]
  comboProductChangeId: number
}

class ComboCardModal extends React.Component<ComboCardModalProps, ComboCardModalState> {
  constructor(props: ComboCardModalProps) {
    super(props)
    this.state = {
      comboConsist: [],
      comboProductVariants: [],
      comboProductChangeId: 0,
    }
  }

  componentDidMount() {
    const comboConsist: Product[] = this.props.menu[0].products
    let comboProductVariants: Product[] = []
    this.props.menu.map((cat) => {
      cat.products.map((product) => {
        comboProductVariants.push(product)
      })
    })
    this.setState({ comboConsist, comboProductVariants })
  }

  changeProductAtCombo = (productId: number) => {
    const comboProductChangeId: number = productId
    this.setState({ comboProductChangeId })
  }

  addNewProductAtCombo = (newProductId: number) => {
    let comboProductChangeId = this.state.comboProductChangeId
    const comboConsist = this.state.comboConsist.map((product) => {
      if (product.id === comboProductChangeId) {
        return this.state.comboProductVariants.find((product) => product.id === newProductId)
      } else {
        return product
      }
    }) as Product[]
    comboProductChangeId = 0
    this.setState({ comboProductChangeId, comboConsist })
  }

  render() {
    return (
      <React.Fragment>
        {this.props.showComboModal ? (
          <Container fluid className="ComboCardModal p-0 m-0 d-flex align-items-center">
            <Container className="ComboCardModal__body p-0">
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
                      <BlockName name="Комбо - 3 пиццы 25см" />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="ComboCardModal__descr">
                      ролл Сочный краб, ролл Сочный лосось, ролл Медовый лосось 637 г ролл Сочный краб, ролл Сочный
                      лосось, ролл Медовый лосось 637 г ролл Сочный краб, ролл Сочный лосось, ролл Медовый лосось 637 г
                      ролл Сочный краб, ролл Сочный лосось, ролл Медовый лосось 637 г
                    </Col>
                  </Row>
                  <Row className="ComboCardModal__productsList d-flex p-0">
                    <Col className="p-0">
                      {this.state.comboConsist.map((product, index) => {
                        return (
                          <ComboElement
                            key={product.id + index}
                            product={product}
                            changeProductAtCombo={this.changeProductAtCombo}
                          />
                        )
                      })}
                    </Col>
                  </Row>

                  <Row className="ComboCardModal__result p-0 m-0 mt-auto d-flex justify-content-around align-items-center">
                    <div className="ComboCardModal__resultTitle">Итого:</div>
                    <div className="ComboCardModal__resultPrice">
                      980<span>руб</span>
                    </div>
                    <div className="ComboCardModal__resultActionButton">
                      <ActionButton
                        onClick={() => console.log('add to cart')}
                        textColor="white"
                        width="180px"
                        text="В корзину"
                        backgroundColor="#303030"
                        icon="cart_dark.svg"
                        hideTextMobile={true}
                      />
                    </div>
                  </Row>
                </Col>

                <Col md={6} className="ComboCardModal__img p-0 h-100 d-flex align-items-start">
                  {this.state.comboProductChangeId !== 0 ? (
                    <ComboElementChangeList
                      products={this.state.comboProductVariants}
                      addNewProductAtCombo={this.addNewProductAtCombo}
                      comboConsist={this.state.comboConsist}
                    />
                  ) : (
                    <img className="img-fluid" src="/images/combo1.jpg" alt="" />
                  )}
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
  const { showComboModal } = state.app
  const { menu } = state.menu
  return {
    showComboModal,
    menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComboCardModal)

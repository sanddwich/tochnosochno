import React from 'react'

import './ProductSliderItem.scss'
import Product from '../../../Interfaces/Product'
import { Container, Card } from 'react-bootstrap'
import { RoundButton } from '../../../SharedComponents/RoundButton/RoundButton'
import { setProduct } from '../../../Redux/actions/orderItem'
import { connect } from 'react-redux'

interface ProductSliderItemProps {
  product: Product
  setProduct: any
}
interface ProductSliderItemState {}

class ProductSliderItem extends React.Component<ProductSliderItemProps, ProductSliderItemState> {
  productToBase: any = []

  componentDidMount() {
    const elements: NodeListOf<Element> = document.querySelectorAll('#cardtitle')
    elements.forEach((el: Element) => {
      let text = el.textContent
      if (text !== null && text.length > 0) {
        let textArray: string[] = text.split(' ')
        textArray[textArray.length - 1] = '<span style="color:#AD0303">' + textArray[textArray.length - 1] + '</span>'
        text = textArray.join(' ')
        el.innerHTML = text
      }
    })

    this.productToBaseCreate()
  }

  productToBaseCreate = (): void => {
    let productVariants: any = this.props.product.variants || []
    let productVariant: any = []

    if (productVariants.length > 0) {
      productVariant = productVariants[1] || productVariants[0]
    }

    this.productToBase = {
      amount: 1,
      id: this.props.product.id,
      product: this.props.product,
      productVariant: productVariant,
      orderItemModifiers: [],
    }
  }

  render() {
    return (
      <Card className="ProductSliderItem p-3">
        <Container fluid className="justify-content-center p-0 m-0">
          <div className="addinfo">
            <div className="addinfo__price">{(this.props.product.price || 300).toString() + ' руб.'}</div>
            <div className="addinfo__facets">
              {this.props.product.facets.length > 0 ? (
                this.props.product.facets.map((facet, index) => {
                  return (
                    <div key={index} className="addinfo__facet">
                      <div className="addinfo__facetimg">
                        <img src={'images/' + facet.image} alt="" />
                      </div>
                      <div className="addinfo__facetdesc">{facet.name}</div>
                    </div>
                  )
                })
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </Container>

        <Card.Img src={'images/products/' + this.props.product.image} />
        <Card.Body>
          <Card.Title className="title">
            <Container fluid className="p-0 m-0 d-flex justify-content-between">
              <div>
                <span id="cardtitle">{this.props.product.name}</span>
                <div className="menuEl__bottomLine"></div>
              </div>
              <div className="weight">{this.props.product.weight + 'гр.'}</div>
            </Container>
          </Card.Title>
          <Card.Text className="text">{this.props.product.ingredients}</Card.Text>
        </Card.Body>
        <Container className="justify-content-center">
          <div className="cardButton">
            <div
              style={{ marginLeft: 30 }}
              onClick={() => {
                this.props.setProduct(this.props.product)
              }}
            >
              <RoundButton text="Добавить" loading={false} />
              <div className="cardButton__image">
                <img src="images/cart-white.svg" alt="" />
              </div>
            </div>
          </div>
        </Container>
      </Card>
    )
  }
}

const mapDispatchToProps = {
  setProduct,
}

export default connect(null, mapDispatchToProps)(ProductSliderItem)

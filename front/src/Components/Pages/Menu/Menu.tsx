import React from 'react'
import { Container } from 'react-bootstrap'
import { RouteComponentProps } from 'react-router-dom'
import NewItemsCategory from './NewItemsCategory/NewItemsCategory'
import SliderContainer from '../../../SharedComponents/SliderContainer/SliderContainer'

import './Menu.scss'
import ProductList from './ProductList/ProductList'
import BreadCrumbs from '../../../SharedComponents/BreadCrumbs/BreadCrumbs'

interface MatchParams {
  id: string
}

interface MenuProps extends RouteComponentProps<MatchParams> {}

interface MenuState {}

export default class Menu extends React.Component<MenuProps, MenuState> {
  render() {
    return (
      <Container fluid className="Menu p-0 m-0">
        {/* <BreadCrumbs  /> */}
        {/* <SliderContainer marginTop={30} /> */}
        <SliderContainer />
        <NewItemsCategory key={this.props.match.params.id + Math.random().toString()} categoryId={this.props.match.params.id} />
        <ProductList key={this.props.match.params.id + Math.random().toString()} productsPerPage={6} categoryId={this.props.match.params.id} />
      </Container>
    )
  }
}

import _ from 'lodash'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Category from '../../../../Interfaces/Category'
import { RootState } from '../../../../Redux'

import './CategoriesContainer.scss'

interface CategoriesContainerProps {
  menu: Category[]
}

interface CategoriesContainerState {
  sortMenu: Category[],
  longMenu: Category[],
  shortMenu: Category[],
}

const includeString:string = 'сеты '

class CategoriesContainer extends React.Component<CategoriesContainerProps, CategoriesContainerState> {
  constructor(props:CategoriesContainerProps) {
    super(props)
    this.state = {
      sortMenu: [],
      longMenu: [],
      shortMenu: [],
    }
  }

  componentDidMount() {
    const sortMenu:Category[] = _.sortBy(this.props.menu, (obj) => {
      return parseInt(obj.id)
    })
    let longMenu:Category[] = []
    let shortMenu:Category[] = []
    sortMenu.map(el => {
      el.name.toLowerCase().includes(includeString) ? longMenu.push(el) : shortMenu.push(el)      
    })

    this.setState({sortMenu, longMenu, shortMenu})
  }

  render() {
    return (
      <Container fluid className="CategoriesContainer p-0 m-0">
        <h1>CategoriesContainer</h1>
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesContainer)

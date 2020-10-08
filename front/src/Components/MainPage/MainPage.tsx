import React, { Component } from 'react'
import './MainPage.scss'
import ComboSlider from '../ComboSlider/ComboSlider'
import CategoriesSlider from '../CategoriesSlider/CategoriesSlider'
import { Container } from 'react-bootstrap'
import Category from '../../Interfaces/Category'
import Loader from '../../SharedComponents/Loader/Loader'
import ErrorMessage from '../../SharedComponents/ErrorMessage/ErrorMessage'
import ProductSlider from '../ProductSlider/ProductSlider'
import MainBanner from './MainBanner/MainBanner'
import MainContent from './MainContent/MainContent'
import { connect } from 'react-redux'
import { getMenu } from '../../Redux/actions/menu'

interface MainPageState {
  loading?: boolean
  categories: Category[]
  catId: number
}
interface MainPageProps {
  menu: Category[]
  getMenu: any
  error: string
  loading: boolean
  date: Date
}

class MainPage extends Component<MainPageProps, MainPageState> {
  constructor(props: any) {
    super(props)
    this.state = {
      categories: this.props.menu,
      loading: this.props.loading,
      catId: -1,
    }
  }

  componentDidMount() {
    if (this.props.menu.length === 0) {
      this.props.getMenu()
    } else {
      const dateDiff = (new Date().valueOf() - new Date(this.props.date).valueOf()) / 60000
      if (dateDiff > 60) {
        this.props.getMenu()
      }
    }
  }

  categoryClickHandler = (catId: number): void => {
    this.setState({ catId })
  }

  render() {
    if (this.props.loading) {
      return <Loader />
    }

    return (
      <Container fluid className="MainPage m-0 p-0">
        <div>
          <ComboSlider />
          {this.props.error === '' && this.props.menu.length > 0 ? (
            <React.Fragment>
              <CategoriesSlider categories={this.props.menu} categoryClickHandler={this.categoryClickHandler} />
              <ProductSlider catId={this.state.catId} key={this.state.catId} menu={this.props.menu} />
            </React.Fragment>
          ) : (
            <ErrorMessage errorMessage={this.props.error} />
          )}

          <MainBanner />
          <MainContent />
        </div>
      </Container>
    )
  }
}

const mapDispatchToProps = {
  getMenu,
}

const mapStateToProps = (state: any) => {
  const { menu, loading, error, date } = state.menu
  return {
    menu: menu,
    loading,
    error,
    date,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage)

import React from 'react'
import { Container } from 'react-bootstrap'
import Footer from './Footer/Footer'
import Header from './Header/Header'
import './MainLayout.scss'
import PageContent from './PageContent/PageContent'
import { Route, Switch, Redirect } from 'react-router-dom'
import Menu from '../Pages/Menu/Menu'
import Main from '../Pages/Main/Main'
import { connect } from 'react-redux'
import { getMenu } from '../../Redux/actions/menu'
import Cart from '../Pages/Cart/Cart'
import Actions from '../Pages/Actions/Actions'
import Contacts from '../Pages/Contacts/Contacts'
import Profile from '../Pages/Profile/Profile'
import Product from '../Pages/Product/Product'
import { RootState } from '../../Redux'
import Loader from '../../SharedComponents/Loader/Loader'
import ScreenLoader from '../../SharedComponents/ScreenLoader/ScreenLoader'
import OverlayLoader from '../../SharedComponents/OverlayLoader/OverlayLoader'

interface MainLayoutProps {
  getMenu: any
  isAuth: boolean
  loading: boolean
}

interface MainLayoutState {}

class MainLayout extends React.Component<MainLayoutProps, MainLayoutState> {
  componentDidMount() {
    this.props.getMenu()
  }

  render() {
    return (
      <Container fluid className="MainLayout p-0 m-0">
        {this.props.loading ? <ScreenLoader /> : null}
        <div hidden={this.props.loading}>
          <Header />
          <PageContent>
            <Switch>
              <Route path="/menu/:id" exact component={Menu} />

              <Route path="/actions" exact component={Actions} />
              <Route path="/product/:id" exact component={Product} />
              <Route path="/cart" exact component={Cart} />
              <Route path="/contacts" exact component={Contacts} />
              {this.props.isAuth ? <Route path="/profile" exact component={Profile} /> : null}

              <Route path="/" exact component={Main} />

              <Route path="/city/:organizationId" exact component={Main} />

              <Redirect to="/" />
            </Switch>
          </PageContent>

          <Footer />
        </div>
      </Container>
    )
  }
}

const mapDispatchToProps = {
  getMenu,
}

const mapStateToProps = (state: RootState) => {
  const { isAuth } = state.auth
  const { loading, productsLoading } = state.menu
  return {
    isAuth,
    loading,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)

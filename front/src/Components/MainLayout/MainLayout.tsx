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

interface MainLayoutProps {
  getMenu: any
}

interface MainLayoutState {}

class MainLayout extends React.Component<MainLayoutProps, MainLayoutState> {
  componentDidMount() {
    this.props.getMenu()
  }

  render() {
    return (
      <Container fluid className="MainLayout p-0 m-0">
        <Header />

        <PageContent>
          <Switch>
            <Route path="/menu" exact component={Menu} />
            <Route path="/" exact component={Main} />
          </Switch>
        </PageContent>

        <Footer />
      </Container>
    )
  }
}

const mapDispatchToProps = {
  getMenu,
}

export default connect(null, mapDispatchToProps)(MainLayout)

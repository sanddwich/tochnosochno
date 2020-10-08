import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'
import { MapPage } from '../MapPage/MapPage'
import SideBar from './SideBar/SideBar'
import SideDialog from './SideDialog/SideDialog'
import MainPage from '../MainPage/MainPage'

import './MainLayout.scss'
import { Alert } from 'react-bootstrap'

type MainLayoutState = {}

export class MainLayout extends Component<{}, MainLayoutState> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <Header />

        <Router>
          <main>
            <Route path="/" exact component={MainPage} />
            <Route path="/contacts" component={MapPage} />
          </main>
        </Router>
        <SideDialog />
        <SideBar />
        <footer>
          <Footer />
        </footer>
      </React.Fragment>
    )
  }
}

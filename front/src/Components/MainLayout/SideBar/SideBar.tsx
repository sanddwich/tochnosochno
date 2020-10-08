import React, { Component } from 'react'
import './SideBar.scss'
import SideDialog from '../SideDialog/SideDialog'

import { showOrderDialog, showCartDialog, showCookingTimeDialog } from '../../../Redux/actions/app'
import { connect } from 'react-redux'

interface SideBarState {}

interface SideBarProps {
  showOrderDialog: () => {}
  showCartDialog: () => {}
  showCookingTimeDialog: () => {}
}

class SideBar extends Component<SideBarProps, SideBarState> {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <div className="navbar fixed-bottom fixed-right ">
        <div className="navbar-menu">
          <div className="nav-item">
            <a href="/" className="nav-link">
              <div className="navbar-image">
                <img src="images/home-2-line.svg" alt="Home" />
              </div>
            </a>
          </div>
          <div className="nav-item">
            <a href="/contacts" className="nav-link">
              <img src="images/compass-line.svg" alt="Map" />
            </a>
          </div>
          <div
            onClick={() => {
              this.props.showCookingTimeDialog()
            }}
            className="nav-item"
          >
            <a
              // href="/#"
              className="nav-link"
            >
              <img src="images/history-line.svg" alt="Map" />
            </a>
          </div>
          <div
            onClick={() => {
              this.props.showCartDialog()
            }}
            className="nav-item"
          >
            <a
              // href="/#"
              className="nav-link"
            >
              <img src="images/shopping-cart-line.svg" alt="Map" />
            </a>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  showOrderDialog,
  showCookingTimeDialog,
  showCartDialog,
}

export default connect(null, mapDispatchToProps)(SideBar)

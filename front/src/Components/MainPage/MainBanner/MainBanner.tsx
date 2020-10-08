import React from 'react'
import './MainBanner.scss'
import { Container } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

interface MainBannerProps {}

interface MainBannerState {}

export default class MainBanner extends React.Component<MainBannerProps, MainBannerState> {
  bannerRender = (): any => {
    if (window.screen.width > 720) {
      return (
        <Container fluid className="MainBannerState p-0 m-0">
          <Container fluid className="d-flex justify-content-end p-0 m-0">
            <div className="pomidorka">
              <img src="images/tomat.png" alt="" />
            </div>
          </Container>
          <Image className="main-banner ml-4" src="images/banner2.png" fluid />
          <Container fluid className="d-flex justify-content-start p-0 m-0">
            <div className="salat">
              <img src="images/salat.png" alt="" />
            </div>
          </Container>
        </Container>
      )
    } else {
      return (
        <Container fluid className="MainBannerState p-0 m-0">
          <Container fluid className="d-flex justify-content-end p-0 m-0">
            <div className="pomidorka">
              <img src="images/tomat.png" alt="" />
            </div>
          </Container>
          <Image className="main-banner" src="images/bannermobile.png" fluid />
          <Container fluid className="d-flex justify-content-start p-0 m-0">
            <div className="salat">
              <img src="images/salat.png" alt="" />
            </div>
          </Container>
        </Container>
      )
    }
  }

  render() {
    return (
      <Container fluid className="MainBannerState p-0 m-0">
        {this.bannerRender()}
      </Container>
    )
  }
}

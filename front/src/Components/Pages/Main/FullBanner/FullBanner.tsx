import React from 'react'
import { Container } from 'react-bootstrap'

import './FullBanner.scss'

interface FullBannerProps {}

interface FullBannerState {}

export default class FullBanner extends React.Component<FullBannerProps, FullBannerState> {
  render() {
    return (
      <Container fluid className="FullBanner m-0 p-0 mb-4">
        <Container className="p-0 d-none d-sm-block">
          <img className="img-fluid" src="/images/banners/full_banner.jpg" alt="" />
        </Container>

        <Container className="p-0 d-flex d-sm-none justify-content-center">
          <img className="img-fluid" src="/images/banners/full_banner_mob.jpg" alt="" />
        </Container>
      </Container>
    )
  }
}

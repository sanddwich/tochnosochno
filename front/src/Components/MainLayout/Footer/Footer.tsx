import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import RoundButton from '../../../SharedComponents/RoundButton/RoundButton'
import './Footer.scss'

interface FooterProps {}

interface FooterState {}

export default class Footer extends React.Component<FooterProps, FooterState> {
  render() {
    return (
      <Container fluid className="Footer">
        <Container className="p-0 pt-5 pb-5">
          <Row className="p-0 m-0">
            <Col className="p-0 m-0" lg={7}>
              <Row className="p-0 m-0 d-flex justify-content-between" xs={6}>
                <Col className="Footer__logo">
                  <img src="images/logo.svg" alt="Logo" />
                </Col>
                <Col className="p-0 m-0 d-flex justify-content-lg-end" xs={6}>
                  <Row className="Footer__socialCont d-flex align-items-center">
                    <Col className="Footer__socialContTitle pr-2" md={8}>Социальные сети</Col>
                    <Col className="Footer__socialContImgs" md={4}>
                      <div className="Footer__socialContImg pr-2">
                        <RoundButton
                          icon="instagram.svg"
                          backgroundColor="white"
                          onClick={() => window.open('http://instagram.com')}
                        />
                      </div>
                      <div className="Footer__socialContImg pr-2">
                        <RoundButton
                          icon="vk.svg"
                          backgroundColor="white"
                          onClick={() => window.open('http://vk.com')}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col className="p-0 m-0 d-flex justify-content-lg-end align-items-center text-right" lg={5}>
              Часы работы ресторана с 10:00 - 00:00
            </Col>
          </Row>
        </Container>
      </Container>

      // <footer className="footer">
      //   <div className="container p-5">
      //     <div className="row">
      //       <div className="col-md-6 d-flex">
      //         <div className="row">
      //           <img src="images/logo.svg" alt="Logo" />
      //           <div className="footer__social">
      //             Социальные сети
      //             <RoundButton
      //               icon="instagram.svg"
      //               backgroundColor="white"
      //               onClick={() => window.open('http://instagram.com')}
      //             />
      //             <RoundButton icon="vk.svg" backgroundColor="white" onClick={() => window.open('http://vk.com')} />
      //           </div>
      //           <div className="footer__contacts">
      //             <div className="row">
      //               <div className="col-6 m-0 p-0">
      //                 <div className="footer__contats__title">Телефон ресторана</div>
      //                 <div className="footer__contats__phone"> 46-46-07</div>
      //               </div>
      //               <div className="col-6 m-0 p-0">
      //                 <div className="footer__contats__title">Телефон доставки</div>
      //                 <div className="footer__contats__phone"> 46-46-02</div>
      //               </div>
      //             </div>
      //           </div>
      //         </div>

      //         <div className="row"></div>
      //       </div>

      //       <div className="col-md-3"></div>

      //       <div className="col-md-3"></div>
      //     </div>
      //   </div>
      // </footer>
    )
  }
}

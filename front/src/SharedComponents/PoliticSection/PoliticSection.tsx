import React from 'react'

import './PoliticSection.scss'
import 'react-datepicker/dist/react-datepicker.css'
import CheckBox from '../CheckBox/CheckBox'
import { RootState } from '../../Redux'
import { connect } from 'react-redux'

import { setOrderPolitic } from '../../Redux/actions/order'

interface PoliticSectionProps {
  setOrderPolitic: (smsCheck: boolean, ruleCheck: boolean, personCheck: boolean) => void
  smsCheck: boolean
  personCheck: boolean
  ruleCheck: boolean
}

interface PoliticSectionState {}

class PoliticSection extends React.Component<PoliticSectionProps, PoliticSectionState> {
  constructor(props: PoliticSectionProps) {
    super(props)
  }

  ruleCheckHandle = (event: React.ChangeEvent<HTMLInputElement>, selected: boolean) => {
    const checkElement = event.target as HTMLElement
    if (checkElement.id === 'ruleCheck')
      this.props.setOrderPolitic(this.props.smsCheck, selected, this.props.personCheck)
    if (checkElement.id === 'personCheck')
      this.props.setOrderPolitic(this.props.smsCheck, this.props.ruleCheck, selected)
    if (checkElement.id === 'smsCheck')
      this.props.setOrderPolitic(selected, this.props.ruleCheck, this.props.personCheck)
  }

  render() {
    return (
      <div className="PoliticSection">
        <CheckBox
          id="ruleCheck"
          name="ruleCheck"
          selected={this.props.ruleCheck}
          onClick={(event: React.ChangeEvent<HTMLInputElement>, selected) => this.ruleCheckHandle(event, selected)}
          label="Я подтверждаю, что ознакомился с правилами продажи 
        товаров, а также cо всеми документами, размещенными на сайте по адресу и 
        подтверждаю принятие правил продажи товаров на сайте в полном объеме без ограничений."
        />
        <CheckBox
          id="personCheck"
          name="personCheck"
          selected={this.props.personCheck}
          onClick={(event: React.ChangeEvent<HTMLInputElement>, selected) => this.ruleCheckHandle(event, selected)}
          label="Я даю свое согласие на сбор и обработку моих 
         персональных данных в соответствии с политикой конфиденциальности."
        />
        <CheckBox
          id="smsCheck"
          name="smsCheck"
          selected={this.props.smsCheck}
          onClick={(event: React.ChangeEvent<HTMLInputElement>, selected) => this.ruleCheckHandle(event, selected)}
          label="Осуществляя заказ на сайте я даю свое согласие на 
               получение направляемых мне смс-сообщений и электронных писем 
               рекламного и информационного характера."
        />
      </div>
    )
  }
}

const mapDispatchToProps = {
  setOrderPolitic,
}

const mapStateToProps = (state: RootState) => {
  const { smsCheck, ruleCheck, personCheck } = state.order
  return {
    smsCheck,
    ruleCheck,
    personCheck,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PoliticSection)

import React from 'react'

import './PoliticSection.scss'
import 'react-datepicker/dist/react-datepicker.css'
import CheckBox from '../CheckBox/CheckBox'

interface PoliticSectionProps {}

interface PoliticSectionState {}

export default class PoliticSection extends React.Component<PoliticSectionProps, PoliticSectionState> {
  constructor(props: PoliticSectionProps) {
    super(props)
  }

  render() {
    return (
      <div className="PoliticSection">
        <CheckBox
          id="ruleCheck"
          name="ruleCheck"
          selected={false}
          onClick={() => console.log('ruleCheck')}
          label="Я подтверждаю, что ознакомился с правилами продажи 
        товаров, а также cо всеми документами, размещенными на сайте по адресу и 
        подтверждаю принятие правил продажи товаров на сайте в полном объеме без ограничений."
        />
        <CheckBox
          id="personCheck"
          name="personCheck"
          selected={false}
          onClick={() => console.log('personCheck')}
          label="Я даю свое согласие на сбор и обработку моих 
         персональных данных в соответствии с политикой конфиденциальности."
        />
        <CheckBox
          id="smsCheck"
          name="smsCheck"
          selected={false}
          onClick={() => console.log('smsCheck')}
          label="Осуществляя заказ на сайте я даю свое согласие на 
               получение направляемых мне смс-сообщений и электронных писем 
               рекламного и информационного характера."
        />
      </div>
    )
  }
}

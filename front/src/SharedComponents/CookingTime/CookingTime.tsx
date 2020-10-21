import React from 'react'
import RadioButton from '../RadioButton/RadioButton'
import DatePicker from 'react-datepicker'
import ru from 'date-fns/locale/ru'

import './CookingTime.scss'

interface CookingTimeProps {}

interface CookingTimeState {
  isSelectTime: boolean
  cookingTime: any
}

export default class CookingTime extends React.Component<CookingTimeProps, CookingTimeState> {
  constructor(props: CookingTimeProps) {
    super(props)
    this.state = {
      isSelectTime: true,
      cookingTime: null,
    }
  }

  addDay = (dayAmount: number) => {
    const date = new Date()
    date.setDate(date.getDate() + dayAmount)
    return date
  }

  selectTime = () => {
    this.setState({
      isSelectTime: true,
    })
  }

  selectSoon = () => {
    this.setState({
      isSelectTime: false,
    })
  }

  setCookingTime = (cookingTime: Date | [Date, Date] | null) => {
    this.setState({ cookingTime })
  }

  render() {
    console.log(this.state.cookingTime)
    return (
      <div className="CookingTime">
        <div className="CookingTime__select">
          <RadioButton onClick={this.selectSoon} selected={!this.state.isSelectTime} label="Как можно скорее" />
          <RadioButton onClick={this.selectTime} selected={this.state.isSelectTime} label="К определенному времени" />
        </div>

        {this.state.isSelectTime ? (
          <div className="CookingTime__time">
            <DatePicker
              selected={this.state.cookingTime}
              locale={ru}
              showTimeSelect
              timeFormat="p"
              timeIntervals={15}
              dateFormat="Pp"
              onChange={(cookingTime) => this.setCookingTime(cookingTime)}
              minDate={new Date()}
              maxDate={this.addDay(5)}
              minTime={new Date()}
              maxTime={new Date()}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

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
      cookingTime: this.addHour(1),
    }
  }

  excludeTimes = (startWorkHour: number, minutesRange: number) => {
    let hour = 0
    let minute = 0
    const date = new Date()
    const excludeTimes: Date[] = []
    const currentHour = date.getHours()
    if (this.state.cookingTime.getDay() === date.getDay()) {
      for (hour = currentHour + 1; hour >= startWorkHour; hour--) {
        for (minute = 0; minute <= 60; minute = minute + minutesRange) {
          excludeTimes.push(this.setTime(hour, minute))
        }
      }
    }

    return excludeTimes
  }

  filterPassedTime = (time: Date) => {
    const currentDate = new Date()
    const selectedDate = new Date(time)

    return currentDate.getTime() < selectedDate.getTime()
  }

  addHour = (hourAmount: number) => {
    const date = new Date()
    date.setHours(date.getHours() + hourAmount)
    return date
  }

  addDay = (dayAmount: number) => {
    const date = new Date()
    date.setDate(date.getDate() + dayAmount)
    return date
  }

  setTime = (hour: number, minute: number) => {
    const date = new Date()
    date.setHours(hour)
    date.setMinutes(minute)
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
    return (
      <div className="CookingTime">
        <div className="CookingTime__select">
          <RadioButton
            id="radioSoon"
            name="radio"
            onClick={this.selectSoon}
            selected={!this.state.isSelectTime}
            label="Как можно скорее"
          />
          <RadioButton
            id="radioTime"
            name="radio"
            onClick={this.selectTime}
            selected={this.state.isSelectTime}
            label="К определенному времени"
          />
        </div>

        {this.state.isSelectTime ? (
          <div className="CookingTime__dateTime">
            <div className="CookingTime__dateTime__date">
              <DatePicker
                selected={this.state.cookingTime}
                locale={ru}
                onChange={(cookingTime) => this.setCookingTime(cookingTime)}
                minDate={new Date()}
                maxDate={this.addDay(5)}
                dateFormat="d MMMM"
                placeholderText="Дата доставки"
                //   withPortal
              />
            </div>

            <div className="CookingTime__dateTime__time">
              <DatePicker
                selected={this.state.cookingTime}
                locale={ru}
                onChange={(cookingTime) => this.setCookingTime(cookingTime)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                filterDate={this.filterPassedTime}
                timeCaption="Время"
                dateFormat="HH:mm"
                excludeTimes={this.excludeTimes(8, 15)}
                minTime={this.setTime(8, 0)}
                maxTime={this.setTime(20, 0)}
                placeholderText="Время"
              />
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

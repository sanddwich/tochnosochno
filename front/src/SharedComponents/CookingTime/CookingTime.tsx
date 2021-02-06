import React from 'react'
import RadioButton from '../RadioButton/RadioButton'
import DatePicker from 'react-datepicker'
import ru from 'date-fns/locale/ru'
import { setPrepareDate } from '../../Redux/actions/order'
import './CookingTime.scss'
import { connect } from 'react-redux'
import { format } from 'fecha'

interface CookingTimeProps {
  setPrepareDate: (prepareDate: string) => void
}

interface CookingTimeState {
  isSelectTime: boolean
  cookingDate: any
  cookingTime: any
}

class CookingTime extends React.Component<CookingTimeProps, CookingTimeState> {
  constructor(props: CookingTimeProps) {
    super(props)
    this.state = {
      cookingDate: new Date(),
      isSelectTime: false,
      cookingTime: this.addHour(1),
    }
  }

  componentDidMount() {
    this.selectSoon()
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
    if (this.state.cookingTime) {
      this.props.setPrepareDate(format(new Date(this.state.cookingTime.toString()), 'YYYY-MM-DD HH:mm:ss.SSS'))
    }
  }

  selectSoon = () => {
    this.setState({
      isSelectTime: false,
    })
    // this.props.setPrepareDate(format(this.addHour(1), 'YYYY-MM-DD HH:mm:ss.SSS'))
    this.props.setPrepareDate('')
  }

  setCookingTime = (cookingTime: Date | [Date, Date] | null) => {
    this.setState({ cookingTime })
    if (cookingTime) {
      this.props.setPrepareDate(format(new Date(cookingTime.toString()), 'YYYY-MM-DD HH:mm:ss.SSS'))
    }
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
                excludeTimes={this.excludeTimes(1, 15)}
                minTime={this.setTime(1, 0)}
                maxTime={this.setTime(24, 0)}
                placeholderText="Время"
              />
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapDispatchToProps = {
  setPrepareDate,
}

export default connect(null, mapDispatchToProps)(CookingTime)

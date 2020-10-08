import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './ByDateEntryPage.scss'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import InputMask from 'react-input-mask'

interface ByDateEntryPageProps {
  getOrderTime: (dateTime: string) => void
}

interface ByDateEntryPageState {
  calendar: {
    date: Date | Date[]
    resultData: string
    today: number
    startDate: number
    maxDate: number
    visualDate: string
    visualTime: string
    workTimeBegin: string
    workTimeEnd: string
    workPool: WorkPool[]
    changeInput: number
    error: boolean
  }
}

interface WorkPool {
  workTimeBegin: number
  workTimeEnd: number
}

const orderDays: number = 7
const orderMinutesDelay: number = 60

const timeBegin: string = '8:00'
const timeEnd: string = '22:00'

export default class ByDateEntryPage extends React.Component<ByDateEntryPageProps, ByDateEntryPageState> {
  constructor(props: ByDateEntryPageProps) {
    super(props)
    this.state = {
      calendar: {
        date: new Date(),
        resultData: '',
        today: 0,
        startDate: 0,
        maxDate: 0,
        visualDate: '',
        visualTime: '',
        workTimeBegin: timeBegin,
        workTimeEnd: timeEnd,
        workPool: this.getWorkPool(new Date(), timeBegin, timeEnd),
        changeInput: Math.random(),
        error: false,
      },
    }
  }

  getLocalDateString = (date: Date): string => {
    return date.toLocaleDateString()
  }

  getLocalTimeString = (date: Date): string => {
    date = new Date(date.valueOf() + orderMinutesDelay * 60 * 1000)
    const timeString: string = date.toLocaleTimeString()
    return timeString.substr(0, timeString.length - 3)
  }

  getWorkPool = (date: Date, workTimeBegin: string, workTimeEnd: string): WorkPool[] => {
    let workPool: WorkPool[] = []

    const workDays = orderDays
    const workTimeBeginHours = workTimeBegin.split(':')[0]
    const workTimeBeginMinutes = workTimeBegin.split(':')[1]
    const workTimeEndHour = workTimeEnd.split(':')[0]
    const workTimeEndMinutes = workTimeEnd.split(':')[1]

    const workMonth = date.getMonth()
    const workYear = date.getFullYear()

    for (let i = 0; i < workDays; i++) {
      const workDay = parseInt(date.getDate().toString()) + i
      const wtb: number = new Date(
        workYear,
        workMonth,
        workDay,
        parseInt(workTimeBeginHours),
        parseInt(workTimeBeginMinutes) + orderMinutesDelay
      ).valueOf()
      const wte: number = new Date(
        workYear,
        workMonth,
        workDay,
        parseInt(workTimeEndHour),
        parseInt(workTimeEndMinutes)
      ).valueOf()
      workPool.push({ workTimeBegin: wtb, workTimeEnd: wte })
    }

    return workPool
  }

  getNextDay = ():number => {
    const date: Date = new Date(Date.now() + 12*3600*1000)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const hours: number = parseInt(timeBegin.split(':')[0])
    const minutes: number = parseInt(timeBegin.split(':')[1])

    return (new Date(year,month,day,hours,minutes)).valueOf()
  }

  //Проверка - не поздно ли заказывать сегодня
  canBeOrderToday = (ms: number): boolean => {
    const maybeTime = ms + orderMinutesDelay * 60 * 1000 + (2000*60)  //+2 минуты для успешной проверки при инициализации
    const timeString = new Date(maybeTime).getHours().toString() + ':' + new Date(maybeTime).getMinutes().toString()
    const maybeTimeValid = this.checkEntryTime(timeString)
    // console.log(maybeTimeValid)
    return maybeTimeValid
  }

  componentDidMount() {
    const calendar = this.state.calendar
    const today = Date.now()

    this.canBeOrderToday(today) ? (calendar.today = today) : (calendar.today = this.getNextDay())
    // console.log(new Date(calendar.today) + '  ' + new Date(today))
    calendar.startDate = today

    calendar.maxDate = calendar.today + (orderDays - 1) * 24 * 3600 * 1000
    calendar.date = new Date(calendar.today)
    // console.log(calendar.date)
    calendar.visualDate = this.getLocalDateString(calendar.date)
    calendar.visualTime = this.getLocalTimeString(calendar.date)
    calendar.workPool = this.getWorkPool(calendar.date, calendar.workTimeBegin, calendar.workTimeEnd)

    this.setState({ calendar })
  }

  getBeginDayTime = (inputString: string):string => {
    const minutes:number = parseInt(inputString.split(':')[0])*60 + parseInt(inputString.split(':')[1])
    const dateResult = new Date(minutes*60*1000-4*3600*1000)
    return this.getLocalTimeString(dateResult)
  }

  onChange = (date: Date | Date[]) => {
    const calendar = this.state.calendar
    calendar.date = date as Date

    calendar.visualDate = this.getLocalDateString(date as Date)

    if (this.getLocalDateString(calendar.date as Date) !== this.getLocalDateString(new Date(calendar.startDate))) {  
      calendar.visualTime = this.getBeginDayTime(timeBegin)
    } else {
      calendar.visualTime = this.getLocalTimeString(new Date() as Date)
    }

    calendar.resultData = calendar.visualDate + ' ' + calendar.visualTime    
    calendar.changeInput = Math.random()
    calendar.error = false

    this.setState({ calendar })

    this.props.getOrderTime(this.state.calendar.resultData)
  }

  getMonth = (date: Date) => {
    const monthList = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ]
    const month = monthList[date.getMonth()]
    return month
  }

  checkEntryTime = (timeString: string): boolean => {
    const date = this.state.calendar.date as Date

    const minutes = parseInt(timeString.split(':')[1])
    const hours = parseInt(timeString.split(':')[0])

    if (hours>23 || minutes > 59) {
      return false
    }

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const ms = new Date(year, month, day, hours, minutes).valueOf()
    
    let isValid = false

    this.state.calendar.workPool.forEach((el) => {
      if (el.workTimeBegin <= ms && ms <= el.workTimeEnd) {
        const timeLine = Date.now() + orderMinutesDelay*60*1000 
        if (ms > timeLine) {
          isValid = true
        }
      }
    })

    return isValid
  }

  onInputHandler = (value: string): void => {
    if (value.length === 5) {
      const calendar = this.state.calendar
      calendar.error = !this.checkEntryTime(value)
      if (!calendar.error) {
        calendar.resultData = this.state.calendar.visualDate + ' ' + value
      }
      this.setState({ calendar })

      this.props.getOrderTime(this.state.calendar.resultData)
    }
  }

  render() {
    const defaultTime: string = this.state.calendar.visualTime.toString()
    return (
      <Container fluid className="p-0 m-0 ByDateEntryPageCont">
        <Container fluid className="ByDateEntryPage p-0 m-0">
          <Row>
            <Col className="d-flex justify-content-center">
              <Calendar
                className="ByDateEntryPage__calendar"
                onChange={this.onChange}
                value={this.state.calendar.date}
                minDate={new Date(this.state.calendar.today)}
                maxDate={new Date(this.state.calendar.maxDate)}
                prev2Label={null}
                next2Label={null}
                tileClassName="ByDateEntryPage__tile"
                formatMonthYear={(locale, date): any => this.getMonth(date)}
              />
            </Col>
          </Row>
          <Row className="dateTimeStrings m-0 p-0 pt-3 pb-3">
            <Col xs={2} className="p-0 m-0"></Col>
            <Col xs={4} className="p-0 m-0 pl-2 pr-2">
              <div className="dateTimeStrings__div d-flex justify-content-center">{this.state.calendar.visualDate}</div>
            </Col>
            <Col xs={4} className="p-0 m-0 pl-2 pr-2">
              <div id="input" className="dateTimeStrings__div d-flex justify-content-center">
                <InputMask
                  key={this.state.calendar.changeInput}
                  className="timeInput"
                  mask="99:99"
                  maskChar=""
                  placeholder={this.state.calendar.visualTime}
                  onInput={(event) => this.onInputHandler(event.currentTarget.value)}
                  style={{ color: this.state.calendar.error ? '#ef5350' : '' }}
                />
                {/* {this.state.calendar.visualTime} */}
              </div>
            </Col>
            <Col xs={2} className="p-0 m-0"></Col>
          </Row>
          {this.state.calendar.error ? (
            <Row className="p-0 m-0">
              <Col className="errorTimePicker p-0 m-0">
                Доставка работает с {timeBegin} до {timeEnd}. На подготовку заказа требуется не менее {orderMinutesDelay}
                 минут. В указанное вами время мы не сможем выполнить заказ
              </Col>
            </Row>
          ) : (
            ''
          )}
        </Container>
      </Container>
    )
  }
}

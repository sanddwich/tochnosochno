import React from 'react'
import { connect } from 'react-redux'
import { YMaps, Map, Placemark } from 'react-yandex-maps'
import Organization from '../../../Interfaces/Organization'
import Terminal from '../../../Interfaces/Terminal'
import { RootState } from '../../../Redux'
import BlockName from '../../../SharedComponents/BlockName/BlockName'

import './Contacts.scss'

interface ContactsProps {
  organizationId: string
  terminals: Terminal[]
  organizations: Organization[]
}

interface ContactsState {}

class Contacts extends React.Component<ContactsProps, ContactsState> {
  getCurrentOrganization() {
    return this.props.organizations.find((organization) => organization.id === this.props.organizationId)
  }

  getWorkTime() {
    return this.getCurrentOrganization()?.workTime
  }

  getAdditionalInfo() {
    return this.getCurrentOrganization()?.additionalInfo
  }

  render() {
    return (
      <div className="contacts container mt-5">
        <div className="row">
          <div className="col-md-5">
            <BlockName name="Рестораны" />
            {this.props.terminals.map((terminal) => {
              return (
                <div key={terminal.id} className="contacts__address">
                  <img src="/images/icons/map-pin.svg" alt="" />
                  <div className="contacts__address__text">{terminal.name}</div>
                </div>
              )
            })}
          </div>
          <div className="col-md-7 contacts__delivery">
            <BlockName name="Доставка" />

            <div className="row contacts__delivery__row">
              <div className="col-sm-6 pt-3">Работаем {this.getWorkTime()}</div>
              <div className="col-sm-6 pt-3">
                Минимальный заказ от <span className="bold">500</span> руб
              </div>
            </div>
            <div className="row contacts__delivery__row">
              <div className="col-sm-6 pt-3">
                Время доставки 60 минут
                <div className="footnote">{this.getAdditionalInfo()}</div>
              </div>

              <div className="col-sm-6 pt-3">Доставка от 0 до 400 руб</div>
            </div>
          </div>
        </div>
        <div className="contacts__map mt-4">
          <YMaps>
            <Map
              className="contacts__map__yandex"
              state={{
                center: [parseFloat(this.props.terminals[0]?.latitude), parseFloat(this.props.terminals[0]?.longitude)],
                zoom: 17,
              }}
            >
              {this.props.terminals.map((terminal) => {
                return (
                  <Placemark
                    key={terminal.id}
                    geometry={[parseFloat(terminal.latitude), parseFloat(terminal.longitude)]}
                  />
                )
              })}
            </Map>
          </YMaps>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: RootState) => {
  const { organizationId } = state.app
  const { organizations, terminals } = state.menu

  return {
    organizationId,
    organizations,
    terminals,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts)

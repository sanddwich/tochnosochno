import React from 'react'
import './Header.scss'

interface HeaderProps {}

interface HeaderState {}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  render() {
    return (
      <h1>Header</h1>
    )
  }
}
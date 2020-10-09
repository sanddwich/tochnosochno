import React from 'react'
import { Container } from 'react-bootstrap'

import './UserProfile.scss'

interface UserProfileProps {}

interface UserProfileState {}

export default class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  render() {
    return (
      <Container className="UserProfile p-0 m-0">
        <h1>UserProfile</h1>
      </Container>
    )
  }
}

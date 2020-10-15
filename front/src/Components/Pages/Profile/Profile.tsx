import React from 'react'
import { Container } from 'react-bootstrap'

import './Profile.scss'

interface ProfileProps {}

interface ProfileState {}

export default class Profile extends React.Component<ProfileProps, ProfileState> {
  render() {
    return (
      <Container className="Profile m-0 p-0 mt-4">
        <h1>Profile</h1>
      </Container>
    )
  }
}

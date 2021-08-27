import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'
import { userChords, deleteChord } from './../../api/chord-auth'

class UserChords extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      chords: null
    }
  }

  componentDidMount () {
    const { user, msgAlert } = this.props
    userChords(user)
      .then(res => this.setState({ chords: res.data.chords }))
      .then(() => msgAlert({ heading: 'Index success', message: 'Here are your chords', variant: 'success' }))
      .catch(err => msgAlert({ heading: 'Index failed', message: 'Something went wrong: ' + err.message, variant: 'danger' }))
  }

  // Destroy: a custom function that deletes a chord.
  destroy = (chordId) => {
    const { user, msgAlert } = this.props
    deleteChord(user, chordId)
      .then(() => {
        const newChords = Object.assign({}, this.state)
        newChords.chords = newChords.chords.filter(chord => chord._id !== chordId)
        this.setState({ chords: newChords.chords })
      })
      .then(() => msgAlert({ heading: 'Delete success', message: 'Chord deleted', variant: 'success' }))
      .catch(err => msgAlert({ heading: 'Delete failed', message: 'Something went wrong: ' + err.message, variant: 'danger' }))
  }

  render () {
    const { chords } = this.state
    if (this.state.chords === null) {
      return 'Loading...'
    }
    let chordJsx
    if (chords.length === 0) {
      chordJsx = 'No chords, go create some'
    } else {
      const ownedChords = chords.filter(chord => this.props.user._id === chord.owner)
      chordJsx = ownedChords.map((chord) => (
        <Card key={chord._id} style={{ width: '18rem', margin: '5px' }}>
          <Card.Body>
            <Card.Title>{chord.title}</Card.Title>
            <Card.Text>{chord.body}</Card.Text>
            <Button onClick={() => this.destroy(chord._id)}>Delete Chord</Button>
            <Button onClick={() => this.props.history.push(`/chords/${chord._id}/update`)}>Update Chord</Button>
          </Card.Body>
        </Card>
        // <li key={chord._id}>
        //   <h5>{chord.title}</h5>
        //   <p>{chord.body}</p>
        //   <Button onClick={() => this.destroy(chord._id)}>Delete Chord</Button>
        //   <Button onClick={() => this.props.history.push(`/chords/${chord._id}/update`)}>Update Chord</Button>
        //   {/* <Button onClick={() => <Redirect to={`/chords/${chord._id}/update`}/>}>Update Chord</Button> */}
        //   {/* <Link to={`/chords/${chord._id}`}>{chord.title}</Link> */}
        // </li>
      ))
    }
    return (
      <>
        <h3>Welcome to your wall, {this.props.user.name}!</h3>
        {chordJsx}
      </>
    )
  }
}

export default withRouter(UserChords)

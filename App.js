import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import firebase from './firebase'

import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        alert(
          'Usuário logado!'
          + '\nUID: ' + user.uid
          + '\nNome: ' + user.displayName
          + '\nLogin por: ' + user.providerData[0].providerId
        )
        console.log(user)
      } else {
        alert('Usuário deslogado')
      }
    })
  }

  signUpUser = () => {
    if (this.state.password.length < 6) {
      alert('Insira uma senha com pelo menos 6 caracteres')
    } else {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
        alert('Erro ao cadastrar com email e senha!')
        console.log(error)
      })
    }
  }

  loginUser = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
      alert('Erro ao acessar com email e senha')
      console.log(error)
    })
  }

  logoutUser = () => {
    firebase.auth().signOut()
  }

  async loginWithFacebook() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1240328362782956', { permissions: ['public_profile'] })

    if (type == 'success') {
      const credentials = firebase.auth.FacebookAuthProvider.credential(token)
      firebase.auth().signInAndRetrieveDataWithCredential(credentials).catch(error => {
        alert('Deu ruim!')
        console.log(error)
      })
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Text>Acesar ou Cadastrar</Text>
          <Text>Email: {this.state.email}</Text>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input autoCorrect={false} autoCapitalize="none"
              onChangeText={(email) => this.setState({ email })} />
          </Item>

          <Item floatingLabel>
            <Label>Senha</Label>
            <Input secureTextEntry={true} autoCorrect={false} autoCapitalize="none"
              onChangeText={(password) => this.setState({ password })} />
          </Item>

          <Button full rounded primary style={{ marginTop: 10 }}
            onPress={() => this.loginWithFacebook()}>
            <Text style={{ color: '#fff' }}>Acessar com o Facebook</Text>
          </Button>

          <Button full rounded success style={{ marginTop: 10 }}
            onPress={() => this.loginUser()}>
            <Text style={{ color: '#fff' }}>Acessar</Text>
          </Button>

          <Button full rounded primary style={{ marginTop: 10 }}
            onPress={() => this.signUpUser()}>
            <Text style={{ color: '#fff' }}>Cadastrar</Text>
          </Button>

          <Button full rounded success style={{ marginTop: 10 }}
            onPress={() => this.logoutUser()}>
            <Text style={{ color: '#fff' }}>Sair</Text>
          </Button>
        </Form>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

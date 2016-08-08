import React from "react"
import ReactDOM from "react-dom"
import randomColor from "randomcolor"

class Chat extends React.Component {
  constructor(props){
    super(props)
    this.state = { messages: [] }
  }
  
  componentDidMount(){
    const server = new WebSocket(`ws://localhost:3000/messages`)
    const user = localStorage.getItem("user") || prompt("Por favor, ingrese su nombre")
    const color = localStorage.getItem("color") || randomColor()
    localStorage.setItem("user", user)
    localStorage.setItem("color", color)

    server.onopen = () => {
      const message = {
        username: user,
        color: color,
        message: "Se acaba de unir!"
      }
      server.send(JSON.stringify(message))
    }

    server.onmessage = e => {
      const messages = JSON.parse(e.data)
      this.setState({ messages })
      window.scrollTo(0, document.body.scrollHeight)
    }

    this.server = server
    this.user = user
    this.color = color
  }

  sendMessage(){
    const message = {
      username: this.user,
      color: this.color,
      message: this.refs.message.value
    }
    this.server.send(JSON.stringify(message))
    this.refs.message.value = " "
  }

handleEnter(e){
    if(e.keyCode === 13){
      this.sendMessage()
    }
  }

  render(){
    return (
      <div>
        <ul>
          {this.state.messages.map((message, i) => {
            return (
              <li key={i}>
                <span class="chip" style={{ color: message.color }}>{message.username}: </span>
                <span>{message.message}</span>
              </li>
            )
          })}
        </ul>
        <input autoFocus placeholder=" Escribir.." type="text"
          ref="message" onKeyUp={this.handleEnter.bind(this)}></input>
      </div>
    )
  }
}

const chat = document.getElementById("chat")
ReactDOM.render(<Chat />, chat)
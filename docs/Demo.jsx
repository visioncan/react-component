import React, { PureComponent } from 'react'
import ReactComponent from '../src/ReactComponent'
import '../src/ReactComponent.scss'

export default class Demo extends PureComponent {
  constructor () {
    super()
    this.state = {
      isOpenManage: false
    }
  }

  render () {
    return (
      <div className="demo">
        <button>Button</button>
        <ReactComponent />
      </div>
    )
  }
}

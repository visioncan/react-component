import React from 'react'
import { shallow } from 'enzyme'
import ReactComponent from '../src/ReactComponent'

it('renders welcome message', () => {
  const wrapper = shallow(<ReactComponent />)
  const welcome = <div className="yp-react-component">Hello, world React Component!</div>
  // expect(wrapper.contains(welcome)).to.equal(true);
  expect(wrapper.contains(welcome)).toEqual(true)
})

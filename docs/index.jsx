import React from 'react'
import ReactDOM from 'react-dom'
import { Catalog, CodeSpecimen, ReactSpecimen } from 'catalog'

import './main.css'

const documentationImports = {
  Demo: require('./Demo')
}
const title = `${NAME} v${VERSION}` // eslint-disable-line no-undef
const pages = [
  {
    path: '/',
    title: 'Readme',
    component: require('../README.md')
  }
]

ReactDOM.render(
  <div>
    <Catalog
      imports={documentationImports}
      pages={pages}
      specimens={{
        javascript: props => <CodeSpecimen {...props} lang="javascript" />,
        js: props => <CodeSpecimen {...props} lang="javascript" />,
        jsx: props => <ReactSpecimen {...props} />
      }}
      title={title} />
  </div>,
  document.getElementById('app')
)

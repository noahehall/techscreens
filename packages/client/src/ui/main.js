'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export const App = () => <h1>bare-bones fullstack</h1>;

const render = (Comp) => {
  ReactDOM.render(
    // <React.StrictMode>
    // <ErrorBoundary>
      <Comp />,
    // </ErrorBoundary>,
    // </React.StrictMode>,
    document.getElementById('root'),
  );
};

render(App);
if (module.hot) module.hot.accept(e => {
  console.error('error accepting hot version of mod/deps');
})


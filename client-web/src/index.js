import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './features/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap-daterangepicker/daterangepicker.css';


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

import React from 'react'
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <AuthWrapper>
      <Router>
        <Routes>
          <Route
            path='/'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          ></Route>
          <Route path='login' element={<Login />}></Route>
          <Route path='*' element={<Error />}></Route>

          {/* <PrivateRoute path='/' exact={true}>
            <Dashboard></Dashboard>
          </PrivateRoute>
          <Route path='/login' exact={true}>
            <Login></Login>
          </Route>
          <Route path='*' exact={true}>
            <Error></Error>
          </Route> */}
        </Routes>
      </Router>
    </AuthWrapper>
  )
}

export default App

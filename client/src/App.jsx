import { BrowserRouter , Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateProject from './pages/CreateProject'
import Profile from './pages/Profile'
import Signin from './pages/Signin'
import Signout from './pages/Signout'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Models from './pages/models'
import Signup from './pages/Signup'
import Privateroute from './Components/Privateroute'
import Update from './pages/Update'
import Listing from './pages/Listing'
import Advcards from './Components/Advcards'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/createproject' element={<CreateProject/>}/>
      <Route path='/models' element={<Models/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/signout' element={<Signout/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/listing/:listingId' element={<Listing/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/profile' element={<Privateroute/>}>
         <Route path='/profile' element={<Profile/>}/>
      </Route>
      <Route path='/update' element={<Privateroute/>}>
         <Route path='/update' element={<Update/>}/>
      </Route>
      
    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App

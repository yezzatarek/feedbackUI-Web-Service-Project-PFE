import React from 'react';
import './App.css';


import Home from './Home/Home';
import {RouteComponentProps} from 'react-router-dom' ;



function App({match}) {

  
  
  return (
    <div className="FullPage" > 
      
    <Home idclient={match.params.idclient} idtemplate={match.params.idTemplate} ></Home>
    </div>
    
  );
}

export default App;

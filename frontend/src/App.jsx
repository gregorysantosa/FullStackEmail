/*
#######################################################################
#
# Copyright (C) 2020-2022 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Home from './Home';
import Login from './Login';

/**
 * Simple component with no state.
 *
 * @return {*}
 * See the basic-react from lecture for an example of adding and
 * reacting to changes in state.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import '../styles/globals.css';
import Head from 'next/head'
import { useState } from 'react';
import UserContext from '../components/util/UserContext';

function MyApp({ Component, pageProps }) {
  const [state, setState] = useState({
    user: null,
    update
  })

  function update(data) {
    setState(Object.assign({}, state, data));
  }

  return (
    <>
      <Head>
        <title>Fake Imgur</title>
      </Head>
      <UserContext.Provider value={state}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  )
}

export default MyApp
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
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous"></link>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossorigin="anonymous"></script>
        <title>Fake Imgur</title>

      </Head>
      <UserContext.Provider value={state}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  )
}

export default MyApp
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { apiConfig } from '../api/api'
//import { useFetchData } from "../api/service1";

export const Route = createFileRoute('/users')({
  component: RouteComponent,
})

function RouteComponent() {
  //const { data: dataa } = useFetchData();

  const [data, setData] = useState([])

  useEffect(() => {
    fetch(apiConfig.usersApi + '/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify(ob),
    })
      .then((res) => {
        // eslint-disable-next-line no-debugger
        debugger
        if (!res.ok) {
          throw `Server error: [${res.status}] [${res.statusText}] [${res.url}]`
        }
        return res.json()
      })
      .then((data) => {
        console.log(data)
        setData(data)
      })
      .catch((err) => {
        console.log('Error in fetch', err)
      })
  }, [])

  return (
    <>
      Hello "/users"!
      {data}
    </>
  )
}

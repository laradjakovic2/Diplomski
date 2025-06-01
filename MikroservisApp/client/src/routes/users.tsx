import { createFileRoute } from '@tanstack/react-router'
import Users from '../components/users/Users'

export const Route = createFileRoute('/users')({
  component: RouteComponent,
})

function RouteComponent() {
  

  return (
    <>
      <Users />
    </>
  )
}

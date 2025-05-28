import { createFileRoute } from '@tanstack/react-router'
import CompetitionDetails from '../../components/CompetitionDetails'

export const Route = createFileRoute('/competitions/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <><CompetitionDetails/></>
}

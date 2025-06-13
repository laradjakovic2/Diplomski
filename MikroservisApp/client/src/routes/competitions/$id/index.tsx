import { createFileRoute } from '@tanstack/react-router'
import CompetitionDetails from '../../../components/competitions/CompetitionDetails'

export const Route = createFileRoute('/competitions/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <><CompetitionDetails/></>
}

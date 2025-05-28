import { createFileRoute } from '@tanstack/react-router'
import TrainingCalendar from '../components/TrainingCalendar'

export const Route = createFileRoute('/calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <><TrainingCalendar/></>
}

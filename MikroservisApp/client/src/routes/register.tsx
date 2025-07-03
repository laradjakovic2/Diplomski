import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '../components/users/RegisterForm';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}

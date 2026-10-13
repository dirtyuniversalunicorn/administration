import { RegisterForm } from "../../../core/auth/components/register-form";

export default function Users() {
	return (
		<section className="flex flex-col gap-6">
			<h1 className="text-2xl font-semibold">Register user</h1>
			<RegisterForm />
		</section>
	);
}

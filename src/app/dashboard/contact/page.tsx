import { currentUser } from "@/src/core/auth/session";
import { contactFeature } from "@/src/features/contact/config";
import { getContact } from "@/src/features/contact/queries";

export default async function Contact() {
	const { can } = await currentUser();
	const contact = await getContact();

	const rows: [string, string | null][] = contact
		? [
				["Email", contact.email],
				["Phone", contact.phone],
				["Mobile", contact.mobile],
				["Address", contact.address],
				["Opening hours", contact.openingHours],
			]
		: [];

	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Contact</h1>
				{contact && can("write") && (
					<a href={contactFeature.routes.edit} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
						Edit contact information
					</a>
				)}
			</div>

			{contact ? (
				<>
					<dl className="grid grid-cols-[8rem_1fr] gap-y-3 rounded-md border border-line bg-surface p-4 text-sm">
						{rows.map(([label, value]) => (
							<div key={label} className="contents">
								<dt className="text-muted">{label}</dt>
								<dd className="whitespace-pre-line">{value ?? "—"}</dd>
							</div>
						))}
					</dl>
					<p className="text-xs text-muted">
						Last edited by <span className="font-medium text-foreground">{contact.editedBy.name ?? contact.editedBy.email}</span> on {contact.updatedAt.toLocaleString("en-GB")}. Added by{" "}
						{contact.postedBy.name ?? contact.postedBy.email} on {contact.createdAt.toLocaleDateString("en-GB")}.
					</p>
				</>
			) : (
				<div className="flex flex-col items-start gap-4 rounded-md border border-line bg-surface p-6">
					<p className="text-sm text-muted">No contact information has been added yet. Add it here and it will be available to show on your site.</p>
					{can("write") && (
						<a href={contactFeature.routes.edit} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
							Add contact information
						</a>
					)}
				</div>
			)}
		</section>
	);
}

import { currentUser } from "@/src/core/auth/session";
import { NoAccess } from "@/src/core/ui/no-access";
import { ContactForm } from "@/src/features/contact/components/contact-form";
import { contactFeature } from "@/src/features/contact/config";
import { getContact } from "@/src/features/contact/queries";

export default async function EditContact() {
	if (!(await currentUser()).can("write")) return <NoAccess />;
	const contact = await getContact();

	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<a href={contactFeature.routes.index} className="text-sm text-muted">
				← Contact
			</a>
			<h1 className="text-2xl font-semibold">{contact ? "Edit contact information" : "Add contact information"}</h1>
			<ContactForm
				mode={contact ? "edit" : "add"}
				defaults={
					contact
						? {
								email: contact.email,
								phone: contact.phone,
								mobile: contact.mobile,
								address: contact.address,
								openingHours: contact.openingHours,
							}
						: undefined
				}
			/>
		</section>
	);
}

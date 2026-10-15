import { saveContactAction } from "@/src/features/contact/actions/contactActions";
import { ContactForm } from "@/src/features/contact/components/contact-form";
import { getContact } from "@/src/features/contact/queries";
import { contactFeature } from "@/src/features/contact/config";

export default async function EditContact() {
	const contact = await getContact();

	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<a href={contactFeature.routes.index} className="text-sm text-muted">
				← Contact
			</a>
			<h1 className="text-2xl font-semibold">
				{contact ? "Edit contact information" : "Add contact information"}
			</h1>
			<ContactForm
				action={saveContactAction}
				submitLabel={contact ? "Save changes" : "Add contact information"}
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

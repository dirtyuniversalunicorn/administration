export function NoAccess() {
	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-2">
			<h1 className="text-2xl font-semibold">No access</h1>
			<p className="text-sm text-muted">Your role does not allow you to open this page. Ask an admin if you need access.</p>
		</section>
	);
}

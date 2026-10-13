// Pure CSS hover preview: the big image only exists as a hidden element until
// the row's icon is hovered, so no client JS is needed.
export function ImagePreview({ src, alt }: { src: string; alt: string }) {
	return (
		<span className="group relative inline-block">
			<span
				role="img"
				aria-label={`Preview of ${alt}`}
				className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-slate-50 text-slate-500"
			>
				<svg
					viewBox="0 0 24 24"
					className="h-4 w-4"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden="true"
				>
					<rect x="3" y="3" width="18" height="18" rx="2" />
					<circle cx="9" cy="9" r="2" />
					<path d="m21 15-5-5L5 21" />
				</svg>
			</span>
			<img
				src={src}
				alt={alt}
				loading="lazy"
				className="pointer-events-none absolute left-10 top-1/2 z-20 hidden max-h-[70vh] w-[32rem] max-w-[60vw] -translate-y-1/2 rounded-md border border-slate-300 bg-white object-contain shadow-lg group-hover:block"
			/>
		</span>
	);
}

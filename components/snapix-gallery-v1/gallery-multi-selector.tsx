"use client";

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxList,
    useComboboxAnchor,
} from "@/components/ui/combobox";
import type { GalleryType } from "@metalevel/snapix-sdk-core";
import { useState } from "react";

interface GalleryMultiSelectorProps {
	galleries: GalleryType[];
	values: string[];
	onValuesChange: (ids: string[]) => void;
	disabled?: boolean;
}

export function GalleryMultiSelector({
	galleries,
	values,
	onValuesChange,
	disabled = false,
}: GalleryMultiSelectorProps) {
	const anchorRef = useComboboxAnchor();
	const [typedValue, setTypedValue] = useState("");

	const displayGalleries = typedValue
		? galleries.filter((g) =>
				g.name.toLowerCase().includes(typedValue.toLowerCase())
		  )
		: galleries;

	return (
		<Combobox
			multiple
			value={values}
			onValueChange={(newValues) => onValuesChange(newValues as string[])}
			disabled={disabled}
			itemToStringLabel={(id) =>
				galleries.find((g) => g.id === id)?.name ?? String(id)
			}
		>
			<ComboboxChips ref={anchorRef} className="w-full">
				{values.map((id) => {
					const gallery = galleries.find((g) => g.id === id);
					return gallery ? (
						<ComboboxChip key={id}>
							{gallery.name}
						</ComboboxChip>
					) : null;
				})}
				<ComboboxChipsInput
					placeholder={
						values.length === 0 ? "No gallery (ungrouped)…" : "Add gallery…"
					}
					disabled={disabled}
					value={typedValue}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setTypedValue(e.target.value)
					}
				/>
			</ComboboxChips>
			<ComboboxContent anchor={anchorRef}>
				<ComboboxList>
					{displayGalleries.length === 0 ? (
						<div className="py-2 text-center text-sm text-muted-foreground">
							No galleries found.
						</div>
					) : (
						displayGalleries.map((gallery) => (
							<ComboboxItem
								key={gallery.id}
								value={gallery.id}
								onClick={() => setTypedValue("")}
							>
								{gallery.name}
							</ComboboxItem>
						))
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

"use client";

import type React from "react";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import type { GalleryType } from "@metalevel/snapix-sdk-core";
import { UNGROUPED_LABEL, UNGROUPED_KEY } from "./constants";
import { useState } from "react";


interface GallerySelectorProps {
	galleries: GalleryType[];
	value: string | null;
	onValueChange: (id: string | null) => void;
	disabled?: boolean;
}

export function GallerySelector({
	galleries,
	value,
	onValueChange,
	disabled = false,
}: GallerySelectorProps) {
	const allItems = [
		{ id: UNGROUPED_KEY, name: UNGROUPED_LABEL },
		...galleries,
	];

	const [typedValue, setTypedValue] = useState("");

	const displayItems = allItems.filter((item) => {
		if (!typedValue) return true;
		return item.name.toLowerCase().includes(typedValue.toLowerCase());
	});

	return (
		<Combobox
			value={value ?? UNGROUPED_KEY}
			onValueChange={(newValue) => {
				const v = newValue as string | null;
				onValueChange(!v || v === UNGROUPED_KEY ? null : v);
			}}
			disabled={disabled}
			itemToStringLabel={(id) =>
				allItems.find((g) => g.id === id)?.name ?? String(id)
			}
			filter={(id: string, query: string) => {
				if (!query) return true;
				const name = allItems.find((g) => g.id === id)?.name ?? String(id);
				return name.toLowerCase().includes(query.toLowerCase());
			}}
		>
			<ComboboxInput
				placeholder="Select gallery..."
				showClear={false}
				disabled={disabled}
				className="w-56 min-w-[16.45rem]"
				onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
				value={typedValue || (value ? allItems.find((g) => g.id === value)?.name ?? "" : UNGROUPED_LABEL)}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTypedValue(e.target.value)}
			/>
			<ComboboxContent>
				{galleries.length === 0 && <ComboboxEmpty>No galleries found.</ComboboxEmpty>}
				<ComboboxList>
					{displayItems.map((item) => (
						<ComboboxItem key={item.id} value={item.id} onClick={() => setTypedValue('')}>
							{item.name}
						</ComboboxItem>
					))}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

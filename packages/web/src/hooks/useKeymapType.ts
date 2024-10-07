'use client';

import { KeymapType } from "@/lib/types";
import { useLocalStorage } from "usehooks-ts";

export const useKeymapType = (): [KeymapType, (keymapType: KeymapType) => void] => {
    const [keymapType, setKeymapType] = useLocalStorage<KeymapType>("keymapType", "default", { initializeWithValue: false });
    return [ keymapType, setKeymapType ];
}
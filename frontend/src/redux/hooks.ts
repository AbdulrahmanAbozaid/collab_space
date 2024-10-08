import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

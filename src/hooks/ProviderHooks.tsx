import { use } from "react";
import { ContextMenuCtx } from "../components/providers/ContextMenuProvider";
import { DeleteContext } from "../components/providers/DeleteModalProvider";
import { FlashMessageCxt } from "../components/providers/FlashMessageProvider";
import { SidebarCtx } from "../components/providers/SidebarProvider";


export function useSidebar() {
  const context = use(SidebarCtx);
  return context;
}

export function useContextMenu() {
  const context = use(ContextMenuCtx);
  return context;
}

export function useFlashMessage() {
  const context = use(FlashMessageCxt);
  return context;
}

export default function useDeleteModal() {
  const context = use(DeleteContext);
  return context;
}



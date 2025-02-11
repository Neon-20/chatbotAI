import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getFoldersByWorkspaceId = async (workspaceId: string) => {
  const { data: folders, error: foldersError } = await supabase
    .from("folders")
    .select("*")
    .or(`workspace_id.eq.${workspaceId},public.eq.true`)

  if (foldersError) {
    throw new Error("Error fetching folders:" + foldersError.message)
  }
  const sortedFolders = folders?.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
  return sortedFolders
}

export const createFolder = async (folder: TablesInsert<"folders">) => {
  const { data: createdFolder, error } = await supabase
    .from("folders")
    .insert([folder])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdFolder
}

export const updateFolder = async (
  folderId: string,
  folder: TablesUpdate<"folders">
) => {
  const { data: updatedFolder, error } = await supabase
    .from("folders")
    .update(folder)
    .eq("id", folderId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedFolder
}

export const deleteFolder = async (folderId: string) => {
  const { error } = await supabase.from("folders").delete().eq("id", folderId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

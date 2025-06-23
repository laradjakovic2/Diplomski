import { EntityType } from "../models/Enums";
import { MediaRequestModel } from "../models/media";
import { apiConfig } from "./api";


export const getFileUrl = async (
  relatedEntityId: number,
  entityType: EntityType
): Promise<string> => {
  try {
    const queryParams = new URLSearchParams({
      relatedEntityId: relatedEntityId.toString(),
      entityType: entityType.toString(),
    });

    const response = await fetch(
      `${apiConfig.mediaApi}/media/get-file-url?${queryParams}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`[${response.status}] ${response.statusText}`);
    }

    const url = await response.text(); // ili .json() ako backend vraća JSON
    return url;
  } catch (error) {
    console.error("Error fetching image URL:", error);
    throw error;
  }
};

export const uploadMedia = async (media: MediaRequestModel): Promise<void> => {
  try {
    const formData = new FormData();
    if (media.file?.data) {
      formData.append("file", media.file.data, media.file.fileName);
    }
    formData.append("relatedEntityId", media.relatedEntityId.toString());
    formData.append("entityType", media.entityType.toString());
    formData.append("mediaType", media.mediaType.toString());

    const response = await fetch(`${apiConfig.mediaApi}/media/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok)
      throw new Error(`[${response.status}] ${response.statusText}`);
  } catch (err) {
    console.error("Error uploading media", err);
    throw err;
  }
};

import { EntityType, MediaType } from "./Enums";

export interface FileParameter{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  fileName: string;
}

export interface MediaRequestModel
{
    file?: FileParameter;
    relatedEntityId: number;
    entityType: EntityType;
    mediaType: MediaType;
}
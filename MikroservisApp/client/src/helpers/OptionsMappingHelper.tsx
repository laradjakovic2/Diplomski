/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatDate(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const day = date.getDate();
  const month = date.getMonth() + 1; // mjeseci idu od 0 do 11
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export const formatOptions = (options: any) => {
  return (
    options?.map((option: any) => ({
      label: option.name ?? option.title,
      value: option.id,
    })) ?? []
  );
};

export const formatPersonOptions = (options: any) => {
  return (
    options?.map((option: any) => ({
      label: option.name ?? option.title,
      value: option.id,
      clientIds: option.clientIds,
    })) ?? []
  );
};

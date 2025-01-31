/* eslint-disable @typescript-eslint/no-explicit-any */
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
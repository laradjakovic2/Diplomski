import { useQuery } from '@tanstack/react-query';
import { Service1Client } from './api';
import { formatOptions } from '../helpers/OptionsMappingHelper';

export const useFetchData = () => {
    // eslint-disable-next-line no-debugger
    debugger;
    return useQuery({
        queryKey: ['service'],
        queryFn: async () => {
            return formatOptions(await new Service1Client().getData());
        },
        staleTime: 5 * 60 * 1000,
    });
};
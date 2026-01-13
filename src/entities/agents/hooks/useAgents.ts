import { useQuery } from '@tanstack/react-query';
import { agentApi } from '../api/agentApi';
import type { Agent } from '../model/agent';

export const useAgents = () => {
    const query = useQuery<Agent[]>({
        queryKey: ['agents'],
        queryFn: async () => {
            const result = await agentApi.getAgents();
            return Array.isArray(result) ? result : [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        agents: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};

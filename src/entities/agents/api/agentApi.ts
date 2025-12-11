import { axiosClient } from "@/shared/api/axiosClient";
import type { Agent } from "../model/agent";

export const agentApi = {

    getAgents: async () => {
        const res = await axiosClient.get<{ items: Agent[] }>('/agents');
        return res.data.items ?? res.data;
    },
    getAgentById: async (id: string) => {
        const res = await axiosClient.get<Agent>(`/agents/${id}`);
        return res.data;
    }
}
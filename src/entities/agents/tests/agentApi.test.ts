import { axiosClient } from "../../../shared/api/axiosClient";
import { agentApi } from "../api/agentApi";
import type { Agent } from "../model/agent";

 
jest.mock('../services/api/axiosClient', () => ({
    axiosClient: {
        get: jest.fn(),
    },
}));

describe('agentApi', () => {
    const mockAgents: Agent[] = [
        { id: '1', name: 'Alice', email: 'alice@example.com' },
        { id: '2', name: 'Bob', email: 'bob@example.com' },
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAgents', () => {
        it('should return items when API response includes items property', async () => {
            (axiosClient.get as jest.Mock).mockResolvedValueOnce({
                data: { items: mockAgents },
            });

            const result = await agentApi.getAgents();

            expect(axiosClient.get).toHaveBeenCalledWith('/agents');
            expect(result).toEqual(mockAgents);
        });

        it('should return data directly when API response does not include items', async () => {
            (axiosClient.get as jest.Mock).mockResolvedValueOnce({
                data: mockAgents,
            });

            const result = await agentApi.getAgents();

            expect(axiosClient.get).toHaveBeenCalledWith('/agents');
            expect(result).toEqual(mockAgents);
        });

        it('should throw an error when request fails', async () => {
            (axiosClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            await expect(agentApi.getAgents()).rejects.toThrow('Network error');
        });
    });

    describe('getAgentById', () => {
        it('should fetch a specific agent by ID', async () => {
            const mockAgent: Agent = { id: '123', name: 'Charlie', email: 'charlie@example.com' };

            (axiosClient.get as jest.Mock).mockResolvedValueOnce({
                data: mockAgent,
            });

            const result = await agentApi.getAgentById('123');

            expect(axiosClient.get).toHaveBeenCalledWith('/agents/123');
            expect(result).toEqual(mockAgent);
        });

        it('should throw an error if the request fails', async () => {
            (axiosClient.get as jest.Mock).mockRejectedValueOnce(new Error('Not found'));

            await expect(agentApi.getAgentById('999')).rejects.toThrow('Not found');
        });
    });
});
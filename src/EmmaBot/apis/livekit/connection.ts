/**
 * LiveKit Connection API
 *
 * This module handles fetching connection details from the backend server.
 * The backend should provide a token generation endpoint that returns:
 * - serverUrl: LiveKit server URL
 * - roomName: Room name
 * - participantToken: JWT token for the participant
 * - participantName: Name of the participant
 */

export interface ConnectionDetails {
  serverUrl: string;
  roomName: string;
  participantToken: string;
  participantName: string;
}

export interface ConnectionRequest {
  room_config?: {
    agents?: Array<{ agent_name: string }>;
  };
}

/**
 * Fetches LiveKit connection details from the backend
 *
 * @param request - Connection request with optional agent configuration
 * @returns Promise resolving to connection details
 */
import { createApiClient } from '@emma/lib/api';

const apiClient = createApiClient(import.meta.env.VITE_New_SERVER_URL);

export async function fetchConnectionDetails(
  request: ConnectionRequest = {}
): Promise<ConnectionDetails> {
  try {
    // Get user from localStorage for authentication
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.userId;

    if (!userId) {
      throw new Error('User not authenticated. Please log in.');
    }

    // Send request with X-User-Id header for backend authentication
    const data = await apiClient.post<ConnectionDetails>('/token/token-emma-khan', request, {
      headers: {
        'X-User-Id': userId,
      },
    });

    return data;
  } catch (error) {
    console.error('❌ Error fetching connection details:', error);
    throw new Error('Error fetching connection details!');
  }
}

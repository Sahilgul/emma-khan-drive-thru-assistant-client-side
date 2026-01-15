import { useMutation } from '@tanstack/react-query';
import type {
  ConnectionDetails,
  ConnectionRequest,
} from '@emma/apis/livekit/connection';
import { fetchConnectionDetails } from '@emma/apis/livekit/connection';

export function useLivekitConnection() {
  return useMutation<ConnectionDetails, Error, ConnectionRequest>({
    mutationFn: (req?: ConnectionRequest) => fetchConnectionDetails(req),
  });
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Room, RoomEvent, TokenSource } from 'livekit-client';
import type { AppConfig } from '@emma/config/app-config';
import { toast } from '@emma/components/ui/sonner';
import { fetchConnectionDetails } from '@emma/apis/livekit/connection';
import { getMenuItems, getDrinks, getAddons, getSides } from '@emma/apis/menu';

export function useRoom(appConfig: AppConfig, userId?: string) {
  const aborted = useRef(false);
  const room = useMemo(() => new Room(), []);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    function onDisconnected() {
      setIsSessionActive(false);
    }

    function onMediaDevicesError(error: Error) {
      toast.error('Media Device Error', {
        description: `${error.name}: ${error.message}`,
      });
    }

    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);

    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room]);

  useEffect(() => {
    return () => {
      aborted.current = true;
      room.disconnect();
    };
  }, [room]);

  const tokenSource = useMemo(
    () =>
      TokenSource.custom(async () => {
        try {
          const connectionDetails = await fetchConnectionDetails({
            room_config: appConfig.agentName
              ? {
                agents: [{ agent_name: appConfig.agentName }],
              }
              : undefined,
          });

          return connectionDetails;
        } catch (error) {
          console.error('Error fetching connection details:', error);
          throw new Error('Error fetching connection details!');
        }
      }),
    [appConfig]
  );

  const startSession = useCallback(() => {
    setIsSessionActive(true);

    if (room.state === 'disconnected') {
      const { isPreConnectBufferEnabled } = appConfig;

      // Use Promise.all like Next.js - run microphone enable and connect in PARALLEL
      Promise.all([
        room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: isPreConnectBufferEnabled,
        }),
        tokenSource
          .fetch({ agentName: appConfig.agentName })
          .then(connectionDetails => {
            return room
              .connect(
                connectionDetails.serverUrl,
                connectionDetails.participantToken
              )
              .then(async () => {
                console.log('✅ Successfully connected to LiveKit room!');

                // Fetch and send menu data if userId is available
                if (userId) {
                  try {
                    // Dynamic import to avoid circular dependencies if any, 
                    // or just standard import at top. Since we're modifying the file content, 
                    // we'll rely on the imports added at the top.
                    const [menuItems, drinks, addons, sides] = await Promise.all([
                      getMenuItems(userId),
                      getDrinks(userId),
                      getAddons(userId),
                      getSides(userId)
                    ]);

                    // Filter irrelevant data to minimize payload context for the agent
                    const filteredMenu = {
                      menuItems: menuItems.map(item => ({
                        id: item.id,
                        category: item.category,
                        name: item.name,
                        price: item.price,
                        ingredients: item.ingredients,
                        // Only include combo details if applicable/relevant
                        ...(item.comboDetails ? {
                          comboDetails: item.comboDetails,
                          comboPrice: item.comboPrice
                        } : {}),
                        available: item.available
                      })),
                      drinks: drinks.map(drink => ({
                        id: drink.id,
                        name: drink.name,
                        options: drink.options,
                        available: drink.available
                      })),
                      addons: addons.map(addon => ({
                        id: addon.id,
                        name: addon.name,
                        price: addon.price,
                        available: addon.available
                      })),
                      sides: sides.map(side => ({
                        id: side.id,
                        name: side.name,
                        options: side.options,
                        available: side.available
                      }))
                    };

                    const encoder = new TextEncoder();
                    const payload = encoder.encode(JSON.stringify(filteredMenu));

                    await room.localParticipant.publishData(payload, {
                      topic: 'menu_data',
                      reliable: true,
                    });

                    console.log('📤 Sent filtered menu data to agent', {
                      items: filteredMenu.menuItems.length,
                      drinks: filteredMenu.drinks.length,
                      addons: filteredMenu.addons.length,
                      sides: filteredMenu.sides.length
                    });
                  } catch (error) {
                    console.error('❌ Failed to fetch/send menu data:', error);
                    // Don't fail the session if menu fails, just log it
                  }
                }
              });
          }),
      ]).catch(error => {
        if (aborted.current) {
          // Once the effect has cleaned up after itself, drop any errors
          // These errors are likely caused by this effect rerunning rapidly,
          // resulting in a previous run `disconnect` running in parallel with
          // a current run `connect`
          return;
        }

        console.error('❌ LiveKit Connection Error:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          fullError: error,
        });

        toast.error('Connection Error', {
          description: `${error.message || 'Failed to connect to LiveKit'}`,
        });
        setIsSessionActive(false);
      });
    }
  }, [room, appConfig, tokenSource, userId]);

  const endSession = useCallback(() => {
    setIsSessionActive(false);
  }, []);

  return { room, isSessionActive, startSession, endSession };
}

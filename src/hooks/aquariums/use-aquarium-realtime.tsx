import useWebSocket from "react-use-websocket"
import React from "react"
import { WebSocketLike } from "react-use-websocket/dist/lib/types"
import { AquariumData } from "@/types/aquarium-data"

type Props = {
  aquarium_id: string
}

export default function useAquariumRealtime({ aquarium_id }: Props) {
  const [data, setData] = React.useState<null | AquariumData>(null)
  const wsRef = React.useRef<WebSocketLike | null>(null)

  const { getWebSocket, sendJsonMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_API}/aquarium-dashboard/${aquarium_id}`,
    {
      onOpen: () => {
        wsRef.current = getWebSocket()
      },
      onClose: () => {
        setData(null)
      },
      shouldReconnect: () => true,
      reconnectInterval: 5000,
      reconnectAttempts: 10,
      onMessage: (message) => {
        const data = JSON.parse(message.data)

        switch (data.type) {
          case "disconnected":
            setData(null)
            break

          case "update":
            setData(data.data)
            break

          default:
            break
        }
      },
    },
  )

  React.useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
    }
  }, [])

  return {
    data,
    sendJsonMessage,
  }
}

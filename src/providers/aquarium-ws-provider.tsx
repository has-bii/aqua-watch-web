import { AquariumWSContext } from "@/context/aquarium-ws-context"
import { AquariumData } from "@/types/aquarium-data"
import React from "react"
import useWebSocket from "react-use-websocket"
import { WebSocketLike } from "react-use-websocket/dist/lib/types"

type Props = {
  aquarium_id: string
  children: React.ReactNode
}

export default function AquariumWSProvider({ aquarium_id, children }: Props) {
  const [data, setData] = React.useState<AquariumData | null>(null)
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

  return <AquariumWSContext.Provider value={{ data, sendJsonMessage }}>{children}</AquariumWSContext.Provider>
}

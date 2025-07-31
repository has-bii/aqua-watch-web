import { AquariumData } from "@/types/aquarium-data"
import { createContext } from "react"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types"

export type AquariumWSContextType = {
  data: AquariumData | null
  sendJsonMessage: SendJsonMessage
}

export const AquariumWSContext = createContext<AquariumWSContextType | null>(null)

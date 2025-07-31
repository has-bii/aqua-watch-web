import { AquariumWSContext } from "@/context/aquarium-ws-context"
import { useContext } from "react"

const useAquariumRealtime = () => {
  const currentAquariumContext = useContext(AquariumWSContext)

  if (!currentAquariumContext) {
    throw new Error("useAquariumRealtime must be used within an AquariumWSProvider")
  }

  return currentAquariumContext
}

export default useAquariumRealtime

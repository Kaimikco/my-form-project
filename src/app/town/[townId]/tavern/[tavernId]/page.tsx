import { Tavern, useGameData } from "@/types/Town";
import { TavernComponent } from "./components.tsx/TavernComponent";

interface PageProps {
  params: {
    tavernId: string
  }
}

export default function Page({ params }: PageProps) {

    const { requireService } = useGameData();
    const tavern = requireService(params.tavernId) as Tavern;

    return(
        <div>
          <TavernComponent {...tavern} /> 
        </div>
    )
}
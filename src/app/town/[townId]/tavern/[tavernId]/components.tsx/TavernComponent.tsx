'use client'

import { Button } from "@/components/button/Button";
import { useDialog } from "@/components/dialog/Dialog";
import { DialogueDialog } from "@/components/dialogue/DialogueDialog";
import { Heading } from "@/components/heading/Heading";
import { PageHeading } from "@/components/layout/PageHeading";
import { StyledLink } from "@/components/styled-link/StyledLink";
import { NPC, Tavern, useGameData } from "@/types/Town";
import { Star } from "lucide-react";
import { useCallback, useState } from "react";

export function TavernComponent(tavern: Tavern) {

    const { requireNPC, getNPCs } = useGameData();
    const landlord = requireNPC(tavern.landlord);
    const patrons = getNPCs(tavern.patrons);
    const [currentPatron, setCurrentPatron] = useState<NPC>();

    const dialog = useDialog(false);

    const onPatronClick = useCallback((patron: NPC) => {
        setCurrentPatron(patron);
        dialog.open();
    }, [])

    return(
        <>
            <PageHeading title={tavern.name}/>
            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col items-start gap-2">
                    <Heading color="white">Landlord</Heading>
                    <p className="flex items-center gap-2 text-white text-xl">
                        {landlord.questIds && <span><Star className="h-8 w-8 stroke-yellow-600 fill-yellow-400"/></span>}
                        {landlord.name}
                    </p>
                    <p className="text-white text-xl">{landlord.description}</p>
                    <StyledLink type="button" href={`/talk/${landlord.id}`}>Talk</StyledLink>    
                </div>
                <div className="flex flex-col gap-2">
                    <Heading color="white">Patrons</Heading>
                    <ul>
                        {patrons.map((patron) => {
                            return(
                                <li key={patron.id} className="flex flex-col items-start gap-2">
                                    <p className="text-white text-xl">{patron.name}</p>
                                    <p className="text-white text-xl">{patron.description}</p>
                                    <Button onClick={() => onPatronClick(patron)}>Talk</Button>
                                    {/* <StyledLink type="button" href={`/talk/${patron.id}`}>Talk</StyledLink> */}
                                </li>
                            )
                        })}
                    </ul>
                    {currentPatron && (
                        <DialogueDialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen} npc={currentPatron}/>
                    )}
                </div>                 
            </div>      
        </>
    )
}
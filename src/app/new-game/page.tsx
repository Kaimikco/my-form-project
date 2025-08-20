'use client'

import { Heading } from "@/components/heading/Heading";
import { PageHeading } from "@/components/layout/PageHeading";
import { playerClassList } from "@/data/classes";
import { PlayerClassCard } from "./components/PlayerClassCard";

export default function NewGame() {
    return(
        <div>
            <div>
                <PageHeading title="Begin your quest"/>
                <div className="py-12 px-16 text-2xl text-center text-white">
                    <p>Welcome pilgrim, I wonder what brings you to this quiet backwater...</p>
                    <p>Many souls have passed through seeking fortunes in lands beyond, and many fail at the first hurdle.</p>
                    <p>Tell me, what makes you so confident you are capable of surviving in the land of odd?</p>
                </div>
                <div className="flex flex-col gap-4">
                    <Heading color="white" level={2}>Choose your class</Heading>
                    <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {playerClassList.map((item, index) => (
                            <li key={index}>
                                <PlayerClassCard {...item}/>                       
                            </li>
                        ))}
                    </ul>
                </div>                           
            </div>
        </div>
    )
}
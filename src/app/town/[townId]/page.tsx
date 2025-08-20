import { Heading } from "@/components/heading/Heading"
import { PageHeading } from "@/components/layout/PageHeading"
import { StyledLink } from "@/components/styled-link/StyledLink"
import { useGameData } from "@/types/Town"

interface PageProps {
  params: {
    townId: string
  }
}

export default function Page({ params }: PageProps) {
  
    const id = params.townId // TypeScript knows this is a string
    const { requireTown, getTownServices } = useGameData();
    const town = requireTown(id);
    const townServices = getTownServices(town.id)

    return (
        <div>
            <PageHeading title={town.name}/>
            <div className="flex flex-col gap-8 p-4">
                <p className="text-white text-xl">{town.description}</p>
                <div className="flex flex-col gap-4">
                  <Heading className="text-5xl border-b-4" color="white">Services</Heading>
                  <ul className="flex gap-4">
                    {townServices.map((service) => {
                      return(
                        <li key={service.id} className="flex flex-col items-start flex-1 border-4 rounded-md border-white p-4">
                          <Heading color="white">{service.name}</Heading>
                          <div className="flex flex-col h-full gap-4 items-start" key={service.id}>
                            <p className="text-white text-xl">{service.description}</p>
                            <StyledLink className="mt-auto" type="button" href={`${town.id}/${service.type}/${service.id}`}>Enter</StyledLink>
                          </div>                                    
                        </li>
                      )
                    })}
                  </ul>                    
                </div>
            </div>
        </div>
    )
}
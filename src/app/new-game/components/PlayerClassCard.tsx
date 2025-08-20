import { Card } from "@/components/card/Card";
import { Details } from "@/components/details/Details";
import { Heading } from "@/components/heading/Heading";
import { attributeText, skillText } from "@/data/classes";
import { PlayerClassMeta } from "@/types/playerClass";
import { tv, VariantProps } from "tailwind-variants";

const playerClassCardStyles = tv({
    base: "text-white border-white border-4 h-full",
    slots: {
        content: "flex flex-col gap-4",
        icon: "w-24 h-24 shrink-0",
        title: "text-3xl",
        details: "border-white border-b-4",
        header: "flex item-start justify-between"
    }
})

export type PlayerClassCardProps = PlayerClassMeta & VariantProps<typeof playerClassCardStyles>;

export function PlayerClassCard({
    name,
    description,
    startingSkills,
    attributeModifier = [],
    skillModifier = [],
    icon: Icon,
}: PlayerClassCardProps) {
    const { base, content, icon, title, header, details } = playerClassCardStyles();
    return(
        <Card className={base()}>
            <div className={content()}>
                <div className={header()}>
                    <div className={content()}>
                        <div>
                            <Heading color="white" className={title()} level={3}>{name}</Heading>
                            <p>{description}</p>                                            
                        </div>
                        <div>
                            <Heading color="white" level={4}>Skills</Heading>
                            <ul>
                                {startingSkills.map((skill, i) => (
                                    <li key={`skill-${i}`}>{skillText[skill]}</li>
                                ))}
                            </ul>
                        </div>                                                                         
                    </div>
                    <Icon className={icon()}/>                
                </div>
                <div className={content()}>
                    {attributeModifier.length > 0 && <Details className={details()} title={"Attribute Modifiers"}>
                        <dl>
                            {attributeModifier?.map((attributeModifier, i) => (
                                <>
                                    <dt key={`attribute-${i}-dt`}>{attributeText[attributeModifier.type]}</dt>
                                    <dd key={`attribute-${i}-dd`}>
                                        {attributeModifier.flatModifer && <span>Flat modifier: {attributeModifier.flatModifer}</span>} <br />
                                        {attributeModifier.multiplier && <span>Multiplier: {attributeModifier.multiplier}</span>}    
                                    </dd>                                            
                                </>
                            ))}
                        </dl>
                    </Details>}
                    {skillModifier.length > 0 && <Details className={details()} title="Skill Modifiers">
                        <dl>
                            {skillModifier?.map((skillModifier, i) => (
                                <>
                                    <dt key={`skill-${i}-dt`}>{skillText[skillModifier.type]}</dt>
                                    <dd key={`skill-${i}-dd`}>
                                        {skillModifier.flatModifer && <span>Flat modifier: {skillModifier.flatModifer}</span>} <br />
                                        {skillModifier.multiplier && <span>Multiplier: {skillModifier.multiplier}</span>}    
                                    </dd>                                            
                                </>
                            ))}
                        </dl>  
                    </Details>}
              
                </div>                
            </div>
        </Card>        
    )
}
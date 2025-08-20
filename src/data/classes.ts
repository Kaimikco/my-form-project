import { Attribute, PlayerClasses, PlayerClassMeta, Skill } from "@/types/playerClass";
import { BiStar } from "react-icons/bi";
import { TbShoe } from "react-icons/tb";

const jester: PlayerClassMeta = {
    name: "Jester",
    icon: BiStar,
    description: "Use your tomfoolery to get into and out of trouble. Your keen sense of humour will help tame the most brutish of lords, your skills in acrobatics will help you leap safely out of danger and your tricky fingers will lift purses under the eyes of keen eyed guards",
    startingSkills: [
        Skill.Jest,
        Skill.Orator,
        Skill.Musician,
        Skill.Singer,
        Skill.Trickster,
        Skill.Acrobatics
    ],
    attributeModifier: [
        {
            type: Attribute.Agility,
            multiplier: 1.25,
            flatModifer: 25
        }
    ],
    skillModifier: [
        {
            type: Skill.Jest,
            multiplier: 1.5,
            flatModifer: 50
        }
    ]    
}

const cobbler: PlayerClassMeta = {
    name: "Cobbler",
    description: "Use your craftsmanship to make your way in the world. ",
    icon: TbShoe,
    startingSkills: [
        Skill.Cobbling,
        Skill.Jest
    ],
    attributeModifier: [],
    skillModifier: []    
}

export const playerClassMap: Record<PlayerClasses, PlayerClassMeta> = {
    [PlayerClasses.Jester]: jester,
    [PlayerClasses.Cobbler]: cobbler
}

export const playerClassList = Object.values(playerClassMap);

export const attributeText: Record<Attribute, string> = {
    [Attribute.Strength]: "Strength",
    [Attribute.Endurance]: "Endurance",
    [Attribute.Agility]: "Agility",
    [Attribute.Speed]: "Speed"
}

export const skillText: Record<Skill, string> = {
    [Skill.Fencing]: "Fencing",
    [Skill.Jest]: "Jest",
    [Skill.Cobbling]: "Cobbling",
    [Skill.Herbology]: "Herbology",
    [Skill.Witchcraft]: "Witchcraft",
    [Skill.Alchemy]: "Alchemy",
    [Skill.Cooking]: "Cooking",
    [Skill.Geology]: "Geology",
    [Skill.Summoning]: "Summoning",
    [Skill.Orator]: "Orator",
    [Skill.Musician]: "Musician",
    [Skill.Singer]: "Singer",
    [Skill.Trickster]: "Trickster",
    [Skill.Acrobatics]: "Acrobatics",
}
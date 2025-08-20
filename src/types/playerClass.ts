import { ComponentType, JSX } from "react";
import { IconBaseProps, IconType } from "react-icons";

export enum PlayerClasses {
    Jester,
    Cobbler
}

export interface PlayerClassMeta {
    name: string; 
    description: string;
    icon: ComponentType<IconBaseProps>;
    startingSkills: Skill[];
    attributeModifier?: AttributeModifier[];
    skillModifier?: SkillModifier[];    
}

export interface AttributeModifier {
    type: Attribute;
    multiplier?: number;
    flatModifer?: number;
}

export interface SkillModifier {
    type: Skill;
    multiplier?: number;
    flatModifer?: number;
}

export enum Attribute {
    Strength,
    Endurance,
    Agility,
    Speed,
}

export enum Skill {
    Fencing,
    Jest,
    Orator,
    Musician,
    Singer,
    Trickster,
    Acrobatics,
    Cobbling,
    Herbology,
    Witchcraft,
    Alchemy,
    Cooking,
    Geology,
    Summoning
}
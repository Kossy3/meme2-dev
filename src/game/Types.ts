import { Fortress } from "./Fortress";

export type FoodData = {
    name: string;
    calorie: number;
    upgradeCost: number;
}

export type HouseData = {
    name: string;
    capacity: number;
    upgradeCost: number
}

export type WeaponData = {
    name: string;
    x: number;
    y: number;
    cooldown: number;
}

export type FortressData = {
    name: string;
    hp: number;
    weapon: WeaponData[]
}

export type MemeStatus = {
    diversity: number;
    speed: number;
    price: number;
}
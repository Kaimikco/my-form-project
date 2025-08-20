export interface Inventory {
    slots: number;
    items: InventoryItem[]; 
}

export interface InventoryItem {
    type: string;
}
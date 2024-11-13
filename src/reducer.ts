import { createSlice } from "@reduxjs/toolkit";

import { TileSpec } from './components/Tile';
import { SUPPLY_ID } from "./constants";

interface TilesState {
    supply: TileSpec[];
    days: (TileSpec & { index: number })[][];
}

export const tilesSlice = createSlice({
    name: 'tiles',
    initialState: {
        // Tiles in the supply are given in their order
        supply: [],
        // Tiles in each day have an index (and are still orderd by index)
        // to allow for gaps. Each index must be unique in a given day.
        days: Array.from({ length: 7 }, () => []),
    } as TilesState,
    reducers: {
        addTile: (state, action) => {
            if (action.payload.containerId === SUPPLY_ID) {
                if (action.payload.index < 0) {
                    state.supply.push(action.payload.tile);
                } else {
                    state.supply.splice(action.payload.index, 0, action.payload.tile);
                } 
            } else {
                // For adding to days, assume no index collisions
                state.days[action.payload.containerId].push(
                    {...action.payload.tile, index: action.payload.index,});
                state.days[action.payload.containerId].sort((a, b) => a.index - b.index);
            }
        },

        removeTile: (state, action) => {
            state.supply = state.supply.filter(tile => tile?.uuid !== action.payload);
            state.days = state.days.map(
                (tiles) => tiles.filter(tile => tile?.uuid !== action.payload))
        },

        resetTiles: (state) => {
            // Move all day tiles back to supply, remove indexes, and sort
            // by color and label.
            const tiles = state.days.flat().map(({index, ...tile}) => tile);
            state.supply = state.supply.concat(tiles).sort((a, b) => {
                const colorCompare = a.className.localeCompare(b.className);
                if (colorCompare !== 0) {
                    return colorCompare;
                }
                return a.label.localeCompare(b.label);
            });
            state.days = Array.from({ length: 7 }, () => []);
        },
    },
});

export const daysSlice = createSlice({
    name: 'days',
    initialState: {
        labels: ['S', 'M', 'T', 'W', 'ϴ', 'F', 'Σ'],
    },
    reducers: {}
});

export const { addTile, removeTile, resetTiles } = tilesSlice.actions;
export const tilesReducer = tilesSlice.reducer;
export const daysReducer = daysSlice.reducer;

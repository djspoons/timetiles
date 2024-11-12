import { createSlice } from "@reduxjs/toolkit";

import { TileProps } from './components/Tile';
import { SUPPLY_INDEX } from "./constants";

interface TilesState {
    // One for the supply plus one array for each day
    containers: TileProps[][];
}

export const tilesSlice = createSlice({
    name: 'tiles',
    initialState: {
        containers: Array.from({ length: 8 }, () => [])
    } as TilesState,
    reducers: {
        addTile: (state, action) => {
            if (action.payload.tileIndex < 0) {
                state.containers[action.payload.tile.containerIndex].push(
                    action.payload.tile);
            }
            else {
                state.containers[action.payload.tile.containerIndex].splice(
                    action.payload.tileIndex, 0, action.payload.tile);
            }
        },

        removeTile: (state, action) => {
            state.containers = state.containers.map(
                tiles => tiles.filter(tile => tile.uuid !== action.payload));
        },

        resetTiles: (state) => {
            // Move all day tiles back to supply, sort by size and color
            state.containers[SUPPLY_INDEX] = state.containers[SUPPLY_INDEX].concat(
                ...state.containers.slice(1)).map((tile) => ({...tile, containerIndex: SUPPLY_INDEX}));
            for (let i = 1; i < state.containers.length; i++) {
                state.containers[i] = [];
            }
            state.containers[SUPPLY_INDEX].sort((a, b) => {
                const colorCompare = a.className.localeCompare(b.className);
                if (colorCompare !== 0) {
                    return colorCompare;
                }
                return a.minutes - b.minutes;
            });
        }
    }
})

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

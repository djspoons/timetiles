import { createSlice } from "@reduxjs/toolkit";

import { TileSpec } from './components/Tile';
import { SUPPLY_ID } from "./constants";

interface TilesState {
    containers: (TileSpec & { index: number })[][];
}

export const tilesSlice = createSlice({
    name: 'tiles',
    initialState: {
        containers: Array.from({ length: 8 }, () => []),
    } as TilesState,
    reducers: {
        addTile: (state, action) => {
            if (action.payload.index < 0) {
                state.containers[action.payload.containerId].push(
                    {...action.payload.tile,
                        index: state.containers[action.payload.containerId].length});
            }
            else {
                if (action.payload.containerId === SUPPLY_ID) {
                    state.containers[SUPPLY_ID].splice(
                        action.payload.index, 0,
                        {...action.payload.tile, index: action.payload.index});
                    state.containers[SUPPLY_ID] = state.containers[SUPPLY_ID].map(
                        (tile, index) => ({...tile, index: index}));
                }
                else {
                    // For adding to days, assume no index collisions
                    state.containers[action.payload.containerId].push(
                        {...action.payload.tile, index: action.payload.index,});
                    state.containers[action.payload.containerId].sort((a, b) => a.index - b.index);
                }
            }
        },

        removeTile: (state, action) => {
            state.containers = state.containers.map(
                (tiles) => tiles.filter(tile => tile?.uuid !== action.payload))
            // Renumber the tiles in the supply
            state.containers[SUPPLY_ID] = state.containers[SUPPLY_ID].map(
                (tile, index) => ({...tile, index: index}));
        },

        resetTiles: (state) => {
            // Move all day tiles back to supply, sort by size and color
            state.containers[SUPPLY_ID] = state.containers[SUPPLY_ID].concat(
                ...state.containers.slice(1));
            for (let i = 1; i < state.containers.length; i++) {
                state.containers[i] = [];
            }
            state.containers[SUPPLY_ID] = state.containers[SUPPLY_ID].sort((a, b) => {
                const colorCompare = a.className.localeCompare(b.className);
                if (colorCompare !== 0) {
                    return colorCompare;
                }
                return a.label.localeCompare(b.label);
            }).map((tile, index) => ({...tile, index: index}));
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

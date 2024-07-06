import { ReactNode } from "react";
import { create } from "zustand";
import { Map } from "./Map";
import { removeItem } from "../lib/arrayHelpers";

export interface Panel {
  id: string
  label: string
  closable: boolean
  component: ReactNode
}

export interface PanelTopState {
  panels: Panel[]
  addPanel: (panel: Panel, focus?: boolean) => boolean
  focusedPanelId: string
  focusPanel: (id: string) => unknown
  removePanel: (panel: Panel) => unknown
}

export const usePanelTopStore = create<PanelTopState>((set, get) => ({
  focusedPanelId: 'map',
  panels: [{
    id: 'map',
    label: 'Map',
    closable: false,
    component: <Map />
  }],
  addPanel(panel: Panel, focus: boolean = true): boolean {
    const panels = get().panels;
    if (panels.some(x => x.id == panel.id) == false) {
      set({
        panels: [...panels, panel],
        focusedPanelId: focus ? panel.id : get().focusedPanelId
      })
      return true;
    }
    return false;
  },
  focusPanel(id: string) {
    set({
      focusedPanelId: id
    })
  },
  removePanel(panel: Panel) {
    const { panels, focusedPanelId } = get();
    const index = panels.indexOf(panel);
    set({
      panels: [...removeItem(panels, panel)],
      focusedPanelId: focusedPanelId == panel.id ? panels[index - 1].id : focusedPanelId
    })
  }
}));
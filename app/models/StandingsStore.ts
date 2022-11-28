import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { Standings, StandingsModel } from "./Standings"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const StandingsStoreModel = types
  .model("StandingsStore")
  .props({
    Standings: types.array(StandingsModel),

  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchStandings(auth) {
      const response = await api.getStandings(auth)
      if (response.kind === "ok") {
        store.setProp("Standings", response.standings)
      } else {
      console.tron.error(`Error fetching Standings: ${JSON.stringify(response)}`, [])
      return response.kind
      }
    },
  }))
  .views((store) => ({
    get StandingsForList() {
      return store.Standings
    },
  }))

export interface StandingsStore extends Instance<typeof StandingsStoreModel> {}
export interface StandingsStoreSnapshot extends SnapshotOut<typeof StandingsStoreModel> {}

// @demo remove-file

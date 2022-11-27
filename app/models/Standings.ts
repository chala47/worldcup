import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
import { StandingTeam } from "../services/api"

/**
 * This represents an Standings of React Native Radio.
 */
 
export const StandingsModel = types
  .model("Standings")
  .props({
    _id: '',
    group: '',
    teams: types.frozen<StandingTeam[]>()
    })
  .actions(withSetPropAction)
  // .views((Standings) => ({
  //   get parsedTitleAndSubtitle() {
  //     const defaultValue = { title: Standings.title?.trim(), subtitle: "" }

  //     if (!defaultValue.title) return defaultValue

  //     const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

  //     if (!titleMatches || titleMatches.length !== 3) return defaultValue

  //     return { title: titleMatches[1], subtitle: titleMatches[2] }
  //   },
  //   get datePublished() {
  //     try {
  //       const formatted = formatDate(Standings.pubDate)
  //       return {
  //         textLabel: formatted,
  //         accessibilityLabel: translate("demoPodcastListScreen.accessibility.publishLabel", {
  //           date: formatted,
  //         }),
  //       }
  //     } catch (error) {
  //       return { textLabel: "", accessibilityLabel: "" }
  //     }
  //   },
  //   get duration() {
  //     const seconds = Number(Standings.enclosure.duration)
  //     const h = Math.floor(seconds / 3600)
  //     const m = Math.floor((seconds % 3600) / 60)
  //     const s = Math.floor((seconds % 3600) % 60)

  //     const hDisplay = h > 0 ? `${h}:` : ""
  //     const mDisplay = m > 0 ? `${m}:` : ""
  //     const sDisplay = s > 0 ? s : ""
  //     return {
  //       textLabel: hDisplay + mDisplay + sDisplay,
  //       accessibilityLabel: translate("demoPodcastListScreen.accessibility.durationLabel", {
  //         hours: h,
  //         minutes: m,
  //         seconds: s,
  //       }),
  //     }
  //   },
  // }))

export interface Standings extends Instance<typeof StandingsModel> {}
export interface StandingsSnapshotOut extends SnapshotOut<typeof StandingsModel> {}
export interface StandingsSnapshotIn extends SnapshotIn<typeof StandingsModel> {}

// @demo remove-file

import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"

/**
 * This represents an episode of React Native Radio.
 */
export const EpisodeModel = types
  .model("Episode")
  .props({
    id:'',
    _id: '',
    type: "",
    group: "",
    home_team_id: "",
    away_team_id: "",
    home_score: 0,
    away_score: 0,
    // home_scorers: '',
    // away_scorers: '',
    persian_date: '' ,
    local_date: "",
    stadium_id: "",
    time_elapsed: "",
    finished: "",
    matchday: '',
    home_team_fa: "",
    away_team_fa: "",
    home_team_en: "",
    away_team_en: "",
    home_flag: "",
    away_flag: "",
  })
  .actions(withSetPropAction)
  // .views((episode) => ({
  //   get parsedTitleAndSubtitle() {
  //     const defaultValue = { title: episode.title?.trim(), subtitle: "" }

  //     if (!defaultValue.title) return defaultValue

  //     const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

  //     if (!titleMatches || titleMatches.length !== 3) return defaultValue

  //     return { title: titleMatches[1], subtitle: titleMatches[2] }
  //   },
  //   get datePublished() {
  //     try {
  //       const formatted = formatDate(episode.pubDate)
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
  //     const seconds = Number(episode.enclosure.duration)
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

export interface Episode extends Instance<typeof EpisodeModel> {}
export interface EpisodeSnapshotOut extends SnapshotOut<typeof EpisodeModel> {}
export interface EpisodeSnapshotIn extends SnapshotIn<typeof EpisodeModel> {}

// @demo remove-file

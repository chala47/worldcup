/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  _id: string
  type: string
  group: string
  home_team_id: string
  away_team_id: string
  home_score: number
  away_score: number
  // home_scorers: string
  // away_scorers: string
  persian_date: string
  local_date: string
  stadium_id: string
  time_elapsed: string
  finished: string
  matchday: string
  home_team_fa: string
  away_team_fa: string
  home_team_en: string
  away_team_en: string
  home_flag: string
  away_flag: string
}

export interface ApiFeedResponse {
  status: string
  data: EpisodeItem[]
}

export interface StandingTeam {
  team_id: string
  mp: string
  w: string
  l: string
  pts: string
  gf: string
  ga: string
  gd: string
  d: string
  name_fa: string
  name_en: string
  flag: string
}
export interface StandingItem {
  _id: string
  group: string
  teams: StandingTeam[]
}

export interface StandingApiFeedResponse {
  status: string
  data: StandingItem[]
}

export interface AuthResponse {
  status: string
  data: { token: string }
}

export interface ApiConfig {
  url: string
  timeout: number
}

/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse,
  StandingApiFeedResponse, // @demo remove-current-line
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode" // @demo remove-current-line
import { StandingsSnapshotIn } from "../../models/Standings"
import { useStores } from "../../models"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        // Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzc4ZmIxNmZkOWFhYzIyNjc1NTAzMGUiLCJpYXQiOjE2Njk1NDc1MTQsImV4cCI6MTY2OTYzMzkxNH0.rY5W7UDnO3zo0f64anUSTkSj4DobJ0LgE4zXlCyd8Ok',
        Accept: "application/json",
      },
    })
  }

  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(auth): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    this.apisauce.setHeader('Authorization', auth)
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(`http://api.cup2022.ir/api/v1/match`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data
      // console.log("data", response)
      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] = rawData.data.map((raw) => ({
        ...raw,
      }))

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__) {
        console.log("data", response)
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getStandings(auth): Promise<{ kind: "ok"; standings: StandingsSnapshotIn[] } | GeneralApiProblem> {
    this.apisauce.setHeader('Authorization', auth)
    const response: ApiResponse<StandingApiFeedResponse> = await this.apisauce.get(`http://api.cup2022.ir/api/v1/standings`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      console.log('error',response)
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data
      // console.log("data", response)
      // This is where we transform the data into the shape we expect for our MST model.
      const standings: StandingsSnapshotIn[] = rawData.data.map((raw) => ({
        ...raw,
      }))

      return { kind: "ok", standings }
    } catch (e) {
      if (__DEV__) {
        // console.log("data", response)
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  // @demo remove-block-end
}

// Singleton instance of the API for convenience
export const api = new Api()

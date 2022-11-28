// Interested in migrating from FlatList to FlashList? Check out the recipe in our Ignite Cookbook
// https://infinitered.github.io/ignite-cookbook/docs/MigratingToFlashList
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useLayoutEffect } from "react"
import {
  FlatList,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Card, ListItem, Screen, Text } from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models"
import { Standings } from "../models/Standings"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { StandingTeam } from "../services/api"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"

const ICON_SIZE = 14

export const StandingScreen: FC<DemoTabScreenProps<"Standings">> = observer(function StandingScreen(
  _props,
) {
  const {navigation}=_props;
  useLayoutEffect(() => {
    navigation.setOptions({
       
      headerTitle: () => (
          <Text style={{color:'white', fontSize:20,padding:10,fontWeight:'bold'}}>
            Standings
          </Text>
      ),
    });
  }, [navigation])
  const { standingStore,authenticationStore } = useStores()

  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      standingStore.fetchStandings(authenticationStore.authToken).then((response)=>{
        if(response==='unauthorized')
        authenticationStore.logout()
      })
      setIsLoading(false)
    })()
  }, [standingStore,authenticationStore.authToken])

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([standingStore.fetchStandings(authenticationStore.authToken), delay(750)])
    setRefreshing(false)
  }

  return (
    <Screen preset="fixed"  contentContainerStyle={$screenContentContainer}>
      <FlatList<Standings>
        data={standingStore.StandingsForList}
        contentContainerStyle={$flatListContentContainer}
        refreshing={refreshing}
        onRefresh={manualRefresh}
        renderItem={({ item }) => (
          <StandingTable
            key={item._id}
            teams={item.teams}
            group={item.group}
            onPressFavorite={function name() {}}
          />
        )}
      />
    </Screen>
  )
})

const StandingTable = observer(function EpisodeCard({
  teams,
  group,
}: {
  teams: StandingTeam[]
  group: string
  onPressFavorite: () => void
}) {
  return (
    <Card
      style={$item}
      HeadingComponent={
        <View style={$GroupHeader}>
          <Text style={$metadataText} size="xxs">
            {`Group ${group}`}
          </Text>
        </View>
      }
      ContentComponent={<StandingTeams teams={teams} />}
    />
  )
})

const StandingTeams = (props) => {
  const { teams } = props
  let orderList = teams
    .map((raw) => ({
      ...raw,
    }))
    ?.sort((a, b) => {
      if (parseInt(b.pts, 10) - parseInt(a.pts, 10) !== 0)
        return parseInt(b.gd, 10) - parseInt(a.gd, 10)
      else if (parseInt(b.gd, 10) - parseInt(a.gd, 10) !== 0)
        return parseInt(b.gd, 10) - parseInt(a.gd, 10)
      else return parseInt(b.ga, 10) - parseInt(a.ga, 10)
    })

  return (
    <>
      <ListItem
        LeftComponent={
          <View style={{ flexDirection: "row" }}>
            <Text style={$tableHeader}>{"teams"}</Text>
          </View>
        }
        RightComponent={
          <View style={{ flexDirection: "row",justifyContent:'flex-end',alignItems:'flex-end' }}>
            <Text style={$tableHeader}>{"mp"}</Text>
            <Text style={$tableHeader}>{"w"}</Text>
            <Text style={$tableHeader}>{"d"}</Text>
            <Text style={$tableHeader}>{"l"}</Text>
            <Text style={$tableHeader}>{"gf"}</Text>
            <Text style={$tableHeader}>{"ga"}</Text>
            <Text style={$tableHeader}>{"gd"}</Text>
            <Text style={$tableHeader}>{"pts"}</Text>
          </View>
        }
      />
      {orderList.map((i) => (
        <View key={i.team_id} style={{ flex: 1 }}>
          <ListItem
            key={i.team_id}
            LeftComponent={
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{
                    uri: i.flag,
                  }}
                  style={$itemThumbnail}
                />

                <Text>{i.name_en}</Text>
              </View>
            }
            RightComponent={
              <View style={{ flexDirection: "row",justifyContent:'flex-end',alignItems:'flex-end'}}>
                <Text style={$tableList}>{i.mp}</Text>
                <Text style={$tableList}>{i.w}</Text>
                <Text style={$tableList}>{i.d}</Text>
                <Text style={$tableList}>{i.l}</Text>
                <Text style={$tableList}>{i.gf}</Text>
                <Text style={$tableList}>{i.ga}</Text>
                <Text style={$tableList}>{i.gd}</Text>
                <Text style={$tableList}>{i.pts}</Text>
              </View>
            }
          />
        </View>
      ))}
    </>
  )
}

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $flatListContentContainer: ViewStyle = {

  paddingBottom: spacing.medium,
}

const $heading: ViewStyle = {
  marginBottom: spacing.medium,
}

const $item: ViewStyle = {
  flex: 1,
  borderRadius: 0,
  padding: spacing.medium,
  marginTop: spacing.micro,
  marginBottom: spacing.small,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginRight: 10,
  width: 25,
  height: 25,
}

const $toggle: ViewStyle = {
  marginTop: spacing.medium,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: "row",
  marginRight: spacing.small,
}

const $tableHeader: TextStyle = {
  padding: 6,
  alignItems: "flex-end",
  fontWeight:'bold'
}

const $GroupHeader: TextStyle = {
  flex:1,
  padding: 6,
  fontWeight:'bold'
}

const $tableList: TextStyle = {
  paddingLeft: 9,
  paddingRight: 10,
  textAlign: "center",
  alignItems: "center",
  color: colors.textDim,
}
const $metadataText: TextStyle = {
  fontSize:20,
  fontWeight:'bold',
  marginTop: 0,
}

const $favoriteButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.medium,
  justifyContent: "flex-start",
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.medium,
  paddingTop: spacing.micro,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: "flex-start",
}

const $unFavoriteButton: ViewStyle = {
  borderColor: colors.palette.primary100,
  backgroundColor: colors.palette.primary100,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.huge,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

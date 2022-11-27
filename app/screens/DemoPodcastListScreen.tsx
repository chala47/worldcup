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
import { Card, Screen, Text } from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models"
import { Episode } from "../models/Episode"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"

const ICON_SIZE = 14

export const DemoPodcastListScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function DemoPodcastListScreen(_props) {
    const { episodeStore ,authenticationStore} = useStores()

    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const {navigation}=_props;
    useLayoutEffect(() => {
      navigation.setOptions({
         
        headerTitle: () => (
            <Text style={{color:'white', fontSize:20,padding:10,fontWeight:'bold'}}>
              Matches
            </Text>
        ),
      });
    }, [navigation])
    useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await episodeStore.fetchEpisodes(authenticationStore.authToken)
        setIsLoading(false)
      })()
    }, [episodeStore])

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([episodeStore.fetchEpisodes(authenticationStore.authToken), delay(750)])
      setRefreshing(false)
    }

    return (
      <Screen
        preset="fixed"
        contentContainerStyle={$screenContentContainer}
      >
        <FlatList<Episode>
          data={episodeStore.episodesForList}
          // extraData={newsFeedsStore}
          contentContainerStyle={$flatListContentContainer}
          refreshing={refreshing}
          onRefresh={manualRefresh}
          renderItem={({ item }) => (
            <MatchsCard
              key={item.id}
              match={item}
            />
          )}
        />
      </Screen>
    )
  },
)

const MatchsCard = observer(function EpisodeCard({
  match,
}: {
  match: Episode
}) {


  return (
    <Card
      style={$item}

      HeadingComponent={
        <View style={$metadata}>
          <Text style={$metadataText} size="xxs">
            {`Group ${match.group}`}
          </Text>
        </View>
      }
      ContentComponent={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{ paddingBottom:0,marginBottom: 0 }}
          >{match.time_elapsed==="notstarted"?`${match.local_date}`:`${match.home_score} - ${match.away_score}`}</Text>
        </View>
      }
      RightComponent={
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text>{match.home_team_en}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image
              source={{
                uri: match.home_flag,
              }}
              style={$itemThumbnail}
            />
          </View>
        </View>
      }
      LeftComponent={
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text>{match.away_team_en}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image
              source={{
                uri: match.away_flag,
              }}
              style={$itemThumbnail}
            />
          </View>
        </View>
      }
    />
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  paddingBottom: spacing.large,
}

const $heading: ViewStyle = {
  marginBottom: spacing.medium,
}

const $item: ViewStyle = {
  flex: 1,
  padding: spacing.medium,
  marginTop: spacing.medium,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.small,
  padding: 5,
  width: 50,
  height: 50,
  borderRadius: 50,
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

const $metadata: TextStyle = {
  flex: 1,
 
  alignItems: "center",
  color: colors.textDim,
}

const $metadataText: TextStyle = {
  marginTop:0,
  fontWeight:'bold'
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

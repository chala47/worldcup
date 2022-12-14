/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
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
import { useStores } from "../models"
import { Episode } from "../models/Episode"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"


export const MatchesScreenListScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function MatchesScreenListScreen(_props) {
    const { episodeStore ,authenticationStore} = useStores()
      
    const [refreshing, setRefreshing] = React.useState(false)
    const [, setIsLoading] = React.useState(false)
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
        episodeStore.fetchEpisodes(authenticationStore.authToken).then((response)=>{
          if(response==='unauthorized')
          authenticationStore.logout()
        })
        setIsLoading(false)
      })()
    }, [episodeStore,authenticationStore])

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
          extraData={episodeStore}
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
      LeftComponent={
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
      RightComponent={
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

const $metadata: TextStyle = {
  flex: 1,
 
  alignItems: "center",
  color: colors.textDim,
}

const $metadataText: TextStyle = {
  marginTop:0,
  fontWeight:'bold'
}
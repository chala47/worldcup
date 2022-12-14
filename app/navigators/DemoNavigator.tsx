import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React, { useLayoutEffect } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { MatchesScreenListScreen } from "../screens/MatchesScreen"
import { StandingScreen } from "../screens/StandingScreen"
import { StatsScreen } from "../screens/StatsScreen"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
  Standings: undefined
}

export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

export function DemoNavigator({ navigation }) {
  const { bottom } = useSafeAreaInsets()
  const globalOptions = {
    headerStyle: { backgroundColor: "#8a1538" },
  }
  return (
    <Tab.Navigator
      screenOptions={{
        ...globalOptions,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 50 }],
        tabBarActiveTintColor: "white",
        tabBarActiveBackgroundColor:"#8a1538",
        tabBarInactiveBackgroundColor:"#8a1538",
        tabBarInactiveTintColor: "black",
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="DemoPodcastList"
        component={MatchesScreenListScreen}
        options={{
          tabBarLabel: "matches",
          tabBarIcon: ({ focused }) => <Icon icon="podcast" color={focused && colors.tint} />,
        }}
      />
      <Tab.Screen
        name="Standings"
        component={StandingScreen}
        options={{
          tabBarLabel: "Standings",
          tabBarIcon: ({ focused }) => <Icon icon="community" color={focused && colors.tint} />,
        }}
      />

      <Tab.Screen
        name="DemoDebug"
        component={StatsScreen}
        options={{
          headerShown: false, 
          tabBarLabel: "stats",
          tabBarIcon: ({ focused }) => <Icon icon="debug" color={focused && colors.tint} />,
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.small,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 15,
  flex: 1,
}

// @demo remove-file

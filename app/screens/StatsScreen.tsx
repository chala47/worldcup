import React, { useState } from "react"
import { ViewStyle } from "react-native"
import WebView from "react-native-webview"

import { Screen } from "../components"
import { colors } from "../theme"

const ICON_SIZE = 30

export const StatsScreen = () => {

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]}  contentContainerStyle={$screenContentContainer}>
      <WebView
        source={{
          uri: "https://www.google.com/search?q=word+cup&rlz=1C1GCEU_enET1007ET1007&oq=word+&aqs=chrome.0.69i59j69i57j35i39j69i60l5.4933j1j7&sourceid=chrome&ie=UTF-8#sie=lg;/m/0fp_8fm;2;/m/030q7;lb;fp;1;;;",
        }}
      />
    </Screen>
  )
}

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}


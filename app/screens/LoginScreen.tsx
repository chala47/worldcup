import { ApiResponse, create } from "apisauce"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { AuthResponse } from "../services/api"
import { getGeneralApiProblem } from "../services/api/apiProblem"
import { colors, spacing } from "../theme"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [errorMessage, seterrorMessage] = useState("")
  const {
    authenticationStore: {
      authEmail,
      authPassword,
      setAuthEmail,
      setAuthPassword,
      setAuthToken,
      validationErrors,
    },
  } = useStores()

  useEffect(() => {
    // Here is where you could fetch credientials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("")
    setAuthPassword("")
  }, [])

  const errors: typeof validationErrors = isSubmitted ? validationErrors : ({} as any)

  function login() {
    const api = create({
      baseURL: "",
      headers: {
        Accept: "application/json",
      },
    })

    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (Object.values(validationErrors).some((v) => !!v)) return

    api
      .post("http://api.cup2022.ir/api/v1/user/login", { email: authEmail, password: authPassword })
      .then((response: ApiResponse<AuthResponse>) => {
        try {
          if (!response.ok) {
            console.log("error", response)
            const problem = getGeneralApiProblem(response)
            seterrorMessage(JSON.stringify(problem))
            if (problem) return problem
          }
          const rawData = response?.data
          setAuthToken(rawData.data.token)
          setIsSubmitted(false)
          setAuthPassword("")
          setAuthEmail("")
        } catch (err) {}
      })
      .catch((errors) => {
        seterrorMessage(errors.message)
      })

    // We'll mock this with a fake token.
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  useEffect(() => {
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [])

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      backgroundColor="#8a1538"
    >
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={errors?.authEmail}
        status={errors?.authEmail ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
        LabelTextProps={{ style: { color: "white" } }}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        LabelTextProps={{ style: { color: "white" } }}
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        helper={errors?.authPassword}
        status={errors?.authPassword ? "error" : undefined}
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={login}
      />
      <Text>{errorMessage}</Text>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
  marginTop: spacing.huge,
}

const $signIn: TextStyle = {
  color: "white",
  marginBottom: spacing.small,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
}

// @demo remove-file

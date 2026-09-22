// ==============================
// IMPORTS
// ==============================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useResponsive } from "../../utils/responsive";

// ==============================
// COMPONENT
// ==============================

export default function Login() {
  const { width, moderateScale, moderateVerticalScale, wp, hp } =
    useResponsive();

  // ==============================
  // STATE
  // ==============================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ==============================
  // HANDLERS
  // ==============================

  const handleLogin = () => {
    // Backend authentication will be added later.
    router.replace({
      pathname: "/home",
      params: { userName: email.trim().split("@")[0] || "User" },
    });
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: wp(6),
            paddingTop: hp(5),
            paddingBottom: hp(4),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ==============================
            DECORATIVE HEADER
        ============================== */}

        <View
          style={[
            styles.illustrationContainer,
            {
              width: moderateScale(105),
              height: moderateScale(105),
              borderRadius: moderateScale(52.5),
            },
          ]}
        >
          <View
            style={[
              styles.decorativeCircle,
              {
                width: moderateScale(85),
                height: moderateScale(85),
                borderRadius: moderateScale(42.5),
              },
            ]}
          >
            <MaterialCommunityIcons
              name="bus-marker"
              size={moderateScale(48)}
              color="#008383"
            />
          </View>

          <View
            style={[
              styles.smallDot,
              {
                width: moderateScale(12),
                height: moderateScale(12),
                borderRadius: moderateScale(6),
                right: moderateScale(2),
                top: moderateScale(8),
              },
            ]}
          />

          <View
            style={[
              styles.smallDot,
              {
                width: moderateScale(8),
                height: moderateScale(8),
                borderRadius: moderateScale(4),
                left: moderateScale(4),
                bottom: moderateScale(15),
              },
            ]}
          />
        </View>

        {/* ==============================
            TITLE
        ============================== */}

        <Text
          style={[
            styles.title,
            {
              fontSize: moderateScale(27),
              marginTop: moderateVerticalScale(20),
            },
          ]}
        >
          Welcome Back!
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: moderateScale(14),
              marginTop: moderateVerticalScale(7),
            },
          ]}
        >
          Continue your journey with us
        </Text>

        {/* ==============================
            FORM
        ============================== */}

        <View style={{ marginTop: moderateVerticalScale(32) }}>
          {/* Email */}

          <Text style={[styles.label, { fontSize: moderateScale(13) }]}>
            Email Address
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                height: moderateVerticalScale(52),
                borderRadius: moderateScale(13),
                marginTop: moderateVerticalScale(8),
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={moderateScale(20)}
              color="#7A8585"
            />

            <TextInput
              style={[
                styles.input,
                {
                  fontSize: moderateScale(14),
                  marginLeft: moderateScale(10),
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor="#9AA4A4"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}

          <Text
            style={[
              styles.label,
              {
                fontSize: moderateScale(13),
                marginTop: moderateVerticalScale(19),
              },
            ]}
          >
            Password
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                height: moderateVerticalScale(52),
                borderRadius: moderateScale(13),
                marginTop: moderateVerticalScale(8),
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={moderateScale(20)}
              color="#7A8585"
            />

            <TextInput
              style={[
                styles.input,
                {
                  fontSize: moderateScale(14),
                  marginLeft: moderateScale(10),
                },
              ]}
              placeholder="Enter your password"
              placeholderTextColor="#9AA4A4"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={moderateScale(20)}
                color="#7A8585"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}

          <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
            <Text style={[styles.forgotText, { fontSize: moderateScale(13) }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                width:wp(90),
                height: moderateVerticalScale(53),
                borderRadius: moderateScale(14),
                marginTop: moderateVerticalScale(24),
              },
            ]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { fontSize: moderateScale(15) },
              ]}
            >
              Login
            </Text>

            <Ionicons
              name="arrow-forward"
              size={moderateScale(19)}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* ==============================
            SIGN UP LINK
        ============================== */}

        <View
          style={[
            styles.bottomTextContainer,
            { marginTop: moderateVerticalScale(28) },
          ]}
        >
          <Text style={[styles.bottomText, { fontSize: moderateScale(13) }]}>
            Don't have an account?
          </Text>

          <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
            <Text
              style={[
                styles.linkText,
                {
                  fontSize: moderateScale(13),
                  marginLeft: moderateScale(5),
                },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* ==============================
            GUEST OPTION
        ============================== */}

        <TouchableOpacity
          style={[
            styles.guestButton,
            {
              marginTop: moderateVerticalScale(20),
              paddingVertical: moderateVerticalScale(10),
            },
          ]}
          onPress={() => router.replace("/home")}
          activeOpacity={0.7}
        >
          <Text style={[styles.guestText, { fontSize: moderateScale(12.5) }]}>
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==============================
// STYLES
// ==============================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },

  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  decorativeCircle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF5F4",
  },

  smallDot: {
    position: "absolute",
    backgroundColor: "#008383",
    opacity: 0.35,
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#123B3A",
    textAlign: "center",
  },

  subtitle: {
    fontFamily: "Poppins_400Regular",
    color: "#687474",
    textAlign: "center",
  },

  label: {
    fontFamily: "Poppins_500Medium",
    color: "#123B3A",
  },

  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#DDE7E6",
    backgroundColor: "#FAFCFC",
  },

  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    color: "#123B3A",
    paddingVertical: 0,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 10,
  },

  forgotText: {
    fontFamily: "Poppins_500Medium",
    color: "#008383",
  },

  primaryButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#008383",
    gap: 9,
  },

  primaryButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
  },

  bottomTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomText: {
    fontFamily: "Poppins_400Regular",
    color: "#687474",
  },

  linkText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#008383",
  },

  guestButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  guestText: {
    fontFamily: "Poppins_500Medium",
    color: "#687474",
  },
});

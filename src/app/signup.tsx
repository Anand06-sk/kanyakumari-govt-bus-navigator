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

export default function SignUp() {
  const { moderateScale, moderateVerticalScale, wp, hp } = useResponsive();

  // ==============================
  // STATE
  // ==============================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ==============================
  // HANDLERS
  // ==============================

  const handleCreateAccount = () => {
    // Backend account creation will be added later.
    router.replace({
      pathname: "/home",
      params: { userName: name.trim() || "User" },
    });
  };

  const handleLogin = () => {
    router.push("/login");
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
            paddingTop: hp(3.5),
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
              width: moderateScale(95),
              height: moderateScale(95),
              borderRadius: moderateScale(47.5),
            },
          ]}
        >
          <View
            style={[
              styles.decorativeCircle,
              {
                width: moderateScale(78),
                height: moderateScale(78),
                borderRadius: moderateScale(39),
              },
            ]}
          >
            <MaterialCommunityIcons
              name="map-marker-plus-outline"
              size={moderateScale(42)}
              color="#008383"
            />
          </View>

          <View
            style={[
              styles.smallDot,
              {
                width: moderateScale(11),
                height: moderateScale(11),
                borderRadius: moderateScale(5.5),
                right: moderateScale(0),
                top: moderateScale(7),
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
                left: moderateScale(1),
                bottom: moderateScale(12),
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
              fontSize: moderateScale(26),
              marginTop: moderateVerticalScale(15),
            },
          ]}
        >
          Create Your Account
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: moderateScale(14),
              marginTop: moderateVerticalScale(6),
            },
          ]}
        >
          Start your journey with us
        </Text>

        {/* ==============================
            FORM
        ============================== */}

        <View style={{ marginTop: moderateVerticalScale(25) }}>
          {/* Full Name */}

          <Text style={[styles.label, { fontSize: moderateScale(13) }]}>
            Full Name
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                height: moderateVerticalScale(50),
                borderRadius: moderateScale(13),
                marginTop: moderateVerticalScale(7),
              },
            ]}
          >
            <Ionicons
              name="person-outline"
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
              placeholder="Enter your name"
              placeholderTextColor="#9AA4A4"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Email */}

          <Text
            style={[
              styles.label,
              {
                fontSize: moderateScale(13),
                marginTop: moderateVerticalScale(15),
              },
            ]}
          >
            Email Address
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                height: moderateVerticalScale(50),
                borderRadius: moderateScale(13),
                marginTop: moderateVerticalScale(7),
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
                marginTop: moderateVerticalScale(15),
              },
            ]}
          >
            Password
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                height: moderateVerticalScale(50),
                borderRadius: moderateScale(13),
                marginTop: moderateVerticalScale(7),
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
              placeholder="Create a password"
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

          {/* Confirm Password */}

          <Text
            style={[
              styles.label,
              {
                fontSize: moderateScale(13),
                marginTop: moderateVerticalScale(15),
              },
            ]}
          >
            Confirm Password
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                height: moderateVerticalScale(50),
                borderRadius: moderateScale(13),
                marginTop: moderateVerticalScale(7),
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
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
              placeholder="Re-enter your password"
              placeholderTextColor="#9AA4A4"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={moderateScale(20)}
                color="#7A8585"
              />
            </TouchableOpacity>
          </View>

          {/* Create Account Button */}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                width:wp(90),
                height: moderateVerticalScale(53),
                borderRadius: moderateScale(14),
                marginTop: moderateVerticalScale(23),
              },
            ]}
            onPress={handleCreateAccount}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { fontSize: moderateScale(15) },
              ]}
            >
              Create Account
            </Text>

            <Ionicons
              name="arrow-forward"
              size={moderateScale(19)}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* ==============================
            LOGIN LINK
        ============================== */}

        <View
          style={[
            styles.bottomTextContainer,
            { marginTop: moderateVerticalScale(24) },
          ]}
        >
          <Text style={[styles.bottomText, { fontSize: moderateScale(13) }]}>
            Already have an account?
          </Text>

          <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
            <Text
              style={[
                styles.linkText,
                {
                  fontSize: moderateScale(13),
                  marginLeft: moderateScale(5),
                },
              ]}
            >
              Login
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
              marginTop: moderateVerticalScale(15),
              paddingVertical: moderateVerticalScale(9),
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

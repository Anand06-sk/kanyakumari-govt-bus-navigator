import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
export default function Welcome() {
  const router=useRouter();
  
  
  // Function used to navigate to Home Screen as a Guest
  const handleContinueAsGuest=()=>{
  router.replace("/home")
}
const handleLogin=()=>{
  router.push("/login")
}
const handleSignUp=()=>{
  router.push("/signup")
}

  return (
    <View style={styles.container}>

      {/* Welcome Context */}


      {/* IMAGE */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/welcome.png")}
          style={styles.image}
          resizeMode="cover"
        />
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.subTitle}>Let's Plan Your Journey</Text>
      </View>
      </View>
      

      {/* OPTIONS */}
      <View style={styles.optionsContainer}>

        {/* SIGN UP */}
        <TouchableOpacity style={styles.signUpButton} activeOpacity={0.8} onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>

        {/* LOGIN */}
        <TouchableOpacity style={styles.loginButton} activeOpacity={0.5} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* CONTINUE AS GUEST */}
        <TouchableOpacity style={styles.guestButton} onPress={handleContinueAsGuest}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  imageContainer: {
    position:"relative",
    flex: 0.65,
    width: "100%",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  optionsContainer: {
    flex:0.35,
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop:80,
    gap: 12,

  },

  signUpButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "#008C83",
    justifyContent: "center",
    alignItems: "center",
  },

  signUpText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },

  loginButton: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: "#008C83",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#008C83",
  },

  guestButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  guestText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#687474",
  },
  textContainer:{
    width:"100%",
    justifyContent:"center",
    position:"absolute",
    top:"80%",
    alignItems:"center",
   
   
  },
  welcomeText:{
    color:"#008C83",
    fontFamily:"Poppins_600SemiBold",
    fontSize:48,

  },
  subTitle:{
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    color:"#687351"

  },
});
import { StyleSheet, Text, View, Image, Pressable, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import "core-js/stable/atob";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
const ProfileScreen = () => {
    const [user, setUser] = useState("");
    const navigation = useNavigation()
    const { userId, setUserId } = useContext(UserType);
    const [option, setOption] = useState("Description");
    const [description, setDescription] = useState("");
    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await axios.get(
              `http://192.168.1.204:3000/profile/${userId}`
            );
            const { user } = response.data;
            setUser(user);
           
          } catch (error) {
            console.log("error", error);
          }
        };
    
        fetchProfile();
      });
      
    const updateUserDescription = async () => {
        try {
            const response = await axios.put(
                `http://192.168.1.204:3000/profile/${userId}/description`,
                {
                    description: description,
                }
            );
            console.log(response.data);

            if (response.status === 200) {
                Alert.alert("Success", "Description updated successfully");
            }
        } catch (error) {
            console.log("Error updating the user Description");
        }
    };

    const logout = () => {
        clearAuthToken();
    }
    const clearAuthToken = async () => {
        await AsyncStorage.removeItem("authToken");
        console.log("Cleared auth token");
        navigation.replace("Login")
    }


    return (
        <ScrollView style={{ marginTop: 55, padding: 15 }}>
            <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
                    <Text>{user.description}</Text>
                    <View
                        style={{
                            paddingHorizontal: 7,
                            paddingVertical: 5,
                            borderRadius: 8,
                            backgroundColor: "#D0D0D0",
                        }}
                    >
                        <Text>Threads.net</Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 20,
                        marginTop: 15,
                    }}
                >
                    <View>
                        <Image
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                resizeMode: "contain",
                            }}
                            source={{
                                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                            }}
                        />
                    </View>
                    <View>
                        <Pressable
                            onPress={logout}
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                                borderColor: "#D0D0D0",
                                borderWidth: 1,
                                borderRadius: 5,
                            }}
                        >
                            <Text>Logout</Text>
                        </Pressable>

                    </View>
                </View>
                <View>
                    <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
                        {user?.followers?.length} followers
                    </Text>
                </View>
                <View style={{ marginTop: 30, marginLeft: 15, flexDirection: "row", alignItems: "center", gap: 60 }}>
                    <Pressable onPress={() => setOption("Description")}>
                        <Text style={{ fontSize: 16, fontWeight: "500", color: option == "Description" ? "black" : "gray", }}>Description</Text>
                    </Pressable>
                    <Pressable onPress={() => setOption("Photos")}>
                        <Text style={{ fontSize: 16, fontWeight: "500", color: option == "Photos" ? "black" : "gray" }}>Photos</Text>
                    </Pressable>
                </View>
                <View>
                    <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
                        {option == "Description" && (
                            <View
                                style={{
                                    borderColor: "#202020",
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 10,
                                    height: 300,
                                }}
                            >
                                <TextInput
                                    value={description}
                                    multiline
                                    onChangeText={(text) => setDescription(text)}
                                    style={{

                                        fontSize: description ? 17 : 17,
                                    }}
                                    placeholder="Write your description "
                                //   placeholderTextColor={"black"}
                                />
                                <Pressable
                                    onPress={updateUserDescription}
                                    style={{
                                        marginTop: "auto",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 15,
                                        backgroundColor: "black",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        padding: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            textAlign: "center",
                                            fontSize: 15,
                                            fontWeight: "500",
                                        }}
                                    >
                                        Update your description
                                    </Text>

                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
export default ProfileScreen;

const styles = StyleSheet.create({});
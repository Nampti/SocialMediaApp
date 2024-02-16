import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import "core-js/stable/atob";
import { UserType } from "../UserContext";
import { useFocusEffect } from "@react-navigation/native";
const HomeScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            const token = await AsyncStorage.getItem("authToken");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            setUserId(userId);
        };

        fetchUsers();
    }, []);
    useEffect(() => {
        fetchPosts();
    }, []);
    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [])
    );
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://192.168.0.105:3000/get-posts");
            setPosts(response.data);
        } catch (error) {
            console.log("error fetching posts", error);
        }
    };

    console.log("posts", posts);

    return (
        <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <Image
                    style={{ width: 60, height: 40, resizeMode: "contain" }}
                    source={{
                        uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
                    }}
                />
            </View>
            <View style={{ marginTop: 20 }}>
                {posts?.map((post) => (
                    <View style={{
                        padding: 15,
                        borderColor: "#D0D0D0",
                        borderTopWidth: 1,
                        flexDirection: "row",
                        gap: 10,
                        marginVertical: 10,
                    }}>
                        <View>
                            <Image
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    resizeMode: "contain",
                                }}
                                source={{
                                    uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                                }}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
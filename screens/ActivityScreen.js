import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { UserType } from "../UserContext";
import axios from 'axios';
import User from '../components/User';

const ActivityScreen = () => {
    const [selectedButton, setSelectedButton] = useState("people");
    const [users, setUsers] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    
    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.userId;
                    setUserId(userId);
                    const response = await axios.get(`http://192.168.1.204:3000/user/${userId}`);
                    setUsers(response.data);
                }
            } catch (error) {
                console.log("Error", error);
            }
        };
        fetchUsers();
    }, []);

    console.log("users", users);
    return (
        <ScrollView style={{ marginTop: 50 }}>
            <View>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>ActivityScreen</Text>
                <View style={{ flexDirection: "row", alignItems: 'center', gap: 10, marginTop: 12 }}>
                    <TouchableOpacity
                        onPress={() => handleButtonClick("people")}
                        style={[
                            {
                                flex: 1,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                backgroundColor: "white",
                                borderColor: "#D0D0D0",
                                borderRadius: 6,
                                borderWidth: 0.7,
                            },
                            selectedButton === "people" ? { backgroundColor: "black" } : null,
                        ]}>
                        <Text
                            style={[
                                { textAlign: "center", fontWeight: "bold" },
                                selectedButton === "people"
                                    ? { color: "white" }
                                    : { color: "black" },
                            ]}
                        >
                            People
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleButtonClick("all")}
                        style={[
                            {
                                flex: 1,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                backgroundColor: "white",
                                borderColor: "#D0D0D0",
                                borderRadius: 6,
                                borderWidth: 0.7,
                            },
                            selectedButton === "all" ? { backgroundColor: "black" } : null,
                        ]}>
                        <Text
                            style={[
                                { textAlign: "center", fontWeight: "bold" },
                                selectedButton === "all"
                                    ? { color: "white" }
                                    : { color: "black" },
                            ]}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleButtonClick("requests")}
                        style={[
                            {
                                flex: 1,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                backgroundColor: "white",
                                borderColor: "#D0D0D0",
                                borderRadius: 6,
                                borderWidth: 0.7,
                            },
                            selectedButton === "requests" ? { backgroundColor: "black" } : null,
                        ]}>
                        <Text
                            style={[
                                { textAlign: "center", fontWeight: "bold" },
                                selectedButton === "requests"
                                    ? { color: "white" }
                                    : { color: "black" },
                            ]}
                        >
                            Requests
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {selectedButton === "people" && (
                        <View style={{ marginTop: 20 }}>
                            {users?.map((item, index) => (
                                <User key={index} item={item} />
                            ))}
                        </View>

                    )}
                </View>
            </View>
        </ScrollView >
    )
}

export default ActivityScreen

const styles = StyleSheet.create({})

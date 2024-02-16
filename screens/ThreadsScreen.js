import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native'
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import "core-js/stable/atob";
import { UserType } from "../UserContext";
import axios from 'axios';
const ThreadsScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [content, setContent] = useState("");
    const handlePostSubmit = () => {
        const postData = {
            userId,
        };

        if (content) {
            postData.content = content;
        }

        axios
            .post("http://192.168.0.105:3000/create-post", postData)
            .then((response) => {
                setContent("");
            })
            .catch((error) => {
                console.log("error creating post", error);
            });
    };
    return (
        <SafeAreaView style={{ padding: 10 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                }}
            >
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

                <Text>NamPTIT</Text>
            </View>

            <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <TextInput
                    value={content}
                    onChangeText={(text) => setContent(text)}
                    placeholderTextColor={"black"}
                    placeholder="Type your message..."
                    multiline
                />
            </View>

            <View style={{ marginTop: 20 }} />

            <Button onPress={handlePostSubmit} title="Share Post" />
        </SafeAreaView>
    );
};


export default ThreadsScreen

const styles = StyleSheet.create({})
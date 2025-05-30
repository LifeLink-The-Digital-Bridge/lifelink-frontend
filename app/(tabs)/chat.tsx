import ChatScreen from '../navigation/chatScreen';
import React from 'react';
import AppLayout from '../../components/AppLayout';
export default function chatScreen(){
    return (
        <AppLayout title="Chat">
        <ChatScreen />
        </AppLayout>
    );
};

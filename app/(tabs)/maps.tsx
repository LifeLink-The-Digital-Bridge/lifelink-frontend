import React from 'react';
import AppLayout from '../../components/AppLayout';
import MapScreen from '../navigation/mapScreen';
export default function chatScreen(){
    return (
        <AppLayout title="Maps">
        <MapScreen />
        </AppLayout>
    );
};

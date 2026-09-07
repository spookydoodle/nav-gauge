import { useState } from 'react';
import { View, Text } from 'react-native';
import { Popup } from './Popup';
import { Button } from '../button';

export const Overview = () => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={{ padding: 100 }}>
            <Button onPress={() => setVisible((v) => !v)}>Toggle Popup</Button>
            <Popup
                visible={visible}
                onClose={() => setVisible(false)}
                position={{ x: 250, y: 350 }}
                triggerAnchor="bottom-right"
                popupAnchor="top-right"
            >
                <View style={{ padding: 16, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f0f0f0', width: 220, height: 240 }}>
                    <Text>Popup's top-right corner at the anchor point; flips when it overflows the viewport.</Text>
                    <Button onPress={() => setVisible(false)}>Close</Button>
                </View>
            </Popup>
        </View>
    );
};
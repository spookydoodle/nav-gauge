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
                    <Text>Popup's top-right corner is anchored here; it returns after the viewport grows.</Text>
                    <Button onPress={() => setVisible(false)}>Close</Button>
                </View>
            </Popup>
        </View>
    );
};

export const NonModal = () => (
    <View style={{ padding: 100 }}>
        <Button>Underlying action</Button>
        <Popup modal={false} visible onClose={() => undefined} position={{ x: 250, y: 350 }}>
            <View style={{ padding: 16, backgroundColor: '#f0f0f0' }}>
                <Text>Touches outside this popup pass through.</Text>
            </View>
        </Popup>
    </View>
);

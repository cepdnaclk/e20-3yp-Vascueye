import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
    return (
        <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 VescuEye. All Rights Reserved.</Text>
        </View>
    );
};

export default Footer;

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
       
        paddingVertical: 10,
        alignItems: 'center',
    },
    footerText: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import messaging from '@react-native-firebase/messaging';

const requestPermission = async () => await messaging().requestPermission();

const getFcmToken = async () => {
  messaging()
    .getToken()
    .then(fcmToken => {
      // Send your fcmToken to your
      // database to use it for sending notifications
      return console.log('%c fcmToken', 'color: cyan', fcmToken);
    });
};

const initMessaging = async () => {
  const hasPermission = await messaging().hasPermission();

  if (hasPermission) {
    getFcmToken();
  } else {
    requestPermission();
  }
};

const App = () => {
  const [notificationData, setNotificationData] = React.useState('{}');

  React.useEffect(() => {
    initMessaging();
  }, []);

  React.useEffect(() => {
    const subscriptionToForegroundMessages = messaging().onMessage(
      async remoteMessage => {
        setNotificationData(JSON.stringify(remoteMessage, null, 2));
      },
    );

    return subscriptionToForegroundMessages;
  }, []);

  React.useEffect(() => {
    // Handle user interaction when the application is opened from a quit state
    messaging().onNotificationOpenedApp(remoteMessage => {
      setNotificationData(JSON.stringify(remoteMessage, null, 2));
    });

    // Handle user interaction when the application is running, but in the background
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          setNotificationData(JSON.stringify(remoteMessage, null, 2));
        }
      });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                Data from the notification
              </Text>
              <Text style={styles.sectionDescription}>{notificationData}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.lighter,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  sectionDescription: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0,0,0,.06)',
    borderColor: 'rgba(0,0,0,.13)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
});

export default App;

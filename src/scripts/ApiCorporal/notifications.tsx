import messaging from '@react-native-firebase/messaging';

export default class SystemNotifications {
    constructor() {}
    async init() {
        messaging().subscribeToTopic('all');
        await this.getPermission();
    }
    async getPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            console.log('Authorization status:', authStatus);
            return authStatus;
        }
    }
    async getTokenDevice(): Promise<string> {
        await messaging().registerDeviceForRemoteMessages();
        return await messaging().getToken();
    }
}
import {View, Text} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';
const Register = () => {
  return (
    <WebView
      source={{uri: 'https://apiforlearning.zendvn.com/users/create'}}
      style={{flex: 1}}
    />
  );
};

export default Register;

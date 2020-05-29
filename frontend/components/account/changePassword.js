import React, {useState} from 'react';
import { subscribe } from 'react-contextual';
import {  Text, View,StyleSheet, TouchableHighlight} from 'react-native';
import { Input, Badge} from 'react-native-elements';
import moment from 'moment';

import firebase from '../../firebase';
import * as validation from './validations';

/**
 * Change password screen
 * @param {Object} props - store of HOC 
 */
const ChangePassword = props => {
  
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [_errors , setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const onSave = async (password, newPassword) => {
    const errors_ = validation.password(password, newPassword);
    setErrors(errors_);
    console.log("why not print", Object.keys(errors_).length === 0)
    if( Object.keys(errors_).length === 0 ) 
    {
     try{
        const userInfo = firebase.auth().currentUser;

        const { email } = userInfo;
        const signedIn =firebase
        .auth()
        .signInWithEmailAndPassword(
          email,
          password
        ).then(async userInfo => {

          userInfo.user.updatePassword(newPassword);    
          setSuccess(true);
          setNewPassword('');
          setPassword('');
        })
        .catch(err => {
          let error = {};
          error.newPassword = err.message;
          // console.log("what went wrong?", err)
          setErrors(error);
        });
      } catch (err) {
      let error = {};
      error.newPassword = err.message;
      setErrors(error);
      // console.log("err from change email", err);
    }
  } else {
      setErrors(errors_);
      console.log("checkout nukk", _errors.password)
    } 
  }
  // console.log("screen-----", props.user.previousScreen)
  return(
    <View style={{...styles.centeredView}}>
      <View style={styles.modalView}>
        <View style={{paddingBottom: 40, justifyContent: 'center'}}> 
          { success && <Badge  
            value="Successfully update your password!!"
            status="success"
            /> }
        </View>
        <View style={{ paddingBottom: 20}}>
          <Input
            secureTextEntry={true}
            label="Current Passoword"
            value={password}
            onChangeText={text => {
              setErrors({})
              setSuccess(false);
              setPassword(text);
            }}
            errorStyle={{ color: 'red' }}
            errorMessage={_errors.password === null? '' :_errors.password}
          />
        </View>
        <View style={{ paddingBottom: 20}}>
          <Input
            secureTextEntry={true}
            label="New Password"
            value={newPassword}           
            onChangeText={text => {
              setErrors({})
              setSuccess(false);
              setNewPassword(text);
            
            }}
            errorMessage={ _errors.newPassword === null ? '': _errors.newPassword}
            errorStyle={{ color: 'red' }}
          />
        </View>

  
        <View style={{backgroundColor: 'white', paddingTop: 50 ,paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent:'space-between'}}>
          <TouchableHighlight
            style={{ ...styles.openButton,width: '45%', backgroundColor: "#ff6363"}}
            onPress={() => {
              setSuccess(false);
              props.navigation.navigate('Account');
            }}
          >
            <Text style={styles.textStyle}>
              Cancel
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{ ...styles.openButton,width: '45%', backgroundColor: "#2196F3"}}
            onPress={() => {
              setSuccess(false);
              setErrors({});
              onSave(password, newPassword);
            }}
          >
            <Text style={styles.textStyle}>
              Save
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  )
};

export default subscribe()(ChangePassword);


const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    width: '100%',
    alignItems: "center"
  },
  modalView: {
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
    width: '100%',
    height: '100%',
    backgroundColor: "white",
    paddingRight: 35,
    paddingLeft: 35,
    paddingBottom: 35,
    paddingTop: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

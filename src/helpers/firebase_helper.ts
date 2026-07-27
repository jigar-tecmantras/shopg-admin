import firebase from 'firebase/compat/app';

// Add the Firebase products that you want to use
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

class FirebaseAuthBackend {
  constructor(firebaseConfig: any) {
    if (firebaseConfig != null) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged((user: any) => {
        if (user != null) {
          localStorage.setItem('authUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('authUser');
        }
      });
    }
  }

  /**
   * Registers the user with given details
   */
  registerUser = async (email: any, password: any): Promise<any> => {
    return await new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          () => {
            resolve(firebase.auth().currentUser);
          },
          (error: any): void => {
            reject(error);
          },
        );
    });
  };

  /**
   * Registers the user with given details
   */
  editProfileAPI = async (email: any, password: any): Promise<any> => {
    return await new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          () => {
            resolve(firebase.auth().currentUser);
          },
          (error: any) => {
            reject(error);
          },
        );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = async (email: any, password: any): Promise<any> => {
    return await new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          () => {
            resolve(firebase.auth().currentUser);
          },
          (error: any) => {
            reject(error);
          },
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = async (email: any): Promise<any> => {
    return await new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url:
            window.location.protocol + '//' + window.location.host + '/login',
        })
        .then(() => {
          resolve(true);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  };

  /**
   * Logout the user
   */
  logout = async (): Promise<boolean> => {
    return await new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          resolve(true);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  };

  /**
   * Social Login user with given details
   */
  socialLoginUser = async (type: any): Promise<any> => {
    let provider: any;
    if (type === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (type === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    const result = await firebase.auth().signInWithPopup(provider);
    return result.user;
  };

  addNewUserToFirestore = (user: any): {user: any; details: any} => {
    // const collection = firebase.firestore().collection('users');
    const {profile} = user.additionalUserInfo;
    const details = {
      // firstName: profile.given_name ? profile.given_name : profile.first_name,
      // lastName: profile.family_name ? profile.family_name : profile.last_name,
      fullName: profile.name,
      email: profile.email,
      picture: profile.picture,
      createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginTime: firebase.firestore.FieldValue.serverTimestamp(),
    };
    // collection.doc(firebase.auth().currentUser?.uid).set(details);
    return {user, details};
  };

  setLoggeedInUser = (user: any): void => {
    localStorage.setItem('authUser', JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = (): any | null => {
    if (localStorage.getItem('authUser') === null) return null;
    return JSON.parse(localStorage.getItem('authUser') ?? '');
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error: any): void {
    // var errorCode = error.code;
    const errorMessage = error.message;
    return errorMessage;
  }
}

let _fireBaseBackend: any = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config: any): void => {
  if (_fireBaseBackend === null) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = (): any => {
  return _fireBaseBackend;
};

export {initFirebaseBackend, getFirebaseBackend};

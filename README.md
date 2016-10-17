Tapitoo Mobile-Store Code Structure and Deployment


Contents

** Overview
** Development
** Code structure
** css folder
** Configure color code of the app
** img folder
** js folder
** Configure App Settings
** Configure Push Notification
** Configure Facebook
** lib folder
** res folder
** templates folder
** config.xml file
** index.html file
** Deployment
** Phonegap (recommended)



** Overview


The application root directory contains the following folders and files.
app
css
img
lib
res
templates
config.xml
index.html
Development

The mobile-store app is a hybrid application written in HTML, CSS and Javascript using Ionic Framework for UI/UX design and it’s mobile-focused components, and AngularJS framework for interacting with the e-commerce framework.
The favorite IDE can be used for editing but we recommend NetBeans IDE 8.0 because of it’s out of the box integration with AngularJS.

** Code structure
** css folder
This folder contains the css files used to style the application. These are:
fonts folder : contains fonts used in the app
images folder : contains app logo
animate.css : animations used throughout the app
style.css : custom added css to change the UI look
Configure color code of the app

To change the background and colors of the app you have to configure the fields located in style.css 
under  /* --- General rules --- */ which are: 

Background:

.calm-bg, body{
   background: url(../img/bg.jpg);
}

Active buttons

.button-calm{
    background-color: #D95D02 !important;
    border-color: #D95D02 !important;
}

.button-balanced{
    background-color: #ed1c24 !important;
    border-color: #ed1c24 !important;
}

.custom-style.activated{
    color:white !important;
    background: #D95D02 !important;
}

Any other individual styles can be easily changed from this file.

** img folder
This is where the app logos are found and can be changed for custom apps.

** js folder
This is folder contains scripts that are used throughout the application. These are:
app.js : contains the app’s initial configuration
app.config.js : contains the routes for communication with OpenCart through http requests and constants for OneSignal id and google project number for push notifications
app.routes.js : contains the app routes 
Components folder : contains controllers used for each main component: cart, menu, user
Directives folder : contains starRating directive used for review ratings and horizontalScroll directive used for scrolling in the app
Services folder : contains services used by different controllers throughout the app
AccountService : http calls for user operations
CartService : http calls for cart operations
CheckoutProcessService : http calls for checkout process
CheckoutService : http calls for checkout page
CommonService : http calls for custom modules (featuredCategory, banner, geocoding)
ProductService : http calls for product page
StartUpService : http calls for initialization (get opencart token, init OneSignal)

** Configure App Settings 

In app.config.js we have to set the variable backend with the url the opencart framework is located and also the image_url and payment variables

var backend = 'http://www.tapitoo.com/demo-shop/api/v1';
var image_url = 'http://www.tapitoo.com/demo-shop/image/';
var payment = 'http://www.tapitoo.com/demo-shop/index.php?route=payment'

** Configure Push Notification

To receive push notifications on Android  you'll need to set up a Google API project, to generate your server api key. You can follow the steps from OneSignal official documentation 

https://documentation.onesignal.com/docs/generate-a-google-server-api-key

After you generated the server api key you’ll have to change it In the app.config.js file 
            GOOGLE_PROJECT_NUMBER : '1049754901328',



More details on how to use this plugin can be found here: 
https://documentation.onesignal.com/docs/product-overview

** lib folder

This folder contains the ionic and AngulaJS libraries and has the following subfolders
css : contains ionic.css
fonts : contains ionicons which is a font for the icons used in the app
js : contains ionic.bundle.js which is a concatenation of:
ionic.js,
angular.js
angular-animate.js
angular-sanitize.js
angular-ui-router.js
ionic-angular.js 

** res folder

This folder contains the necessary resources for building the app and it’s composed from two folders:
icon folder : contains the icons with different dpi for Android and iOS platforms
screen folder: contains the  app splashscreens with different dpi for both Android and iOS plarforms

** templates folder

This folder contains the templates for the different views of the app.


** config.xml file

In this file we configure the app details.
bundle id:  widget id="com.tapitoo.opencart2010"
app version: version="1.0.0"
app name: <name>Tapitoo Opencart</name>
app description: <description> Mobile Store </description>



index.html file
This file contains the app initialization and the scripts and css files sources


** Deployment

** Phonegap (recommended)

Create a Phonegap account, and log in.
https://build.phonegap.com

1. Configure the application
In the config.xml file configure the app name, bundle id and version number.

2. Generate keys for iOS and Android

Android
Generate a release keystore following these instructions http://www.darshanrane.com/blog/index.php/generating-android-keystore-file/

With these key will also have to generate a key hash to register the app on Facebook 
keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | openssl sha1 -binary | openssl base64
For further details you can refer to this link :
https://developers.facebook.com/docs/android/getting-started/

iOS
Generate  .p12  and .mobileprovision files following these instructions
https://github.com/amirudin/build/wiki/iOS-Signing

These 2 files will also be used for to generate a .pem and .ck file which you will upload on the admin so you can send push notifications on iOS. Please look at the Admin Code Structure and Description for further info/

After you generated the files for iOS and Android upload them to your Phonegap account unde Signing keys and unlock them using the passwords assigned during creation.

3. Build app on Phonegap

Archive the whole folder as a zip and upload it to phonegap. After the build has finished you can either download the .apk for Android and .ipa for iOS, or scan the QR code on the page with an Android or iOS device




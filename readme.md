# Urza's helper
An app for managing your magic the gathering collection
 - VIDEO DEMO: https://youtube.com/shorts/2HR-Mv6dQ3A?feature=share

## How to run the project locally
* Clone the project to your computer
* Install the packages in package.json
* Run the app with "npx expo"
* download the "Expo Go" app to your phone
* If the scanning feature is not working (The remote API may be down):
  * Set up the API from the following github repo: https://github.com/safirestorm/UrzasLittleHelper
  * run it with fastapi dev API.py --host 0.0.0.0
  * Identify your local network IP adress
  * In "scanPage.js" line 309, update the IP adress to your PC's adress

### Features
* Create a user with e-mail and password
* View your own, private collection
    * Filter by name, color, text or most other attributes
    * Sort by name, mana value or coolness
    * Track the value of your cards
    * Track the total value of your collection
* Scan cards with your camera to add them to your collection
* View your profile and change your profile image

### Powered by firebase
Your collection is safely stored on firebase, along with your user credentials.

### AI Scanning of cards
Using a custom API we are able to scan your cards and add them to your collection. 
 - Note: This feature is working, but may not be currently available depending on whether or not it operational. Please refer to the video demo for a demonstration of this feature.

Have fun managing your collection with URZA'S HELPER!

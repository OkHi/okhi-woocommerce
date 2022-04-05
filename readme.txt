=== OkHi woocommerce ===
Tags: OkHi, high accuracy addresses, locations, customise woocommerce checkout fields, pluscodes
Contributors: OkHi
Requires at least: 4.0
Stable tag: 1.3.7
Requires PHP: 5.2.4
Tested up to: 5.9

Increase conversion, lower costs and grow faster with OkHi

== Description ==

All woocommerce default checkout fields such as country, state, etc would be removed or hidden to remain with only
First name
Last name
Phone
and a button to enable the user to launch the OkHi experience select an OkHi location.

This plugin uses OkHi location service for two purposes:

1. To seamlessly collect accurate location information for the customer.
   This plugin uses the OkHi Locations API to check whether the user has an existing OkHi location which is then displayed on the address card. If the user doesn’t have an existing location or they would like to use a different one for that transaction, they are asked to create a new one. See [documentation for the OkHi Locations API](https://docs.okhi.co/integrating-okhi/okhi-on-your-website?utm_source=okhi-woocommerce-plugin%20readme).

2) To enable you to view location based used insights e.g. see your location heatmap of your customers based on a specific parameter such order or frequency or product type.
   This plugin uses the OkHi Interactions API to send the interactions data to OkHi post-checkout so you can view it on the OKHi Insights dashboard. See [documentation for OkHi Insights API](https://docs.okhi.co/interactions?utm_source=okhi-woocommerce-plugin%20readme)

Once you install the plugin, you will need an api key from OkHi, visit [our business page](https://www.okhi.com/business?utm_source=okhi-woocommerce-plugin%20readme) to sign up for one.

Visit [okhi.com](https://www.okhi.com/?utm_source=okhi-woocommerce-plugin%20readme) for more details about OkHi.

View our privacy policy [here](https://www.okhi.com/privacy?utm_source=okhi-woocommerce-plugin%20readme) and our [terms](https://www.okhi.com/terms?utm_source=okhi-woocommerce-plugin%20readme)

Should you need help, reach us at [@letsokhi](https://twitter.com/letsokhi) on twitter.

== Installation ==

1. Download the plugin file to your computer and unzip it
2. Using an FTP program, or your hosting control panel, upload the unzipped plugin folder to your WordPress installation’s wp-content/plugins/ directory.
3. Activate the plugin from the Plugins menu within the WordPress admin.
4. Don't forget to configure your API key and switch to production once done testing

Or use the automatic installation wizard through your admin panel, just search for “OkHi woocommerce”


== Changelog ==

= 1.3.7 =
-   **Feature**: Added city, state to address details
-   **Feature**: Added dark mode
-   **Clean up**: Removed unused properties

= 1.3.5 =
-   **Fix**: Clear errors on successful address selection

= 1.3.4 =
-   **Feature**: Added an option to toggle to the door information
-   **Fix**: Show site name on the modal header

= 1.3.3 =
-   **Feature**: Tested on woocommerce 6.2.0
-   **Feature**: Minified js

= 1.3.0 =

-   **Feature**: New and Improved User Interface 
-   **Feature**: New and Improved User Interface 
-   **Feature**: Lower friction to create and manage addresses
-   **Feature**: Increased speed
-   **Feature**: More developer freedom with the UI


= 1.2.4 =

-   **Feature**: Added switch to toggle between test mode and live

= 1.2.3 =

-   **Feature**: Faster address creation with introduction of OkHi location tokens

= 1.2.2 =

-   **Bugfix**: Fixed issue with plugin settings link applying to all plugins

= 1.2.1 =

-   **Bugfix**: Fail more gracefully when a fatal error occurs

= 1.2.0 =

-   **Feature**: Improved reliability, speed and security
-   **Feature**: Internationalisation: We have added a requirement for [E.164 formated](https://en.wikipedia.org/wiki/E.164) phone numbers
-   **Changes**: Make sure to get updated API keys as your current ones will not work for this new release
-   **Changes**: The street view is on by default, but you have the provision to it switch off
-   **Changes**: We have also updated our privacy policy, [see the new policy here](https://www.okhi.com/privacy?utm_source=okhi-woocommerce-plugin%20readme) and our [terms](https://www.okhi.com/terms?utm_source=okhi-woocommerce-plugin%20readme).
-   **Bugfix**: Fixed the issue that was allowing logged in users to checkout without an OkHi address.

= 1.1.0 =

-   **Feature**: Address creation with streetview
-   **Feature**: Provision for a custom theme primary color
-   **Changes**: Disabled auto transition from button to address card

= 1.0.7 =

-   Bugfix: update address card when the phone number changes
-   Added a switch to send checkouts to OkQueue app
-   Added shipping details to address interaction payload

= 1.0.4 =

-   Bugfix: Reset a field value if the OkHi API returns an empty value for it

= 1.0.3 =

-   Removed OkHi data and OkHi ID from the top of edit order details page
-   Removed country and zip code from all formatted billing addresses to reduce confusion
-   Submit checkout data once user hits the thank you page
-   Documentation love to links with markdown syntax

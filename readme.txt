=== OkHi woocommerce ===
Tags: OkHi, high accuracy addresses, locations, customise woocommerce checkout fields, pluscodes
Contributors: OkHi
Requires at least: 4.0
Stable tag: 1.0.2
Requires PHP: 5.2.4
Tested up to: 5.1

This plugin enables your users to checkout with OkHi locations

== Description ==

All woocommerce default checkout fields such as country, state, etc would be removed or hidden to remain with only
First name
Last name
Phone
and a button to enable the user to launch the OkHi experience select an OkHi location.

This plugin uses OkHi location service for two purposes:


 To seamlessly collect accurate location information for the customer. 
This plugin uses the OkHi Locations API to check whether the user has an existing OkHi location which is then displayed on the address card. If the user doesn’t have an existing location or they would like to use a different one for that transaction, they are asked to create a new one. See documentation for the OkHi Locations API here: https://docs.okhi.co/integrating-okhi/okhi-on-your-website


To enable you to view location based used insights e.g. see your location heatmap of your customers based on a specific parameter such order or frequency or product type.
This plugin uses the OkHi Interactions API to send the interactions data to OkHi post-checkout so you can view it on the OKHi Insights dashboard. See documentation for OkHi Insights API here: https://docs.okhi.co/interactions

Once you install the plugin, you will need an api key from OkHi, visit https://www.okhi.com/business to sign up for one.

Visit http://www.okhi.com/ for more details about OkHi.

Privacy policy: http://www.okhi.com/security

Should you need help, reach us at @letsokhi on twitter.

== Installation ==

1. Download the plugin file to your computer and unzip it
2. Using an FTP program, or your hosting control panel, upload the unzipped plugin folder to your WordPress installation’s wp-content/plugins/ directory.
3. Activate the plugin from the Plugins menu within the WordPress admin.
4. Don't forget to configure your API key and switch to production once done testing

Or use the automatic installation wizard through your admin panel, just search for “OkHi woocommerce”
